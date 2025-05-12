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

# Prompt builder
def create_prompt(word, language="Japanese"):
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
        "English": f"""
Giải thích ngắn gọn từ tiếng Anh: {word}
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
    # Try to find JSON content within the text
    try:
        # First try to parse the entire text as JSON
        return json.loads(text)
    except json.JSONDecodeError:
        # If that fails, try to extract JSON from text that might contain other content
        try:
            # Look for content between curly braces
            start_idx = text.find('{')
            end_idx = text.rfind('}')
            
            if start_idx >= 0 and end_idx > start_idx:
                json_str = text[start_idx:end_idx+1]
                return json.loads(json_str)
        except (json.JSONDecodeError, ValueError):
            pass
        
        # If all parsing attempts fail, create a structured response with the raw text
        return {
            "meaning": "Failed to parse response",
            "pronunciation": "",
            "example": "",
            "usage": text  # Store the original text here for debugging
        }

# Call Gemini and process response
def generate_response(prompt, word, language):
    try:
        logger.info(f"Calling Gemini with prompt for word: {word}")
        start_time = time.time()
        response = model.generate_content(prompt)
        duration = time.time() - start_time
        logger.info(f"Gemini responded in {duration:.2f}s")
        
        content = response.text.strip()
        
        # Try to parse JSON from the response
        parsed = extract_json_from_response(content)
        
        # Ensure all required fields exist
        required_fields = ["meaning", "pronunciation", "example", "usage"]
        for field in required_fields:
            if field not in parsed:
                parsed[field] = ""
        
        # Add metadata for database storage
        parsed["word"] = word
        parsed["language"] = language
        parsed["query_timestamp"] = datetime.now().isoformat()
        parsed["processing_time_seconds"] = round(duration, 2)
        
        return parsed
    except Exception as e:
        logger.error(f"Error calling Gemini: {str(e)}")
        
        # Return a structured error response that can still be stored in the database
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

# API route
@app.route('/generate', methods=['POST'])
def generate():
    try:
        start_time = time.time()
        data = request.get_json()
        
        if not data or 'word' not in data:
            error_response = {
                "status": "error",
                "error": "Missing required 'word' parameter",
                "query_timestamp": datetime.now().isoformat()
            }
            return jsonify(error_response), 400
        
        word = data['word']
        language = data.get('language', 'Japanese')
        
        prompt = create_prompt(word, language)
        result = generate_response(prompt, word, language)
        
        # Add status for database tracking
        result["status"] = result.get("error", "") == "" and "success" or "error"
        result["total_api_time_seconds"] = round(time.time() - start_time, 2)
        
        return jsonify(result), 200
    
    except Exception as e:
        logger.error(f"Server error: {str(e)}")
        error_response = {
            "status": "error",
            "error": f"Server error: {str(e)}",
            "query_timestamp": datetime.now().isoformat()
        }
        return jsonify(error_response), 500

# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "timestamp": datetime.now().isoformat()}), 200

# Run Flask
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)