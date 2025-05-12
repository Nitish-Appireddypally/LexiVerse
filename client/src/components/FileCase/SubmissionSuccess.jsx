// src/components/FileCase/SubmissionSuccess.jsx
import { useNavigate } from "react-router-dom";

const SubmissionSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="text-center p-10 bg-slate-900 rounded-xl shadow-md max-w-xl mx-auto mt-10">
      <h2 className="text-3xl font-bold text-yellow-400 mb-4">🎉 Case Submitted Successfully!</h2>
      <p className="text-gray-300 mb-6">Your case has been filed and is now in review. You can track its status in your dashboard.</p>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-xl hover:bg-yellow-300 transition"
      >
        Return to Dashboard
      </button>
    </div>
  );
};

export default SubmissionSuccess;
