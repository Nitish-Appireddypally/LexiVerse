import React, { useState } from "react";

const Section = ({ title, children }) => (
  <div className="mb-4">
    <h3 className="text-lg font-semibold text-[#1F2937] border-b pb-2 mb-2">
      {title}
    </h3>
    <div className="text-gray-700 space-y-1">{children}</div>
  </div>
);

// This component is now much simpler. It only calls the 'onSubmit' prop.
const Step7ReviewSubmit = ({ data = {}, onBack, onSubmit }) => {
  const [loading, setLoading] = useState(false);

  // This simplified handler now calls the parent's function
  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      // The actual API call is handled by the parent's 'onSubmit' function
      await onSubmit();
    } catch (error) {
      // The parent will show the error toast, but we can stop loading here
      console.error("Submission failed in child, parent will notify.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">
        Step 7: Review & Submit
      </h2>
      <div className="p-4 bg-gray-50 rounded-lg border">
        <Section title="Complainant Details">
          <p>
            <strong>Name:</strong> {data.complainantDetails?.name}
          </p>
          <p>
            <strong>Contact:</strong> {data.complainantDetails?.email} |{" "}
            {data.complainantDetails?.phone}
          </p>
          <p>
            <strong>Address:</strong> {data.complainantDetails?.address}
          </p>
        </Section>

        <Section title="Offense Details">
          <p>
            <strong>Date & Time:</strong> {data.offenseDetails?.offenseDate} at{" "}
            {data.offenseDetails?.offenseTime}
          </p>
          <p>
            <strong>Place of Offense:</strong>{" "}
            {data.offenseDetails?.placeOfOffense}
          </p>
        </Section>

        <Section title="Accused Person(s)">
          {data.accusedPersons?.map(
            (p, i) =>
              p.name && (
                <p key={i}>
                  <strong>{i + 1}:</strong> {p.name} - {p.address}
                </p>
              ),
          )}
        </Section>

        <Section title="Witness(es)">
          {data.witnesses?.map(
            (w, i) =>
              w.name && (
                <p key={i}>
                  <strong>{i + 1}:</strong> {w.name} - {w.contact}
                </p>
              ),
          )}
        </Section>

        <Section title="Case Narrative">
          <p>
            <strong>Case Type:</strong> {data.caseNarrative?.caseType}
          </p>
          <p>
            <strong>Title:</strong> {data.caseNarrative?.title}
          </p>
          <p>
            <strong>Details:</strong> {data.caseNarrative?.incidentDetails}
          </p>
        </Section>
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={onBack}
          className="py-2 px-6 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300"
        >
          Back
        </button>
        {/* This button now calls our simplified local handler */}
        <button
          onClick={handleFinalSubmit}
          disabled={loading}
          className="py-2 px-6 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400"
        >
          {loading ? "Submitting..." : "Confirm & Submit Case"}
        </button>
      </div>
    </div>
  );
};

export default Step7ReviewSubmit;
