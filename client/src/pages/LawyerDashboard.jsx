import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LawyerSidebar from '../components/Dashboard/LawyerSidebar';
import Header from '../components/Dashboard/Header';
import { FaFolderOpen, FaGavel, FaCalendarAlt, FaCheck, FaTimes } from "react-icons/fa";
import { toast } from 'react-toastify';

// Reusable Stat Card component (no changes needed)
const StatCard = ({ icon, title, value, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex items-center gap-6">
    <div className={`text-3xl p-4 rounded-full ${color}`}>{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-[#1F2937]">{value}</p>
    </div>
  </div>
);

const LawyerDashboard = () => {
  // --- START: State for dynamic data ---
  const [stats, setStats] = useState({ newRequests: 0, activeCases: 0, upcomingHearings: 0 });
  const [caseRequests, setCaseRequests] = useState([]);
  const [upcomingHearings, setUpcomingHearings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isResponding, setIsResponding] = useState(null); // To show loading on a specific button

  // --- END: State for dynamic data ---

  // --- START: Data fetching logic ---
  const fetchDashboardData = async () => {
    // We don't need to set isLoading to true here, to allow for silent refreshes
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const [statsRes, requestsRes, hearingsRes] = await Promise.all([
        axios.get('http://localhost:5050/api/lawyers/dashboard/stats', config),
        axios.get('http://localhost:5050/api/lawyers/dashboard/requests', config),
        axios.get('http://localhost:5050/api/lawyers/dashboard/hearings', config),
      ]);
      setStats(statsRes.data);
      setCaseRequests(requestsRes.data);
      setUpcomingHearings(hearingsRes.data);
    } catch (error) {
      toast.error("Failed to load dashboard data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // --- NEW: Function to handle Accept/Decline ---
  const handleRequestResponse = async (caseId, status) => {
    setIsResponding(caseId); // Set loading state for the clicked row
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`http://localhost:5050/api/lawyers/dashboard/requests/${caseId}`, { status }, config);
      
      toast.success(`Case ${status.toLowerCase()}!`);
      // Refresh all dashboard data to reflect the change
      fetchDashboardData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed.");
    } finally {
      setIsResponding(null); // Reset loading state
    }
  };

 // --- START: CORRECTED FUNCTION ---
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'; // Safety check for missing dates
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric', // CORRECTED: from 'short' to 'numeric'
      month: 'short',
      year: 'numeric'
    });
  };
  // --- END: CORRECTED FUNCTION ---
  return (
    <div className="flex bg-[#F9FAFB] min-h-screen">
      {/* --- START: CORRECTED LAYOUT --- */}
      {/* This wrapper div makes the sidebar fixed, just like in DashboardHome.jsx */}
      <div className="w-64 fixed top-0 left-0 h-full z-50">
        <LawyerSidebar />
      </div>

      {/* This content div is pushed to the right and scrolls independently */}
      <div className="ml-64 flex-1 flex flex-col p-6">
        <Header />
        <main className="flex-1 p-8 overflow-y-auto">
          <h1 className="text-3xl font-bold text-[#1F2937]">Lawyer Dashboard</h1>
          <p className="mt-2 text-gray-600 mb-8">Welcome to your professional workspace. Here's a summary of your activity.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard icon={<FaFolderOpen />} title="New Case Requests" value={isLoading ? '...' : stats.newRequests} color="bg-yellow-100 text-yellow-600" />
            <StatCard icon={<FaGavel />} title="Active Cases" value={isLoading ? '...' : stats.activeCases} color="bg-blue-100 text-blue-600" />
            <StatCard icon={<FaCalendarAlt />} title="Upcoming Hearings" value={isLoading ? '...' : stats.upcomingHearings} color="bg-green-100 text-green-600" />
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-[#1F2937] mb-4">Recent Case Requests</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b text-sm text-gray-500">
                      <th className="py-2">Client Name</th>
                      <th className="py-2">Case Type</th>
                      <th className="py-2">Date Received</th>
                      <th className="py-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr><td colSpan="4" className="text-center p-4">Loading requests...</td></tr>
                    ) : caseRequests.length > 0 ? (
                      caseRequests.map(req => (
                        <tr key={req.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 font-medium text-gray-800">{req.clientName}</td>
                          <td className="py-3 text-gray-600">{req.caseType}</td>
                          <td className="py-3 text-gray-600 text-sm">{formatDate(req.date)}</td>
                          <td className="py-3 flex justify-center gap-3">
                             {/* --- START: UPDATED BUTTONS --- */}
                             <button
                               onClick={() => handleRequestResponse(req.id, 'Accepted')}
                               disabled={isResponding === req.id}
                               className="p-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 disabled:opacity-50" title="Accept"
                             >
                               <FaCheck />
                             </button>
                             <button
                               onClick={() => handleRequestResponse(req.id, 'Declined')}
                               disabled={isResponding === req.id}
                               className="p-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200 disabled:opacity-50" title="Decline"
                              >
                               <FaTimes />
                             </button>
                             {/* --- END: UPDATED BUTTONS --- */}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="4" className="text-center p-4 text-gray-500">No new case requests.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h2 className="text-xl font-semibold text-[#1F2937] mb-4">Upcoming Hearings</h2>
                <div className="space-y-4">
                    {isLoading ? (
                      <p>Loading hearings...</p>
                    ) : upcomingHearings.length > 0 ? (
                      upcomingHearings.map(hearing => (
                          <div key={hearing.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                              <p className="font-semibold text-gray-800">{hearing.caseTitle}</p>
                              <p className="text-sm text-gray-500 mt-1">{hearing.court}</p>
                              <p className="text-sm font-bold text-[#1F2937] mt-2">{formatDate(hearing.date)}</p>
                          </div>
                      ))
                    ) : (
                      <p className="text-center p-4 text-gray-500">No upcoming hearings.</p>
                    )}
                </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LawyerDashboard;