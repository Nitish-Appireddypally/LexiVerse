import React from 'react';

const Step3AccusedDetails = ({ data, update, onNext, onBack }) => {
  const handleAccusedChange = (index, event) => {
    const newAccused = [...data];
    newAccused[index][event.target.name] = event.target.value;
    update(newAccused);
  };

  const handleAddAccused = () => {
    update([...data, { name: '', address: '' }]);
  };

  const handleRemoveAccused = (index) => {
    const newAccused = data.filter((_, i) => i !== index);
    update(newAccused);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Step 3: Accused Person(s) Details</h2>
      <p className="text-sm text-gray-500">List all known individuals responsible for the offense. If unknown, leave blank.</p>

      {data.map((accused, index) => (
        <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-4 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Accused Name</label>
              <input type="text" name="name" value={accused.name} onChange={(e) => handleAccusedChange(index, e)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address & Other Details</label>
              <input type="text" name="address" value={accused.address} onChange={(e) => handleAccusedChange(index, e)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
          </div>
          {data.length > 1 && (
            <button onClick={() => handleRemoveAccused(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs">
              Remove
            </button>
          )}
        </div>
      ))}

      <button onClick={handleAddAccused} className="py-2 px-4 text-sm bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200">
        + Add Another Accused
      </button>

      <div className="flex justify-between mt-4">
        <button onClick={onBack} className="py-2 px-6 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300">
          Back
        </button>
        <button onClick={onNext} className="py-2 px-6 bg-[#1F2937] text-white font-semibold rounded-lg shadow-md hover:bg-gray-700">
          Next
        </button>
      </div>
    </div>
  );
};

export default Step3AccusedDetails;