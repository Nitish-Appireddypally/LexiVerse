// client/src/pages/LawyerProfilePage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import LawyerSidebar from "../components/Dashboard/LawyerSidebar";
import Header from "../components/Dashboard/Header";
import { toast } from "react-toastify";

// Options for the multi-select dropdown
const specializationOptions = [
  { value: "Criminal Law", label: "Criminal Law" },
  { value: "Civil Law", label: "Civil Law" },
  { value: "Family Law", label: "Family Law" },
  { value: "Corporate Law", label: "Corporate Law" },
  { value: "Property Law", label: "Property Law" },
  { value: "Cyber Law", label: "Cyber Law" },
];

const LawyerProfilePage = () => {
  const [profile, setProfile] = useState({
    bar_council_id: "",
    experience_years: "",
    bio: "",
    specializations: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "https://lexiverse-backend.onrender.com/api/lawyers/profile/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
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
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSpecializationsChange = (selected) => {
    setProfile((prev) => ({
      ...prev,
      specializations: selected.map((s) => s.value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "https://lexiverse-backend.onrender.com/api/lawyers/profile/me",
        profile,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile.");
    } finally {
      setIsUpdating(false);
    }
  };

  const selectStyles = {
    /* Styling for react-select */
  };

  return (
    <div className="flex bg-[#F9FAFB] min-h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 fixed top-0 left-0 h-full z-40">
        <LawyerSidebar />
      </div>

      {/* Main content */}
      <div className="ml-64 flex-1 flex flex-col p-6">
        <Header />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1F2937] mb-6">
            Manage Your Professional Profile
          </h1>

          {isLoading ? (
            <p className="text-center text-sm text-gray-500">
              Loading your profile...
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-lg shadow border border-gray-200 max-w-4xl mx-auto p-6 md:p-8 space-y-6"
            >
              {/* Section Header */}
              <h2 className="text-lg font-semibold text-gray-700 border-b pb-3">
                Professional Information
              </h2>

              {/* Bar ID and Experience */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Bar Council ID
                  </label>
                  <input
                    type="text"
                    name="bar_council_id"
                    value={profile.bar_council_id}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#FBBF24] focus:border-[#FBBF24] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    name="experience_years"
                    value={profile.experience_years}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#FBBF24] focus:border-[#FBBF24] text-sm"
                  />
                </div>
              </div>

              {/* Specializations */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Specializations
                </label>
                <Select
                  isMulti
                  options={specializationOptions}
                  value={specializationOptions.filter((opt) =>
                    profile.specializations?.includes(opt.value),
                  )}
                  onChange={handleSpecializationsChange}
                  className="text-sm"
                />
              </div>

              {/* Biography */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Biography / Professional Summary
                </label>
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleChange}
                  rows="5"
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#FBBF24] focus:border-[#FBBF24] text-sm"
                />
              </div>

              {/* Save Button */}
              <div className="pt-4 text-right">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="py-2 px-6 bg-[#1F2937] text-white font-semibold rounded-md shadow hover:bg-gray-800 disabled:bg-gray-400 text-sm"
                >
                  {isUpdating ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </form>
          )}
        </main>
      </div>
    </div>
  );
};

export default LawyerProfilePage;
