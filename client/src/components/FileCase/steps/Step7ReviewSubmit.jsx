import React, { useState } from 'react';
import axios from 'axios';

const Section = ({ title, children }) => (
  <div className="mb-4">
    <h3 className="text-lg font-semibold text-[#1F2937] border-b pb-2 mb-2">{title}</h3>
    <div className="text-gray-700 space-y-1">{children}</div>
  </div>
);

const Step7ReviewSubmit = ({ data, onBack, onSubmit }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');

    // We no longer handle file uploads directly here, this assumes URLs would be generated.
    // For now, we'll exclude the file objects from the main payload.
    const { evidence, ...payload } = data;

    try {
      await axios.post("http://localhost:5050/api/cases", payload, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      
      alert("✅ Case submitted successfully!");
      onSubmit(); // This will navigate to the cases page
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to submit case";
      alert(`🚨 Submission failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Step 7: Review & Submit</h2>
      <div className="p-4 bg-gray-50 rounded-lg border">
        
        <Section title="Complainant Details">
          <p><strong>Name:</strong> {data.complainantDetails.name}</p>
          <p><strong>Contact:</strong> {data.complainantDetails.email} | {data.complainantDetails.phone}</p>
          <p><strong>Address:</strong> {data.complainantDetails.address}</p>
        </Section>

        <Section title="Offense Details">
          <p><strong>Date & Time:</strong> {data.offenseDetails.offenseDate} at {data.offenseDetails.offenseTime}</p>
          <p><strong>Place of Offense:</strong> {data.offenseDetails.placeOfOffense}</p>
        </Section>
        
        <Section title="Accused Person(s)">
          {data.accusedPersons.map((p, i) => p.name && <p key={i}><strong>{i+1}:</strong> {p.name} - {p.address}</p>)}
        </Section>
        
        <Section title="Witness(es)">
          {data.witnesses.map((w, i) => w.name && <p key={i}><strong>{i+1}:</strong> {w.name} - {w.contact}</p>)}
        </Section>

        <Section title="Case Narrative">
          <p><strong>Case Type:</strong> {data.caseNarrative.caseType}</p>
          <p><strong>Title:</strong> {data.caseNarrative.title}</p>
          <p><strong>Details:</strong> {data.caseNarrative.incidentDetails}</p>
        </Section>

      </div>
      <div className="flex justify-between mt-4">
        <button onClick={onBack} className="py-2 px-6 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300">
          Back
        </button>
        <button onClick={handleSubmit} disabled={loading} className="py-2 px-6 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400">
          {loading ? "Submitting..." : "Confirm & Submit Case"}
        </button>
      </div>
    </div>
  );
};

export default Step7ReviewSubmit;