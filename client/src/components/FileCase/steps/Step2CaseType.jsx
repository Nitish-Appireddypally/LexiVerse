// src/components/FileCase/steps/Step2CaseType.jsx
import { useState, useEffect } from "react";

const caseTypes = [
  "Civil Dispute",
  "Criminal Offense",
  "Family Matter",
  "Property Dispute",
  "Consumer Complaint",
  "Cyber Crime",
  "Labor/Employment",
  "Contract Breach"
];

const Step2CaseType = ({ data, update, onNext, onBack }) => {
const [selectedType, setSelectedType] = useState(data || caseTypes[0]);  // Default to the first type
  const [suggestion, setSuggestion] = useState("");

  useEffect(() => {
    // Simulate fetching suggestion from LexiBot (can be passed as prop or enhanced later)
    const lexibotSuggestion = "Based on your issue, a 'Consumer Complaint' or 'Contract Breach' may apply.";
    setSuggestion(lexibotSuggestion);
  }, []);

  const handleNext = () => {
    if (!selectedType) return;
    update(selectedType);
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2 text-yellow-400">Suggested by LexiBot</h2>
        <p className="bg-slate-800 p-4 rounded-xl text-sm text-gray-300 border border-slate-600 italic">
          {suggestion}
        </p>
      </div>

      <div>
        <h2 className="text-lg font-medium mb-3 text-yellow-400">Select Case Type</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {caseTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`p-4 rounded-xl text-sm font-medium border transition-all
                ${selectedType === type
                  ? "bg-yellow-400 text-black border-yellow-400"
                  : "bg-slate-800 text-white border-slate-600 hover:border-yellow-400"}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!selectedType}
          className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-xl hover:bg-yellow-300 transition disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Step2CaseType;
