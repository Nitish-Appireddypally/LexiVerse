import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Add a default empty object to the data prop for safety
const Step1ComplainantDetails = ({ data = {}, update, onNext }) => {
  // Initialize state directly from the data prop to preserve saved info
  const [details, setDetails] = useState(data);

  useEffect(() => {
    // Only fetch user data IF the form is empty (e.g., first time loading)
    if (!data.name && !data.email) {
      const fetchUserData = async () => {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const res = await axios.get('http://localhost:5050/api/users/me', {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            
            // Create a complete data object with fetched info
            const prefilledData = {
              name: res.data.name || '',
              email: res.data.email || '',
              phone: res.data.phone_number || '',
              address: res.data.address || '',
              fatherName: data.fatherName || '', // Keep any manually entered data
              age: data.age || '',
              nationality: data.nationality || 'Indian',
            };
            
            setDetails(prefilledData);
            update(prefilledData); // IMPORTANT: Update the parent component's state as well

          } catch (error) {
            console.error("Failed to prefill user data.");
          }
        }
      };
      fetchUserData();
    }
  }, []); // Run only once on initial load

  const handleChange = (e) => {
    const updatedDetails = { ...details, [e.target.name]: e.target.value };
    setDetails(updatedDetails);
    // On every change, update the parent component's state
    update(updatedDetails); 
  };

  const handleNext = () => {
    // The parent is already updated, so we just move to the next step
    onNext();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <h2 className="text-xl font-semibold text-gray-800 col-span-full">Step 1: Complainant's Details</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input type="text" name="name" value={details.name || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Father's/Husband's Name</label>
        <input type="text" name="fatherName" value={details.fatherName || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input type="email" name="email" value={details.email || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
        <input type="tel" name="phone" value={details.phone || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" />
      </div>
      <div className="col-span-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
        <textarea name="address" value={details.address || ''} onChange={handleChange} rows="3" className="w-full p-2 border border-gray-300 rounded-md shadow-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
        <input type="number" name="age" value={details.age || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
        <input type="text" name="nationality" value={details.nationality || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm" />
      </div>
      
      <div className="col-span-full text-right mt-4">
        <button onClick={handleNext} className="py-2 px-6 bg-[#1F2937] text-white font-semibold rounded-lg shadow-md hover:bg-gray-700">
          Next
        </button>
      </div>
    </div>
  );
};

export default Step1ComplainantDetails;