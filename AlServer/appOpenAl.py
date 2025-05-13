from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
import os
import logging
import psutil
import gc
import re
from googletrans import Translator

# Thiết lập logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Khởi tạo Google Translator
translator = Translator()

# Chỉ định thư mục model
model_path = "D:/huggingface_cache/mixtral-7B-instruct-v0.2"

# Kiểm tra bộ nhớ
def check_memory():
    ram = psutil.virtual_memory()
    logger.info(f"Available RAM: {ram.available / (1024**3):.2f} GB")
    if torch.cuda.is_available():
        logger.info(f"GPU Memory: {torch.cuda.get_device_properties(0).total_memory / (1024**3):.2f} GB")

# Khởi tạo model và tokenizer
def initialize_model():
    try:
        # Kiểm tra thư mục model
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Thư mục {model_path} không tồn tại.")
        if not os.path.exists(os.path.join(model_path, "config.json")):
            raise FileNotFoundError(f"File config.json không tìm thấy trong {model_path}.")

        logger.info("Loading tokenizer...")
        tokenizer = AutoTokenizer.from_pretrained(
            model_path,
            local_files_only=True
        )
        
        logger.info("Loading model...")
        # Thử load model với GPU trước
        if torch.cuda.is_available():
            try:
                model = AutoModelForCausalLM.from_pretrained(
                    model_path,
                    torch_dtype=torch.float16,  # Sử dụng float16 để tiết kiệm bộ nhớ
                    device_map="auto",
                    local_files_only=True
                )
                logger.info("Model loaded successfully on GPU")
                return model, tokenizer
            except Exception as e:
                logger.warning(f"Failed to load model on GPU: {e}")
        
        # Fallback to CPU nếu không có GPU hoặc load GPU thất bại
        model = AutoModelForCausalLM.from_pretrained(
            model_path,
            torch_dtype=torch.float32,
            device_map="cpu",
            local_files_only=True
        )
        logger.info("Model loaded successfully on CPU")
        return model, tokenizer
        
    except Exception as e:
        logger.error(f"Error initializing model: {e}")
        raise

# Khởi tạo model và tokenizer
check_memory()
model, tokenizer = initialize_model()

def format_prompt(text):
    # Định dạng prompt cho Mistral-7B, sử dụng tiếng Anh để tận dụng khả năng đa ngôn ngữ
    return f"""Please provide a concise explanation of the meaning, example sentence, and usage of the Japanese word "{text}" in Japanese. Then, translate the explanation into Vietnamese.

    ===Explanation in Japanese===
    1. 意味:
    2. 例文:
    3. 使い方:

    ===Translation in Vietnamese===
    1. Nghĩa:
    2. Ví dụ:
    3. Cách dùng:
    """

def clean_text(text):
    """Làm sạch văn bản, loại bỏ các phần không liên quan"""
    text = re.sub(r'<0x[A-Fa-f0-9]+>', '', text)
    return text

def extract_explanation(raw_text, word):
    """Phân tích và trích xuất phần giải thích từ vựng từ phản hồi"""
    logger.info(f"Extracting explanation for word: {word}")
    
    # Đảm bảo raw_text là chuỗi
    if not isinstance(raw_text, str):
        logger.warning(f"raw_text is not a string: {type(raw_text)}")
        raw_text = str(raw_text)
    
    # Làm sạch văn bản
    raw_text = clean_text(raw_text)
    
    # Tìm phần tiếng Nhật và tiếng Việt
    jp_pattern = r"===Explanation in Japanese===\s*(.*?)(?===Translation in Vietnamese===|\Z)"
    vn_pattern = r"===Translation in Vietnamese===\s*(.*?)(?=\Z)"
    
    jp_match = re.search(jp_pattern, raw_text, re.DOTALL)
    vn_match = re.search(vn_pattern, raw_text, re.DOTALL)
    
    # Fallback nếu không tìm thấy định dạng mong muốn
    if not jp_match:
        meaning_index = raw_text.find("意味:")
        if meaning_index >= 0:
            jp_content = raw_text[meaning_index:]
            vn_index = jp_content.find("Translation in Vietnamese:")
            if vn_index >= 0:
                jp_content = jp_content[:vn_index].strip()
                vn_content = jp_content[vn_index + len("Translation in Vietnamese:"):].strip()
            else:
                vn_content = ""
        else:
            jp_content = raw_text
            vn_content = ""
    else:
        jp_content = jp_match.group(1).strip()
        vn_content = vn_match.group(1).strip() if vn_match else ""
    
    # Nếu không tìm thấy phần tiếng Việt hoặc phần đó không đúng định dạng, dùng Google Translate
    if not vn_content or "Nghĩa:" not in vn_content:
        try:
            logger.info("Using Google Translate for Vietnamese translation")
            translation = translator.translate(jp_content, src='ja', dest='vi')
            vn_content = translation.text
        except Exception as e:
            logger.error(f"Google Translate error: {str(e)}")
            vn_content = "Không thể dịch do lỗi."
    
    # Cấu trúc dữ liệu trả về
    result = {
        "日本語": jp_content,
        "ベトナム語訳": vn_content
    }
    
    logger.info(f"Extracted explanation: {result}")
    return result

@app.route('/generate', methods=['POST'])
def generate():
    try:
        logger.info("Received request")
        data = request.json
        logger.info(f"Received data: {data}")
        
        text = data.get('text', '')
        if not text:
            return jsonify({
                'success': False,
                'error': 'No text provided'
            }), 400
            
        logger.info(f"Text to process: {text}")
        
        # Format prompt
        prompt = format_prompt(text)
        logger.info(f"Formatted prompt: {prompt}")
        
        # Tokenize input
        inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
        logger.info("Input tokenized")
        
        # Generate response
        logger.info("Generating response...")
        with torch.no_grad():
            outputs = model.generate(
                inputs["input_ids"],
                max_new_tokens=300,
                temperature=0.7,
                top_p=0.9,
                do_sample=True,
                pad_token_id=tokenizer.eos_token_id,
                repetition_penalty=1.2
            )
        logger.info("Response generated")
        
        # Decode response
        response = tokenizer.decode(outputs[0], skip_special_tokens=True)
        logger.info(f"Raw response: {response}")
        
        # Remove prompt from response if it exists
        if response.startswith(prompt):
            response = response[len(prompt):].strip()
        
        # Phân tích và trích xuất giải thích
        explanation = extract_explanation(response, text)
        
        # Giải phóng bộ nhớ
        del outputs
        gc.collect()
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
        
        return jsonify({
            'success': True,
            'response': explanation
        })
        
    except Exception as e:
        logger.error(f"Error occurred: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    logger.info("Server starting on http://localhost:5000")
    app.run(port=5000, debug=False)