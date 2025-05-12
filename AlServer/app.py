from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
import os
import gc  # Để giải phóng bộ nhớ khi cần
import logging
from huggingface_hub import snapshot_download
import time
import json
import threading

# Cấu hình logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Biến global lưu trữ model và tokenizer
global_model = None
global_tokenizer = None
model_lock = threading.Lock()

# Định nghĩa các hàm trước khi sử dụng
def create_prompt(word, language="Japanese"):
    """Tạo prompt ngắn gọn hơn"""
    prompts = {
        "Japanese": f"""Giải thích ngắn gọn về từ vựng tiếng Nhật: {word}
Format:
1. Ý nghĩa
2. Cách đọc
3. Ví dụ ngắn
Trả lời bằng tiếng Việt.""",
        
        "English": f"""Explain briefly the English word: {word}
Format:
1. Meaning
2. Pronunciation
3. Short example
Answer in Vietnamese."""
    }
    return prompts.get(language, prompts["Japanese"])

def generate_response(prompt, max_length=200):
    try:
        logger.info(f"Bắt đầu generate với prompt dài {len(prompt)} ký tự")
        start_time = time.time()
        
        if not prompt or len(prompt.strip()) == 0:
            raise ValueError("Prompt không được để trống")

        # Sử dụng lock để đảm bảo chỉ có một request sử dụng model tại một thời điểm
        with model_lock:
            # Tokenize input
            inputs = global_tokenizer(prompt, return_tensors="pt")
            
            # Generate response với các tham số tối ưu cho CPU
            with torch.no_grad():  # Tắt tính toán gradient cho inference
                outputs = global_model.generate(
                    **inputs,
                    max_new_tokens=150,  # Giới hạn số token mới để tăng tốc
                    do_sample=True,
                    temperature=0.7,
                    top_p=0.9,  # Thêm top_p để tăng tốc và duy trì chất lượng
                    pad_token_id=global_tokenizer.eos_token_id,
                    repetition_penalty=1.1,
                    no_repeat_ngram_size=2,
                    early_stopping=True,
                    use_cache=True
                )
            
            response = global_tokenizer.decode(outputs[0], skip_special_tokens=True)
        
        if not response or len(response.strip()) == 0:
            raise ValueError("Model không tạo được câu trả lời")
        
        process_time = time.time() - start_time
        logger.info(f"Hoàn thành generate trong {process_time:.2f}s")
            
        return response
    except Exception as e:
        logger.error(f"Lỗi khi generate response: {str(e)}")
        raise

def load_model_and_tokenizer():
    global global_model, global_tokenizer
    
    # Tạo thư mục để lưu model trong ổ D
    model_dir = "D:/mistral_model"
    os.makedirs(model_dir, exist_ok=True)

    # Sử dụng mô hình nhỏ hơn Mistral-7B
    # Có thể thay thế bằng mô hình nhỏ hơn nếu cần
    model_path = "mistralai/Mistral-7B-Instruct-v0.2"

    try:
        # Kiểm tra xem đã tải model chưa
        if global_model is None or global_tokenizer is None:
            print("Đang tải model và tokenizer...")
            
            # Đảm bảo model đã được download
            snapshot_download(
                repo_id=model_path,
                local_dir=model_dir,
                local_dir_use_symlinks=False,
                cache_dir=model_dir
            )

            print("Đang tải tokenizer...")
            global_tokenizer = AutoTokenizer.from_pretrained(model_dir)

            print("Đang tải model cho CPU...")
            # Tải model với chế độ tối ưu cho CPU
            global_model = AutoModelForCausalLM.from_pretrained(
                model_dir,
                torch_dtype=torch.float32,  # Sử dụng float32 cho CPU
                low_cpu_mem_usage=True,
                device_map="cpu"  # Chỉ định chạy trên CPU
            )
            
            # Giải phóng bộ nhớ cache
            torch.cuda.empty_cache() if torch.cuda.is_available() else None
            gc.collect()
            
            print(f"Đã tải xong model và tokenizer vào thư mục: {model_dir}")
            return True
        else:
            print("Model và tokenizer đã được tải trước đó")
            return True
    except Exception as e:
        logger.error(f"Lỗi khi tải model: {str(e)}")
        raise

# Tải model ngay khi khởi động server
try:
    load_model_and_tokenizer()
except Exception as e:
    logger.error(f"Không thể tải model khi khởi động: {str(e)}")
    print(f"Lỗi khi tải model: {str(e)}")

@app.route('/generate', methods=['POST'])
def generate():
    try:
        start_time = time.time()
        
        # Log request data
        logger.info("Received request data: %s", request.get_data())
        
        data = request.get_json()
        if not data:
            logger.error("No JSON data received")
            return jsonify({'error': 'Không có dữ liệu đầu vào'}), 400

        word = data.get('word', '')
        if not word:
            logger.error("Empty word received")
            return jsonify({'error': 'Từ vựng không được để trống'}), 400

        language = data.get('language', 'Japanese')
        max_length = min(data.get('max_length', 200), 200)

        # Đảm bảo model đã được tải
        if global_model is None or global_tokenizer is None:
            try:
                load_model_and_tokenizer()
            except Exception as e:
                return jsonify({'error': f'Không thể tải model: {str(e)}'}), 500

        # Tạo prompt ngắn gọn
        prompt = create_prompt(word, language)
        logger.info("Generated prompt: %s", prompt)
        
        # Generate response
        response = generate_response(prompt, max_length)
        logger.info("Generated response: %s", response)
        
        process_time = time.time() - start_time
        logger.info(f"Tổng thời gian xử lý request: {process_time:.2f}s")
        
        # Tạo response với headers phù hợp
        response_data = {
            'response': response,
            'processing_time': f"{process_time:.2f}s"
        }
        
        # Log response data
        logger.info("Sending response: %s", json.dumps(response_data))
        
        return jsonify(response_data), 200, {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
            'Connection': 'close'
        }
    except ValueError as ve:
        logger.error(f"Lỗi giá trị: {str(ve)}")
        return jsonify({'error': str(ve)}), 400
    except Exception as e:
        logger.error(f"Lỗi không xác định: {str(e)}")
        return jsonify({'error': f'Lỗi server: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(
        host='0.0.0.0',
        port=5000,
        threaded=True,
        debug=False
    )