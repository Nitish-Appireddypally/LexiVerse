import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Sidebar from '../components/Dashboard/Sidebar';
import Header from '../components/Dashboard/Header';

const UserProfilePage = () => {
  const [profile, setProfile] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // We wrap fetchProfile in useCallback to ensure it's stable
  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5050/api/users/me', {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      });
      
      const userData = res.data;
      if (userData.date_of_birth) {
        userData.date_of_birth = new Date(userData.date_of_birth).toISOString().split('T')[0];
      }
      setProfile(userData);
    } catch (error) {
      toast.error("Failed to fetch profile.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleChange = (e) => {
    setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5050/api/users/me', profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Profile updated successfully!");
      fetchProfile(); 
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <div className="flex bg-[#F9FAFB] min-h-screen">
      <Sidebar />
      <div className="ml-64 flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold text-[#1F2937] mb-8">My Profile</h1>
          {isLoading ? <p className="text-center">Loading your profile...</p> : (
            // --- START: CORRECTED LAYOUT ---
            // Main form container now uses flex-col to separate the button
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 max-w-4xl mx-auto flex flex-col h-[75vh]">
              
              {/* This inner div is now the only scrollable part */}
              <div className="p-8 overflow-y-auto">
                {/* Profile Picture Section */}
                <div className="flex items-center gap-6 border-b pb-6 mb-6">
                  <div className="w-24 h-24 bg-[#1F2937] text-white rounded-full flex items-center justify-center text-4xl font-bold">
                    {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{profile.name}</h2>
                    <p className="text-gray-500">{profile.email}</p>
                  </div>
                </div>

                {/* The form tag now has an ID and only wraps the input fields */}
                <form id="profile-form" onSubmit={handleSubmit} className="space-y-8">
                  <section>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Full Name</label>
                        <input type="text" name="name" value={profile.name || ''} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md"/>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Father's Name</label>
                        <input type="text" name="father_name" value={profile.father_name || ''} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md"/>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Date of Birth</label>
                        <input type="date" name="date_of_birth" value={profile.date_of_birth || ''} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md"/>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Gender</label>
                        <select name="gender" value={profile.gender || ''} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md">
                          <option value="">Select...</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </section>
                  <section>
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Contact & Identity</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Phone Number</label>
                        <input type="tel" name="phone_number" value={profile.phone_number || ''} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md"/>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Aadhaar Card Number</label>
                        <input type="text" name="aadhar_number" value={profile.aadhar_number || ''} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md"/>
                      </div>
                      <div className="col-span-full">
                        <label className="block text-sm font-medium text-gray-600">Full Address</label>
                        <textarea name="address" value={profile.address || ''} onChange={handleChange} rows="3" className="mt-1 w-full p-2 border rounded-md"/>
                      </div>
                    </div>
                  </section>
                </form>
              </div>

              {/* This div is outside the scrollable area, so it stays fixed */}
              <div className="p-6 border-t mt-auto">
                <div className="text-right">
                  <button 
                    type="submit" 
                    form="profile-form" // This links the button to the form above
                    disabled={isUpdating} 
                    className="py-2 px-8 bg-[#1F2937] text-white font-semibold rounded-lg shadow-md hover:bg-gray-800 transition-colors disabled:bg-gray-400"
                  >
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
            // --- END: CORRECTED LAYOUT ---
          )}
        </main>
      </div>
    </div>
  );
};

export default UserProfilePage;