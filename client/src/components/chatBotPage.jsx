import React from "react";

const ChatbotPage = () => {
  return (
    <div style={{
      height: "100vh",
      width: "100vw",
      overflow: "hidden",
    }}>
      <iframe
        src="http://localhost:8501"
        width="100%"
        height="100%"
        frameBorder="0"
        title="LexiBot Chatbot"
      />
    </div>
  );
};

export default ChatbotPage;
