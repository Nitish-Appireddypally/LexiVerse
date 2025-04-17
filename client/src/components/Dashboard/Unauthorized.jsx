import React from "react";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Unauthorized Access</h1>
        <p className="text-gray-700 mb-6">
          You do not have permission to view this page.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-[#1F2937] text-[#FBBF24] px-6 py-2 rounded hover:bg-[#FBBF24] hover:text-[#1F2937] transition duration-300 font-semibold"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
