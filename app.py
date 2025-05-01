from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

# Paste your Gemini API key here (use environment variables in production)
GEMINI_API_KEY = "AIzaSyDYPtyIAwNnkA8E2KH8WcwxrpMKOWiQ_hE"   # <-- replace with your actual key
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

def get_gemini_response(user_input):
    headers = {"Content-Type": "application/json"}
    data = {
        "contents": [{
            "parts": [{
                "text": (
                    "You are a brilliant and friendly math problem solver. "
                    "When the user gives you a math-related question (like geometry, algebra, basic calculus, or real-world math), "
                    "explain the answer step-by-step. Keep your responses clear and concise.\n\n"
                    f"User: {user_input}\nBot:"
                )
            }]
        }]
    }

    try:
        response = requests.post(
            f"{GEMINI_API_URL}?key={GEMINI_API_KEY}",
            headers=headers,
            json=data
        )
        response.raise_for_status()
        reply = response.json()["candidates"][0]["content"]["parts"][0]["text"]
    except Exception as e:
        print(f"Error: {e}")
        reply = "Oops! I'm having trouble solving right now. Try again later."

    return reply

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/solve", methods=["POST"])
def solve():
    user_message = request.form.get("message")
    if not user_message:
        return jsonify({"response": "Please provide a question to solve."})

    response = get_gemini_response(user_message)
    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(debug=True)
