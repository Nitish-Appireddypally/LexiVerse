import React, { useState, useEffect } from "react";

const caseTypes = [
  "Criminal Offense",
  "Civil Dispute",
  "Family Matter",
  "Property Dispute",
  "Consumer Complaint",
  "Cyber Crime",
  "Labor/Employment",
  "Contract Breach",
];

const Step5CaseNarrative = ({ data = {}, update, onNext, onBack }) => {
  const [narrative, setNarrative] = useState({
    caseType: caseTypes[0],
    title: "",
    incidentDetails: "",
  });

  // ⭐ THIS FIXES AUTOFILL
  useEffect(() => {
    if (data) {
      setNarrative({
        caseType: data.caseType || caseTypes[0],
        title: data.title || "",
        incidentDetails: data.incidentDetails || "",
      });
    }
  }, [data]);

  const handleChange = (e) => {
    setNarrative((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNext = () => {
    update(narrative);
    onNext();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">
        Step 5: Case Narrative & Type
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Case Type
        </label>
        <select
          name="caseType"
          value={narrative.caseType}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
        >
          {caseTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Case Title / Summary
        </label>
        <input
          type="text"
          name="title"
          value={narrative.title}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
          placeholder="e.g., Theft of personal vehicle"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Detailed Narrative of the Incident
        </label>
        <textarea
          name="incidentDetails"
          value={narrative.incidentDetails}
          onChange={handleChange}
          rows="6"
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
          placeholder="Describe the sequence of events in detail..."
        />
      </div>

      <div className="flex justify-between mt-4">
        <button
          onClick={onBack}
          className="py-2 px-6 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="py-2 px-6 bg-[#1F2937] text-white font-semibold rounded-lg shadow-md hover:bg-gray-700"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Step5CaseNarrative;
