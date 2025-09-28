import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Dashboard/Sidebar';
import Header from '../components/Dashboard/Header';
import { FaEye } from 'react-icons/fa';

const CasesPage = () => {
  const [cases, setCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- START: UPDATED DATA FETCHING LOGIC ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token not found. Please log in.');
        }
        
        // --- NEW: Step 1 -> Fetch the current user's data ---
        const userResponse = await axios.get('http://localhost:5050/api/users/me', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const user = userResponse.data;

        if (!user) {
          throw new Error('Could not retrieve user data.');
        }

        // --- NEW: Step 2 -> Use the user's role to fetch cases ---
        const endpoint = user.role === 'Admin' 
          ? 'http://localhost:5050/api/cases' 
          : 'http://localhost:5050/api/cases/my-cases';

        const casesResponse = await axios.get(endpoint, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        
        setCases(casesResponse.data);
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message;
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  // --- END: UPDATED DATA FETCHING LOGIC ---

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status) => {
    const lowerStatus = status.toLowerCase().replace('_', ' ');
    switch (lowerStatus) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'fir filed':
        return 'bg-indigo-100 text-indigo-800';
      case 'in court':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex bg-[#F9FAFB]">
      <Sidebar />
      <div className="ml-64 w-full flex flex-col h-screen">
        <Header />
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold text-[#1F2937] mb-6">Case Management</h1>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {isLoading && <p className="p-6 text-center text-gray-500">Loading cases...</p>}
            {error && <p className="p-6 text-center text-red-500">Error: {error}</p>}
            {!isLoading && !error && (
              <table className="w-full text-left">
                <thead className="bg-[#1F2937] text-white">
                  <tr>
                    <th className="p-4 font-semibold">Case Title</th>
                    <th className="p-4 font-semibold">Petitioner</th>
                    <th className="p-4 font-semibold">Submission Date</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cases.length > 0 ? (
                    cases.map((caseItem, index) => (
                      <tr key={caseItem.id} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-[#F9FAFB]'}`}>
                        <td className="p-4 font-medium text-gray-800">{caseItem.title}</td>
                        {/* Display the name of the first participant (the petitioner) */}
                        <td className="p-4 text-gray-600">{caseItem.participants[0]?.user?.name || 'N/A'}</td>
                        <td className="p-4 text-gray-600">{formatDate(caseItem.created_at)}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadge(caseItem.status)}`}>
                            {caseItem.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-4">
                          <button className="text-gray-500 hover:text-[#FBBF24] transition" title="View Details">
                            <FaEye size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="p-6 text-center text-gray-500">No cases found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CasesPage;