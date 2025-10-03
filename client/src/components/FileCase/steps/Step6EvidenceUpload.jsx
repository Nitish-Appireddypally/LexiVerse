import React from 'react';

const Step6EvidenceUpload = ({ data=[], update, onNext, onBack }) => {
  
  const handleFileChange = (e) => {
    // In a real app, we would upload files here and store URLs.
    // For now, we'll just store the file objects in state.
    const selectedFiles = Array.from(e.target.files);
    update([...data, ...selectedFiles]);
  };

  const handleRemove = (index) => {
    const updatedFiles = data.filter((_, idx) => idx !== index);
    update(updatedFiles);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Step 6: Upload Evidence (Optional)</h2>
      
      <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
        <label htmlFor="file-upload" className="cursor-pointer text-blue-600 font-medium">
          <span>Click to upload files</span>
          <input id="file-upload" name="file-upload" type="file" multiple onChange={handleFileChange} className="sr-only" />
        </label>
        <p className="text-xs text-gray-500 mt-1">PNG, JPG, PDF up to 10MB</p>
      </div>

      {data.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700">Uploaded Files:</h3>
          <ul className="space-y-2">
            {data.map((file, idx) => (
              <li key={idx} className="flex justify-between items-center bg-gray-100 p-2 rounded-md">
                <span className="text-sm text-gray-800 truncate">{file.name}</span>
                <button onClick={() => handleRemove(idx)} className="text-red-500 hover:text-red-700 text-xs font-bold">
                  REMOVE
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-between mt-4">
        <button onClick={onBack} className="py-2 px-6 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300">
          Back
        </button>
        <button onClick={onNext} className="py-2 px-6 bg-[#1F2937] text-white font-semibold rounded-lg shadow-md hover:bg-gray-700">
          Review & Submit
        </button>
      </div>
    </div>
  );
};

export default Step6EvidenceUpload;