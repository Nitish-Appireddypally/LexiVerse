// src/components/FileCase/steps/Step3CaseDetails.jsx
import { useState } from "react";

const Step3CaseDetails = ({ data, update, onNext, onBack }) => {
  const [caseSummary, setCaseSummary] = useState(data?.summary || "");
  const [incidentDetails, setIncidentDetails] = useState(data?.incident || "");
  const [notes, setNotes] = useState(data?.notes || "");

  const handleNext = () => {
  if (!caseSummary || !incidentDetails) {
    alert('Please fill in all required fields.');
    return; 
  }
  update({
    summary: caseSummary,
    incident: incidentDetails,
    notes: notes,
  });
  onNext();
};


  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm mb-1 text-yellow-400">Case Summary <span className="text-red-400">*</span></label>
        <textarea
          rows={3}
          value={caseSummary}
          onChange={(e) => setCaseSummary(e.target.value)}
          className="w-full p-3 rounded-xl bg-slate-800 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          placeholder="Brief summary of the case (1-2 lines)"
        />
      </div>

      <div>
        <label className="block text-sm mb-1 text-yellow-400">Incident Details <span className="text-red-400">*</span></label>
        <textarea
          rows={6}
          value={incidentDetails}
          onChange={(e) => setIncidentDetails(e.target.value)}
          className="w-full p-3 rounded-xl bg-slate-800 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          placeholder="Describe what happened, when and where it occurred, involved parties, etc."
        />
      </div>

      <div>
        <label className="block text-sm mb-1 text-yellow-400">Additional Notes (Optional)</label>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full p-3 rounded-xl bg-slate-800 text-white border border-slate-600 focus:outline-none focus:ring-yellow-400"
          placeholder="Any extra context you’d like to add..."
        />
      </div>

      <div className="flex justify-between">
        <button onClick={onBack} className="px-6 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition">Back</button>

        <button
          onClick={handleNext}
          disabled={!caseSummary || !incidentDetails}
          className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-xl hover:bg-yellow-300 transition disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Step3CaseDetails;
