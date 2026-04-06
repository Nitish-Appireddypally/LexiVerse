# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from groq import Groq
# import os
# from dotenv import load_dotenv
# import requests

# # Load environment variables from .env file
# load_dotenv()

# # Initialize the Flask app
# app = Flask(__name__)
# CORS(app)  # Enable Cross-Origin Resource Sharing for our app

# # Initialize the Groq client
# try:
#     client = Groq(api_key=os.getenv("API_KEY"))
# except Exception as e:
#     print(f"Error initializing Groq client: {e}")
#     client = None

# # Define the constant system message for the AI persona
# SYSTEM_MESSAGE = (
#     "You are LexiVerse AI, an AI-powered legal assistant for India. "
#     "Your role is to provide accurate and concise legal information. YOU CAN PROVIDE LEGAL ADVICE. "
#     "Ask clarifying questions one at a time to understand the user's situation. "
#     "Finally, provide advice and cite relevant IPC sections or Constitutional articles."
# )

# # Define the /chat endpoint
# @app.route('/chat', methods=['POST'])
# def handle_chat():
#     if not client:
#         return jsonify({"error": "Groq client not initialized. Check API key."}), 500

#     # Get data from the JSON request body
#     data = request.json
#     user_prompt = data.get('prompt')
#     chat_history = data.get('history', []) # Expects a list of {"role": "user/assistant", "content": "..."}

#     if not user_prompt:
#         return jsonify({"error": "Prompt is required"}), 400

#     # Construct the message list for the Groq API
#     messages = [{"role": "system", "content": SYSTEM_MESSAGE}]
#     messages.extend(chat_history)
#     messages.append({"role": "user", "content": user_prompt})

#     try:
#         # Call the Groq API
#         response = client.chat.completions.create(
#             model="llama-3.3-70b-versatile",
#             messages=messages,
#             temperature=0.7,
#             max_tokens=2000
#         )
#         assistant_response = response.choices[0].message.content

        
        
#         # Return the response as JSON
#         return jsonify({"response": assistant_response})

#     except Exception as e:
#         print(f"Error calling Groq API: {e}")
#         return jsonify({"error": "Failed to get response from AI service"}), 500

# # Run the Flask app
# if __name__ == '__main__':
#     # Run on port 5001 to avoid conflicts with React and Node.js
#     app.run(debug=True, port=5001)


from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
import os
from dotenv import load_dotenv
import json
import re

load_dotenv()

app = Flask(__name__)
CORS(app)

client = Groq(api_key=os.getenv("API_KEY"))

SYSTEM_MESSAGE = """
You are LexiVerse AI, a legal assistant for India.

Talk conversationally with the user and gather details about their legal issue.

Ask questions to collect:
• incident date
• incident location
• accused person
• witnesses
• what happened

ONLY when the user clearly confirms they want to file a case,
return structured JSON.

ALWAYS return ALL fields even if empty.

Return JSON exactly like this:

{
 "offenseDetails":{
   "offenseDate":"",
   "placeOfOffense":""
 },
 "accusedPersons":[
   {"name":"","address":""}
 ],
 "witnesses":[
   {"name":"","contact":""}
 ],
 "caseNarrative":{
   "caseType":"",
   "title":"",
   "incidentDetails":""
 }
}

If the user is still chatting, respond normally.
"""


def clean_json(text):
    text = text.strip()

    if text.startswith("```"):
        text = re.sub(r"```json", "", text)
        text = re.sub(r"```", "", text)

    return text.strip()


def user_wants_case(prompt):

    trigger_words = [
        "file case",
        "file a case",
        "register case",
        "start case",
        "let's file",
        "lets file",
        "file complaint"
    ]

    prompt = prompt.lower()

    return any(word in prompt for word in trigger_words)


@app.route("/chat", methods=["POST"])
def chat():

    data = request.get_json()

    prompt = data.get("prompt")
    history = data.get("history", [])

    messages = [{"role": "system", "content": SYSTEM_MESSAGE}]
    messages.extend(history)
    messages.append({"role": "user", "content": prompt})

    response = client.chat.completions.create(
    model="llama-3.1-8b-instant",
    messages=messages,
    temperature=0.4,
    max_tokens=500
)

    ai_text = response.choices[0].message.content

    structured = None

    if user_wants_case(prompt):

        try:
            cleaned = clean_json(ai_text)
            match = re.search(r'\{.*\}', cleaned, re.DOTALL)

            if match:
                structured = json.loads(match.group())

        except Exception as e:
            print("JSON extraction failed:", e)

    return jsonify({
        "response": ai_text,
        "structured": structured
    })


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port)