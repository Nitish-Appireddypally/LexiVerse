import React from "react";
import { FaRobot } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const LexiBotFloating = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/chatbot");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 bg-[#FBBF24] hover:bg-yellow-400 text-black p-4 rounded-full shadow-lg z-50 cursor-pointer"
      title="Chat with LexiBot"
    >
      <FaRobot size={24} />
    </button>
  );
};

export default LexiBotFloating;
