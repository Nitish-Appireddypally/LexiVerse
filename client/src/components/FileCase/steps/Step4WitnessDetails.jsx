import React from 'react';

const Step4WitnessDetails = ({ data = [], update, onNext, onBack }) => {
    const handleWitnessChange = (index, event) => {
    const newWitnesses = [...data];
    newWitnesses[index][event.target.name] = event.target.value;
    update(newWitnesses);
  };

  const handleAddWitness = () => {
    update([...data, { name: '', contact: '' }]);
  };

  const handleRemoveWitness = (index) => {
    const newWitnesses = data.filter((_, i) => i !== index);
    update(newWitnesses);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Step 4: Witness(es) Details</h2>
      <p className="text-sm text-gray-500">If anyone witnessed the incident, please provide their details.</p>

      {data.map((witness, index) => (
        <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-4 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Witness Name</label>
              <input type="text" name="name" value={witness.name} onChange={(e) => handleWitnessChange(index, e)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Info (Phone/Address)</label>
              <input type="text" name="contact" value={witness.contact} onChange={(e) => handleWitnessChange(index, e)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
          </div>
          {data.length > 1 && (
            <button onClick={() => handleRemoveWitness(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-xs">
              Remove
            </button>
          )}
        </div>
      ))}

      <button onClick={handleAddWitness} className="py-2 px-4 text-sm bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200">
        + Add Another Witness
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

export default Step4WitnessDetails;