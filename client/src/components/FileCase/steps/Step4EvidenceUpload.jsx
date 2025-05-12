// src/components/FileCase/steps/Step4EvidenceUpload.jsx
import { useState } from "react";

const Step4EvidenceUpload = ({ data, update, onNext, onBack }) => {
  const [files, setFiles] = useState(data || []);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];
    const filtered = selectedFiles.filter(file => allowedTypes.includes(file.type));

    const newFiles = [...files, ...filtered];
    setFiles(newFiles);
    update(newFiles);
  };

  const handleRemove = (index) => {
  const updatedFiles = files.filter((_, idx) => idx !== index);
  setFiles(updatedFiles);
  update(updatedFiles);
};

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm mb-2 text-yellow-400">Upload Supporting Evidence</label>
        <input
          type="file"
          accept=".png, .jpg, .jpeg, .pdf"
          multiple
          onChange={handleFileChange}
          className="block w-full p-3 rounded-xl bg-slate-800 text-white border border-slate-600"
        />
        <p className="text-xs text-gray-400 mt-2">Accepted: PNG, JPG, PDF. Max size: 5MB per file (enforced later).</p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-yellow-400">Uploaded Files</h3>
          <ul className="space-y-2">
            {files.map((file, idx) => (
              <li
                key={idx}
                className="flex justify-between items-center bg-slate-800 p-3 rounded-xl border border-slate-600"
              >
                <span className="text-sm text-white truncate">{file.name}</span>
                <button
                  onClick={() => handleRemove(idx)}
                  className="text-red-400 text-xs hover:text-red-300"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-xl hover:bg-yellow-300 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Step4EvidenceUpload;
