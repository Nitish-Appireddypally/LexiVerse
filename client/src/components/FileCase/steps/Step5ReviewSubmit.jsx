// src/components/FileCase/steps/Step5ReviewSubmit.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateCaseSummaryPdf } from "../../../utils/generateCaseSummaryPdf";

const Step5ReviewSubmit = ({ data, onBack, onSubmit }) => {
  const { userInfo, caseType, caseDetails, evidence: evidenceFiles } = data;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);

    const casePayload = {
      caseTitle: caseDetails.summary || "Untitled Case",
      userInfo,
      caseDetails,
      evidenceFiles,
    };

    try {
      const response = await fetch("http://localhost:5050/api/cases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(casePayload),
      });

      if (!response.ok) throw new Error("Failed to submit case");

      const result = await response.json();
      console.log("✅ Case submitted successfully:", result);
      alert("✅ Case submitted successfully!");

      // 👉 Generate the beautiful LexiVerse-themed PDF
      generateCaseSummaryPdf(casePayload);

      // 👉 Notify parent and proceed
      onSubmit();
    } catch (error) {
      console.error("🚨 Error submitting case:", error);
      alert("Something went wrong while submitting the case.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-red-600">Review Your Case</h2>

      <section className="p-4 rounded-xl border border-slate-600 space-y-4 bg-white shadow-lg">
        <div>
          <h3 className="text-red-600 font-medium mb-1">👤 User Info</h3>
          <p><b>Name:</b> {userInfo.name}</p>
          <p><b>Email:</b> {userInfo.email}</p>
          <p><b>Phone:</b> {userInfo.phone}</p>
        </div>

        <div>
          <h3 className="text-red-600 font-medium mb-1">📂 Case Type</h3>
          <p>{caseType}</p>
        </div>

        <div>
          <h3 className="text-red-600 font-medium mb-1">📝 Case Details</h3>
          <p><b>Summary:</b> {caseDetails.summary}</p>
          <p><b>Incident:</b> {caseDetails.incident}</p>
          {caseDetails.notes && <p><b>Notes:</b> {caseDetails.notes}</p>}
        </div>

        <div>
          <h3 className="text-red-600 font-medium mb-1">📎 Evidence Files</h3>
          {evidenceFiles && evidenceFiles.length > 0 ? (
            <ul className="list-disc list-inside text-sm text-gray-700">
              {evidenceFiles.map((file, idx) => (
                <li key={idx}>{file.name}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No files uploaded.</p>
          )}
        </div>
      </section>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`px-6 py-3 rounded-xl font-semibold transition ${
            loading
              ? "bg-yellow-300 text-black cursor-not-allowed"
              : "bg-yellow-400 text-black hover:bg-yellow-300"
          }`}
        >
          {loading ? "Submitting..." : "Submit Case"}
        </button>
      </div>
    </div>
  );
};

export default Step5ReviewSubmit;
