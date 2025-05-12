import os
import time
import logging
import json
from flask import Flask, request, jsonify
import google.generativeai as genai
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
        "Japanese": f"""
Hãy dịch từ tiếng Việt "{word}" sang tiếng Nhật và cung cấp thông tin chi tiết.
Trả lời theo định dạng JSON với các trường sau:
{{
  "vietnamese": "{word}",
  "japanese_word": "Từ tương ứng trong tiếng Nhật",
  "kanji": "Dạng chữ Kanji (nếu có)",
  "hiragana": "Cách viết bằng hiragana",
  "katakana": "Cách viết bằng katakana (nếu phù hợp)",
  "romaji": "Phiên âm La-tinh",
  "vietnamese_pronunciation": "Cách đọc theo phiên âm tiếng Việt",
  "meaning": "Giải thích ngắn gọn về ý nghĩa và cách dùng",
  "jlpt_level": "Cấp độ JLPT nếu biết (N5-N1)",
  "example": "Một câu ví dụ bằng tiếng Nhật",
  "example_meaning": "Nghĩa của câu ví dụ bằng tiếng Việt"
}}
Chỉ trả về JSON, không thêm văn bản giới thiệu hay giải thích.
""",
        "Vietnamese": f"""
Hãy dịch từ tiếng Nhật "{word}" sang tiếng Việt và cung cấp thông tin chi tiết.
Trả lời theo định dạng JSON với các trường sau:
{{
  "japanese_word": "{word}",
  "vietnamese": "Từ tương ứng trong tiếng Việt",
  "kanji": "Dạng chữ Kanji gốc (nếu có và nếu khác với input)",
  "hiragana": "Cách viết bằng hiragana",
  "romaji": "Phiên âm La-tinh",
  "vietnamese_pronunciation": "Cách đọc theo âm tiếng Việt",
  "meaning": "Giải thích nghĩa và cách dùng bằng tiếng Việt",
  "part_of_speech": "Loại từ (danh từ, động từ, tính từ, v.v.)",
  "example": "Một câu ví dụ bằng tiếng Nhật",
  "example_meaning": "Nghĩa của câu ví dụ bằng tiếng Việt"
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
                "vietnamese_pronunciation": "",
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

        # Define required fields based on language
        required_fields = (
            ["vietnamese", "japanese_word", "kanji", "hiragana", "katakana", "romaji",
             "vietnamese_pronunciation", "meaning", "jlpt_level", "example", "example_meaning"]
            if language == "Japanese" else
            ["japanese_word", "vietnamese", "kanji", "hiragana", "romaji",
             "vietnamese_pronunciation", "meaning", "part_of_speech", "example", "example_meaning"]
        )

        # Ensure all required fields exist
        for field in required_fields:
            parsed.setdefault(field, "")

        # Add metadata
        parsed.update({
            "input_word": word,
            "translation_direction": language,
            "query_timestamp": datetime.now().isoformat(),
            "processing_time_seconds": round(duration, 2)
        })

        return parsed
    except Exception as e:
        logger.error(f"Error calling Gemini: {str(e)}")
        return {
            "input_word": word,
            "translation_direction": language,
            "japanese_word": "",
            "vietnamese": "",
            "meaning": "",
            "example": "",
            "example_meaning": "",
            "error": str(e),
            "query_timestamp": datetime.now().isoformat(),
            "processing_time_seconds": 0,
            "status": "error"
        }

# Call Gemini and process response for vocabulary analysis
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
                "query_timestamp": datetime.now().isoformat()
            }), 400

        word = data['word']
        language = data.get('language', 'Japanese')

        prompt = create_prompt(word, language)
        result = generate_response(prompt, word, language)

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

# API route for vocabulary analysis
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