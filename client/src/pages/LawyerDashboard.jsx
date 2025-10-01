import React from 'react';
import LawyerSidebar from '../components/Dashboard/LawyerSidebar';
import Header from '../components/Dashboard/Header';
import { FaFolderOpen, FaGavel, FaCalendarAlt, FaCheck, FaTimes } from "react-icons/fa";

// --- Mock Data (to be replaced with API data later) ---
const mockStats = {
  newRequests: 3,
  activeCases: 12,
  upcomingHearings: 4,
};

const mockCaseRequests = [
  { id: 1, clientName: 'Rohan Sharma', caseType: 'Property Dispute', date: 'Oct 01, 2025' },
  { id: 2, clientName: 'Priya Mehta', caseType: 'Family Law', date: 'Sep 30, 2025' },
  { id: 3, clientName: 'Anil Kumar', caseType: 'Consumer Complaint', date: 'Sep 29, 2025' },
];

const mockUpcomingHearings = [
    { id: 1, caseTitle: 'Sharma vs. Builders Inc.', date: 'Oct 15, 2025', court: 'City Civil Court, Hyderabad' },
    { id: 2, caseTitle: 'State vs. John Doe', date: 'Oct 22, 2025', court: 'High Court of Telangana' },
];
// --- End Mock Data ---

// Reusable Stat Card component
const StatCard = ({ icon, title, value, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex items-center gap-6">
    <div className={`text-3xl p-4 rounded-full ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-[#1F2937]">{value}</p>
    </div>
  </div>
);

const LawyerDashboard = () => {
  return (
    <div className="flex bg-[#F9FAFB] min-h-screen">
      <LawyerSidebar />
      <div className="p-6 flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-8 overflow-y-auto">
          <h1 className="text-3xl font-bold text-[#1F2937]">Lawyer Dashboard</h1>
          <p className="mt-2 text-gray-600 mb-8">Welcome to your professional workspace. Here's a summary of your activity.</p>
          
          {/* --- Stats Section --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard icon={<FaFolderOpen />} title="New Case Requests" value={mockStats.newRequests} color="bg-yellow-100 text-yellow-600" />
            <StatCard icon={<FaGavel />} title="Active Cases" value={mockStats.activeCases} color="bg-blue-100 text-blue-600" />
            <StatCard icon={<FaCalendarAlt />} title="Upcoming Hearings" value={mockStats.upcomingHearings} color="bg-green-100 text-green-600" />
          </div>

          {/* --- Main Content Section --- */}
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Recent Case Requests (Main Column) */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-[#1F2937] mb-4">Recent Case Requests</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b text-sm text-gray-500">
                      <th className="py-2">Client Name</th>
                      <th className="py-2">Case Type</th>
                      <th className="py-2">Date</th>
                      <th className="py-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockCaseRequests.map(req => (
                      <tr key={req.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 font-medium text-gray-800">{req.clientName}</td>
                        <td className="py-3 text-gray-600">{req.caseType}</td>
                        <td className="py-3 text-gray-600 text-sm">{req.date}</td>
                        <td className="py-3 flex justify-center gap-3">
                           <button className="p-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200" title="Accept"><FaCheck /></button>
                           <button className="p-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200" title="Decline"><FaTimes /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Upcoming Hearings (Side Column) */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h2 className="text-xl font-semibold text-[#1F2937] mb-4">Upcoming Hearings</h2>
                <div className="space-y-4">
                    {mockUpcomingHearings.map(hearing => (
                        <div key={hearing.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="font-semibold text-gray-800">{hearing.caseTitle}</p>
                            <p className="text-sm text-gray-500 mt-1">{hearing.court}</p>
                            <p className="text-sm font-bold text-[#1F2937] mt-2">{hearing.date}</p>
                        </div>
                    ))}
                </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default LawyerDashboard;