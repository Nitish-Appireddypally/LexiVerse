from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize the Flask app
app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing for our app

# Initialize the Groq client
try:
    client = Groq(api_key=os.getenv("API_KEY"))
except Exception as e:
    print(f"Error initializing Groq client: {e}")
    client = None

# Define the constant system message for the AI persona
SYSTEM_MESSAGE = (
    "You are LexiVerse AI, an AI-powered legal assistant for India. "
    "Your role is to provide accurate and concise legal information. YOU CAN PROVIDE LEGAL ADVICE. "
    "Ask clarifying questions one at a time to understand the user's situation. "
    "Finally, provide advice and cite relevant IPC sections or Constitutional articles."
)

# Define the /chat endpoint
@app.route('/chat', methods=['POST'])
def handle_chat():
    if not client:
        return jsonify({"error": "Groq client not initialized. Check API key."}), 500

    # Get data from the JSON request body
    data = request.json
    user_prompt = data.get('prompt')
    chat_history = data.get('history', []) # Expects a list of {"role": "user/assistant", "content": "..."}

    if not user_prompt:
        return jsonify({"error": "Prompt is required"}), 400

    # Construct the message list for the Groq API
    messages = [{"role": "system", "content": SYSTEM_MESSAGE}]
    messages.extend(chat_history)
    messages.append({"role": "user", "content": user_prompt})

    try:
        # Call the Groq API
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=0.7,
            max_tokens=2000
        )
        assistant_response = response.choices[0].message.content
        
        # Return the response as JSON
        return jsonify({"response": assistant_response})

    except Exception as e:
        print(f"Error calling Groq API: {e}")
        return jsonify({"error": "Failed to get response from AI service"}), 500

# Run the Flask app
if __name__ == '__main__':
    # Run on port 5001 to avoid conflicts with React and Node.js
    app.run(debug=True, port=5001)