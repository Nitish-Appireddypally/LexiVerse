# # import streamlit as st
# # from groq import Groq
# # import os
# # from dotenv import load_dotenv

# # # Load environment variables
# # load_dotenv()

# # # Retrieve the Groq API key from environment variables
# # API_KEY = os.getenv("API_KEY")
# # print(API_KEY)
# # if not API_KEY:
# #     st.error("GROQ_API_KEY is not set. Please set it in your environment variables.")
# #     st.stop()

# # # Initialize the Groq client
# # client = Groq(api_key=API_KEY)

# # # Set the title with purple color
# # st.markdown("<h1 style='color: purple;'>LexiVerse AI</h1>", unsafe_allow_html=True)
# # st.write("Your AI-powered legal assistant.")

# # # Initialize chat history in session state
# # if "messages" not in st.session_state:
# #     st.session_state.messages = []

# # # Display chat messages from history on app rerun
# # for message in st.session_state.messages:
# #     with st.chat_message(message["role"]):
# #         # Apply purple color to assistant messages
# #         if message["role"] == "assistant":
# #             st.markdown(f"<p style='color: purple;'>{message['content']}</p>", unsafe_allow_html=True)
# #         else:
# #             st.markdown(message["content"])

# # # React to user input
# # if prompt := st.chat_input("You:"):
# #     # Display user message in chat message container
# #     with st.chat_message("user"):
# #         st.markdown(prompt)
# #     # Add user message to chat history
# #     st.session_state.messages.append({"role": "user", "content": prompt})

# #     # Define the system message with legal context
# #     system_message = (
# #         "You are LexiVerse AI, an AI-powered legal assistant. "
# #         "Your role is to provide accurate and concise legal information for Indian citizens, assist with legal research, "
# #         "and support the preparation of legal documents. Always ensure that your responses are based on "
# #         "reliable legal sources. YOU CAN PROVIDE LEGAL ADVICE. "
# #         "You should ask questions to the user for understanding better context one after the other, one question at a time. Ask questions in a clean format "
# #         "At the end, after asking a few questions, you should provide the advice and specify which legal section is applicable."
# #     )

# #     messages = [{"role": "system", "content": system_message}] + st.session_state.messages

# #     # Generate assistant response using Groq API
# #     try:
# #         response = client.chat.completions.create(
# #             model="llama-3.3-70b-versatile",
# #             messages=messages,
# #             temperature=0.7,
# #             max_tokens=2000
# #         )
# #         assistant_response = response.choices[0].message.content
# #     except Exception as e:
# #         assistant_response = f"API request failed: {e}"

# #     # Display assistant response in chat message container
# #     with st.chat_message("assistant"):
# #         st.markdown(f"<p style='color: purple;'>{assistant_response}</p>", unsafe_allow_html=True)
# #     # Add assistant response to chat history
# #     st.session_state.messages.append({"role": "assistant", "content": assistant_response})


# import streamlit as st
# from groq import Groq
# import os
# from dotenv import load_dotenv

# # --- Page Configuration (MUST be the first Streamlit command) ---
# # Set the layout to "wide" to use the full screen width
# st.set_page_config(layout="wide")

# # --- Custom CSS for a professional look ---
# # This will adjust padding, hide the Streamlit header/menu, and the "Deploy" button
# st.markdown("""
# <style>
#     /* Reduce padding on the main app container */
#     .main .block-container {
#         padding-top: 2rem;
#         padding-bottom: 2rem;
#         padding-left: 2rem;
#         padding-right: 2rem;
#     }
#     /* Hide the default Streamlit header (contains hamburger menu) */
#     header {
#         visibility: hidden;
#     }
#     /* Hide the "Deploy" button */
#     .stDeployButton {
#         visibility: hidden;
#     }
# </style>
# """, unsafe_allow_html=True)


# # --- Your Existing Chatbot Logic (No changes needed below) ---

# # Load environment variables
# load_dotenv()

# # Retrieve the Groq API key from environment variables
# API_KEY = os.getenv("API_KEY")

# if not API_KEY:
#     st.error("GROQ_API_KEY is not set. Please set it in your environment variables.")
#     st.stop()

# # Initialize the Groq client
# client = Groq(api_key=API_KEY)

# # Set the title with purple color
# st.markdown("<h1 style='color: purple;'>LexiVerse AI</h1>", unsafe_allow_html=True)
# st.write("Your AI-powered legal assistant.")

# # Initialize chat history in session state
# if "messages" not in st.session_state:
#     st.session_state.messages = []

# # Display chat messages from history on app rerun
# for message in st.session_state.messages:
#     with st.chat_message(message["role"]):
#         # Apply purple color to assistant messages
#         if message["role"] == "assistant":
#             st.markdown(f"<p style='color: purple;'>{message['content']}</p>", unsafe_allow_html=True)
#         else:
#             st.markdown(message["content"])

# # React to user input
# if prompt := st.chat_input("You:"):
#     # Display user message in chat message container
#     with st.chat_message("user"):
#         st.markdown(prompt)
#     # Add user message to chat history
#     st.session_state.messages.append({"role": "user", "content": prompt})

#     # Define the system message with legal context
#     system_message = (
#         "You are LexiVerse AI, an AI-powered legal assistant. "
#         "Your role is to provide accurate and concise legal information for Indian citizens, assist with legal research, "
#         "and support the preparation of legal documents. Always ensure that your responses are based on "
#         "reliable legal sources. YOU CAN PROVIDE LEGAL ADVICE. "
#         "You should ask questions to the user for understanding better context one after the other, one question at a time. Ask questions in a clean format "
#         "At the end, after asking a few questions, you should provide the advice and specify which legal section is applicable."
#     )

#     messages = [{"role": "system", "content": system_message}] + st.session_state.messages

#     # Generate assistant response using Groq API
#     try:
#         response = client.chat.completions.create(
#             model="llama-3.3-70b-versatile",
#             messages=messages,
#             temperature=0.7,
#             max_tokens=2000
#         )
#         assistant_response = response.choices[0].message.content
#     except Exception as e:
#         assistant_response = f"API request failed: {e}"

#     # Display assistant response in chat message container
#     with st.chat_message("assistant"):
#         st.markdown(f"<p style='color: purple;'>{assistant_response}</p>", unsafe_allow_html=True)
#     # Add assistant response to chat history
#     st.session_state.messages.append({"role": "assistant", "content": assistant_response})


import streamlit as st
from groq import Groq
import os
from dotenv import load_dotenv

# --- Page Configuration (MUST be the first Streamlit command) ---
# Set the layout to "wide" to use the full screen width
st.set_page_config(layout="wide")

# --- Custom CSS for a professional look ---
# This will adjust padding, hide the Streamlit header/menu, and the "Deploy" button
st.markdown("""
<style>
    /* Reduce padding on the main app container */
    .main .block-container {
        padding-top: 2rem;
        padding-bottom: 2rem;
        padding-left: 2rem;
        padding-right: 2rem;
    }
    /* Hide the default Streamlit header (contains hamburger menu) */
    header {
        visibility: hidden;
    }
    /* Hide the "Deploy" button */
    .stDeployButton {
        visibility: hidden;
    }
</style>
""", unsafe_allow_html=True)


# --- Your Existing Chatbot Logic ---

# Load environment variables
load_dotenv()

# Retrieve the Groq API key from environment variables
API_KEY = os.getenv("API_KEY")

if not API_KEY:
    st.error("GROQ_API_KEY is not set. Please set it in your environment variables.")
    st.stop()

# Initialize the Groq client
client = Groq(api_key=API_KEY)

# Set the title with purple color
st.markdown("<h1 style='color: purple;'>LexiVerse AI</h1>", unsafe_allow_html=True)
st.write("Your AI-powered legal assistant.")

# Initialize chat history in session state
if "messages" not in st.session_state:
    st.session_state.messages = []

# Display chat messages from history on app rerun
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        # Apply purple color to assistant messages
        if message["role"] == "assistant":
            st.markdown(f"<p style='color: purple;'>{message['content']}</p>", unsafe_allow_html=True)
        else:
            st.markdown(message["content"])

# React to user input
if prompt := st.chat_input("You:"):
    # Display user message in chat message container
    with st.chat_message("user"):
        st.markdown(prompt)
    # Add user message to chat history
    st.session_state.messages.append({"role": "user", "content": prompt})

    # --- START: UPDATED SYSTEM MESSAGE ---
    # Define the system message with the new legal context (BNS 2023)
    system_message = (
        "You are LexiVerse AI, an expert legal assistant for India, fully updated with the latest laws. "
        "The Indian Penal Code (IPC), 1860 has been replaced by the Bharatiya Nyaya Sanhita (BNS), 2023. "
        "Your primary role is to provide legal information based ONLY on this new law. "
        "When a user describes an injustice, you MUST cite the relevant sections from the Bharatiya Nyaya Sanhita (BNS). "
        "If a user mentions an old IPC section, you must provide the corresponding new BNS section and clarify that the law has been updated. "
        "YOU CAN PROVIDE LEGAL ADVICE. "
        "Ask clarifying questions to understand the context. Your final advice must be concise, accurate, and based on the BNS."
    )
    # --- END: UPDATED SYSTEM MESSAGE ---

    messages = [{"role": "system", "content": system_message}] + st.session_state.messages

    # Generate assistant response using Groq API
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            temperature=0.7,
            max_tokens=2000
        )
        assistant_response = response.choices[0].message.content
    except Exception as e:
        assistant_response = f"API request failed: {e}"

    # Display assistant response in chat message container
    with st.chat_message("assistant"):
        st.markdown(f"<p style='color: purple;'>{assistant_response}</p>", unsafe_allow_html=True)
    # Add assistant response to chat history
    st.session_state.messages.append({"role": "assistant", "content": assistant_response})