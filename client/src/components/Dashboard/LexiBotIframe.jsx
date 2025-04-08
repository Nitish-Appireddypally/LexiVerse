import React from "react";

const LexiBotIframe = () => {
  return (
    <div style={{
      position: "fixed",
      bottom: "20px",
      right: "20px",
      width: "400px",
      height: "600px",
      zIndex: 1000,
      borderRadius: "15px",
      overflow: "hidden",
      boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
      border: "2px solid #7c3aed",
    }}>
      <iframe
        src="http://localhost:8501"
        width="100%"
        height="100%"
        frameBorder="0"
        title="LexiBot"
      />
    </div>
  );
};

export default LexiBotIframe;
