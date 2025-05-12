// src/pages/CaseTrackingPage.jsx
import React, { useEffect, useState } from "react";

const CaseTrackingPage = () => {
  const [cases, setCases] = useState([]);
  
  useEffect(() => {
    // Simulate fetching cases from the backend (replace with actual API call)
    const fetchCases = async () => {
      try {
        const response = await fetch("https://your-api.com/api/cases");
        if (!response.ok) throw new Error("Failed to fetch cases");
        const data = await response.json();
        setCases(data);
      } catch (err) {
        console.error("Error fetching cases:", err);
        alert("Failed to load cases. Please try again.");
      }
    };

    fetchCases();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-yellow-400 mb-6">📑 Case Tracking</h1>
      {cases.length === 0 ? (
        <p className="text-gray-400">You have no submitted cases yet.</p>
      ) : (
        <ul className="space-y-4">
          {cases.map((caseItem) => (
            <li key={caseItem.id} className="bg-slate-800 p-4 rounded-xl">
              <h3 className="text-lg font-semibold text-yellow-400">{caseItem.caseTitle}</h3>
              <p className="text-gray-300">Status: {caseItem.status}</p>
              <p className="text-gray-400">{caseItem.submissionDate}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CaseTrackingPage;
