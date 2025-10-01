// client/src/pages/LawyerProfilePage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import LawyerSidebar from '../components/Dashboard/LawyerSidebar';
import Header from '../components/Dashboard/Header';
import { toast } from 'react-toastify';

// Options for the multi-select dropdown
const specializationOptions = [
  { value: 'Criminal Law', label: 'Criminal Law' },
  { value: 'Civil Law', label: 'Civil Law' },
  { value: 'Family Law', label: 'Family Law' },
  { value: 'Corporate Law', label: 'Corporate Law' },
  { value: 'Property Law', label: 'Property Law' },
  { value: 'Cyber Law', label: 'Cyber Law' },
];

const LawyerProfilePage = () => {
  const [profile, setProfile] = useState({
    bar_council_id: '',
    experience_years: '',
    bio: '',
    specializations: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5050/api/lawyers/profile/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.profile) {
          setProfile(res.data.profile);
        }
      } catch (error) {
        toast.error("Failed to fetch profile.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSpecializationsChange = (selected) => {
    setProfile(prev => ({ ...prev, specializations: selected.map(s => s.value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5050/api/lawyers/profile/me', profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile.");
    } finally {
      setIsUpdating(false);
    }
  };

  const selectStyles = { /* Styling for react-select */ };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex bg-[#F9FAFB] min-h-screen">
      <LawyerSidebar />
      <div className="p-6 flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold text-[#1F2937] mb-6">Manage Your Professional Profile</h1>
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 space-y-6">
            
            <h2 className="text-xl font-semibold text-gray-700 border-b pb-3">Professional Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Bar Council ID</label>
                <input type="text" name="bar_council_id" value={profile.bar_council_id} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#FBBF24] focus:border-[#FBBF24]" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Years of Experience</label>
                <input type="number" name="experience_years" value={profile.experience_years} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#FBBF24] focus:border-[#FBBF24]" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Specializations</label>
              <Select
                isMulti
                options={specializationOptions}
                value={specializationOptions.filter(opt => profile.specializations?.includes(opt.value))}
                onChange={handleSpecializationsChange}
                // styles={selectStyles} // You can add custom styles here
                className="text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Biography / Professional Summary</label>
              <textarea name="bio" value={profile.bio} onChange={handleChange} rows="5" className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#FBBF24] focus:border-[#FBBF24]" />
            </div>
            
            <div className="pt-4 text-right">
              <button type="submit" disabled={isUpdating} className="py-2 px-6 bg-[#1F2937] text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 disabled:bg-gray-400">
                {isUpdating ? 'Saving...' : 'Save Profile'}
              </button>
            </div>

          </form>
        </main>
      </div>
    </div>
  );
};

export default LawyerProfilePage;