

from flask import Flask, request, jsonify
import google.generativeai as genai

app = Flask(__name__)

API_KEY = "AIzaSyArJiyOwiV9yZMuwZh8xZAUaC3tqMFsEd4"  # Ganti dengan API key dari Google
genai.configure(api_key=API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")  # atau model lain yg tersedia

@app.route('/ask', methods=['POST'])
def ask():
    data = request.get_json()
    user_input = data.get("message", "")

    if not user_input:
        return jsonify({"error": "No input provided"}), 400

    try:
        response = model.generate_content(user_input)
        return jsonify({"reply": response.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10045)
