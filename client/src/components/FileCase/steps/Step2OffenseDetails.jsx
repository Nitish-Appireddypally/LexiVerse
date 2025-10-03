import React, { useState } from 'react';

const Step2OffenseDetails = ({ data = {}, update, onNext, onBack }) => {
  const [details, setDetails] = useState({
    offenseDate: data.offenseDate || '',
    offenseTime: data.offenseTime || '',
    placeOfOffense: data.placeOfOffense || '',
    delayReason: data.delayReason || '',
  });


  const handleChange = (e) => {
    setDetails(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNext = () => {
    update(details);
    onNext();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Step 2: Offense Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Offense</label>
          <input type="date" name="offenseDate" value={details.offenseDate} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Time of Offense (approx.)</label>
          <input type="time" name="offenseTime" value={details.offenseTime} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Place of Offense</label>
        <textarea name="placeOfOffense" value={details.placeOfOffense} onChange={handleChange} rows="3" className="w-full p-2 border border-gray-300 rounded-md shadow-sm" placeholder="Full address where the incident occurred, including city and state." />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Delay in Reporting (if any)</label>
        <textarea name="delayReason" value={details.delayReason} onChange={handleChange} rows="2" className="w-full p-2 border border-gray-300 rounded-md shadow-sm" />
      </div>

      <div className="flex justify-between mt-4">
        <button onClick={onBack} className="py-2 px-6 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300">
          Back
        </button>
        <button onClick={handleNext} className="py-2 px-6 bg-[#1F2937] text-white font-semibold rounded-lg shadow-md hover:bg-gray-700">
          Next
        </button>
      </div>
    </div>
  );
};

export default Step2OffenseDetails;