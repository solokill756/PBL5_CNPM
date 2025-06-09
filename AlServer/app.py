import os
import time
import logging
import json
import uuid
from flask import Flask, request, jsonify
import google.generativeai as genai # type: ignore
from datetime import datetime

# Setup Google Gemini
genai.configure(api_key="AIzaSyB-Lo8xrP1vuMgoKTu37c-b20DgRYLEOHw")  # Replace with your actual API key
model = genai.GenerativeModel("gemini-1.5-flash")

# Setup Flask app
app = Flask(__name__)

# Setup Logger
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Prompt builder for translation dictionary
def create_prompt(word, language="Japanese"):
    prompts = {
        "Vietnamese": f"""
Hãy dịch từ tiếng Việt "{word}" sang tiếng Nhật và cung cấp thông tin chi tiết.
Trả lời theo định dạng JSON với các trường sau:
{{
  "word": "{word}",
  "meaning": "Từ tương ứng trong tiếng Nhật",
  "pronunciation": "Phiên âm La-tinh",
  "example": "Một câu ví dụ bằng tiếng Nhật",
  "usage": "Giải thích ngắn gọn về ý nghĩa và cách dùng",
  "example_meaning": "Nghĩa của câu ví dụ bằng tiếng Việt",
  "level": "Cấp độ JLPT nếu biết (N5-N1)",
  "type": "Loại từ (danh từ, động từ, tính từ, v.v.)",
  "topic": "Chủ đề phù hợp nhất cho từ này bằng tiếng Việt",
  "topic_japanese": "Chủ đề phù hợp nhất cho từ này bằng tiếng Nhật"
}}
Chỉ trả về JSON, không thêm văn bản giới thiệu hay giải thích.
""",
        "Japanese": f"""
Hãy dịch từ tiếng Nhật "{word}" sang tiếng Việt và cung cấp thông tin chi tiết.
Trả lời theo định dạng JSON với các trường sau:
{{
  "word": "{word}",
  "meaning": "Từ tương ứng trong tiếng Việt",
  "pronunciation": "Phiên âm La-tinh và hiragana nếu khác với input",
  "example": "Một câu ví dụ bằng tiếng Nhật",
  "usage": "Giải thích nghĩa và cách dùng bằng tiếng Việt",
  "example_meaning": "Nghĩa của câu ví dụ bằng tiếng Việt",
  "level": "Cấp độ JLPT nếu biết (N5-N1)",
  "type": "Loại từ (danh từ, động từ, tính từ, v.v.)",
  "topic": "Chủ đề phù hợp nhất cho từ này",
  "topic_japanese": "Chủ đề phù hợp nhất cho từ này bằng tiếng Nhật"
}}
Chỉ trả về JSON, không thêm văn bản giới thiệu hay giải thích.
"""
    }
    return prompts.get(language, prompts["Japanese"])


# Prompt builder for vocabulary analysis
def create_analysis_prompt(word, language="Japanese"):
    prompts = {
        "Japanese": f"""
Giải thích ngắn gọn từ vựng tiếng Nhật: {word}
Yêu cầu trả lời đúng định dạng JSON gồm 4 mục:
{{
  "meaning": "",
  "pronunciation": "",
  "example": "",
  "usage": ""
}}
""",
        "Vietnamese": f"""
Giải thích ngắn gọn từ tiếng Việt: {word}
Yêu cầu trả lời đúng định dạng JSON gồm 4 mục:
{{
  "meaning": "",
  "pronunciation": "",
  "example": "",
  "usage": ""
}}
"""
    }
    return prompts.get(language, prompts["Japanese"])

# Extract JSON from Gemini response
def extract_json_from_response(text):
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        try:
            start_idx = text.find('{')
            end_idx = text.rfind('}')
            if start_idx >= 0 and end_idx > start_idx:
                json_str = text[start_idx:end_idx+1]
                return json.loads(json_str)
        except (json.JSONDecodeError, ValueError):
            return {
                "meaning": "Failed to parse response",
                "pronunciation": "",
                "example": "",
                "example_meaning": text
            }

# Call Gemini and process response for translation
def generate_response(prompt, word, language):
    try:
        logger.info(f"Calling Gemini with prompt for word: {word}")
        start_time = time.time()
        response = model.generate_content(prompt)
        duration = time.time() - start_time
        logger.info(f"Gemini responded in {duration:.2f}s")

        content = response.text.strip()
        parsed = extract_json_from_response(content)

        # Ensure all required fields exist (matching Vocabulary model structure)
        required_fields = [
            "word", "meaning", "pronunciation", "example", "usage", 
            "example_meaning", "level", "type"
        ]
        
        for field in required_fields:
            parsed.setdefault(field, "")

        # Create response matching Vocabulary model structure
        vocabulary_response = {
            "vocab_id": str(uuid.uuid4()),
            "word": word if not parsed.get("word") else parsed.get("word"),
            "meaning": parsed.get("meaning", ""),
            "pronunciation": parsed.get("pronunciation", ""),
            "example": parsed.get("example", ""),
            "topic": parsed.get("topic_japanese", ""),
            "usage": parsed.get("usage", ""),
            "description" : parsed.get("topic" , ""),
            "example_meaning": parsed.get("example_meaning", ""),
            "ai_suggested": "true",
            "created_at": datetime.now().isoformat(),
            "language": language,
            "level": parsed.get("level", "N5"),  # Default to N5 if not specified
            "type": parsed.get("type", "")
        }

        # Add metadata for debugging (not part of the Vocabulary model)
        metadata = {
            "processing_time_seconds": round(duration, 2),
            "total_api_time_seconds": round(duration, 2)
        }

        return vocabulary_response, metadata
    except Exception as e:
        logger.error(f"Error calling Gemini: {str(e)}")
        error_response = {
            "vocab_id": str(uuid.uuid4()),
            "word": word,
            "meaning": "",
            "pronunciation": "",
            "example": "",
            "topic": "",
            "usage": "",
            "example_meaning": f"Error: {str(e)}",
            "ai_suggested": "true",
            "created_at": datetime.now().isoformat(),
            "language": language,
            "level": "N5",
            "type": ""
        }
        
        metadata = {
            "error": str(e),
            "status": "error"
        }
        
        return error_response, metadata
def generate_analysis_response(prompt, word, language):
    try:
        logger.info(f"Calling Gemini with analysis prompt for word: {word}")
        start_time = time.time()
        response = model.generate_content(prompt)
        duration = time.time() - start_time
        logger.info(f"Gemini responded in {duration:.2f}s")

        content = response.text.strip()
        parsed = extract_json_from_response(content)

        # Ensure all required fields exist
        required_fields = ["meaning", "pronunciation", "example", "usage"]
        for field in required_fields:
            parsed.setdefault(field, "")

        # Add metadata
        parsed.update({
            "word": word,
            "language": language,
            "query_timestamp": datetime.now().isoformat(),
            "processing_time_seconds": round(duration, 2)
        })

        return parsed
    except Exception as e:
        logger.error(f"Error calling Gemini: {str(e)}")
        return {
            "word": word,
            "language": language,
            "meaning": "",
            "pronunciation": "",
            "example": "",
            "usage": "",
            "error": str(e),
            "query_timestamp": datetime.now().isoformat(),
            "processing_time_seconds": 0,
            "status": "error"
        }

# API route for translation dictionary
@app.route('/generate', methods=['POST'])
def generate():
    try:
        start_time = time.time()
        data = request.get_json()

        if not data or 'word' not in data:
            return jsonify({
                "status": "error",
                "error": "Missing required 'word' parameter",
                "timestamp": datetime.now().isoformat()
            }), 400

        word = data['word']
        language = data.get('language', 'Japanese')
        # topic_id = data.get('topic_id', str(uuid.uuid4()))

        prompt = create_prompt(word, language)
        vocabulary_response, metadata = generate_response(prompt, word, language)

        # Add status to the metadata
        metadata["status"] = "success" if not metadata.get("error") else "error"
        metadata["total_api_time_seconds"] = round(time.time() - start_time, 2)

        # Return the vocabulary response matching the model structure
        response = {
            "data": vocabulary_response,
            "metadata": metadata
        }

        return jsonify(response), 200

    except Exception as e:
        logger.error(f"Server error: {str(e)}")
        return jsonify({
            "status": "error",
            "error": f"Server error: {str(e)}",
            "timestamp": datetime.now().isoformat()
        }), 500
@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        start_time = time.time()
        data = request.get_json()

        if not data or 'word' not in data:
            return jsonify({
                "status": "error",
                "error": "Missing required 'word' parameter",
                "query_timestamp": datetime.now().isoformat()
            }), 400

        word = data['word']
        language = data.get('language', 'Japanese')

        prompt = create_analysis_prompt(word, language)
        result = generate_analysis_response(prompt, word, language)

        result["status"] = "success" if not result.get("error") else "error"
        result["total_api_time_seconds"] = round(time.time() - start_time, 2)

        return jsonify(result), 200

    except Exception as e:
        logger.error(f"Server error: {str(e)}")
        return jsonify({
            "status": "error",
            "error": f"Server error: {str(e)}",
            "query_timestamp": datetime.now().isoformat()
        }), 500
# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "timestamp": datetime.now().isoformat()}), 200

# Run Flask
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)