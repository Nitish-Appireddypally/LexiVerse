import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LawyerSidebar from '../components/Dashboard/LawyerSidebar';
import Header from '../components/Dashboard/Header';

const LawyerActiveCasesPage = () => {
  const [activeCases, setActiveCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActiveCases = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          'http://localhost:5050/api/lawyers/dashboard/active-cases',
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setActiveCases(res.data);
      } catch (error) {
        console.error('Failed to fetch active cases.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchActiveCases();
  }, []);

  const getStatusBadge = (status) => {
    const lowerStatus = status.toLowerCase().replace("_", " ");
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
    <div className="flex bg-[#F9FAFB] min-h-screen">
      {/* Sidebar */}
      <div className="w-64 fixed top-0 left-0 h-full z-40">
        <LawyerSidebar />
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 flex flex-col p-6">
        <Header />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1F2937] mb-6">
            My Active Cases
          </h1>

          <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            {isLoading ? (
              <p className="p-4 text-center text-gray-500 text-sm">Loading...</p>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-[#1F2937] text-white text-sm">
                  <tr>
                    <th className="px-3 py-2 font-medium">Case Title</th>
                    <th className="px-3 py-2 font-medium">Client Name</th>
                    <th className="px-3 py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {activeCases.length > 0 ? (
                    activeCases.map((caseItem) => (
                      <tr
                        key={caseItem.id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="px-3 py-2 font-medium text-blue-600 hover:underline">
                          <Link to={`/case/${caseItem.id}`}>
                            {caseItem.title}
                          </Link>
                        </td>
                        <td className="px-3 py-2 text-gray-700">
                          {caseItem.clientName}
                        </td>
                        <td className="px-3 py-2">
                          <span
                            className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusBadge(
                              caseItem.status
                            )}`}
                          >
                            {caseItem.status.replace('_', ' ')}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="p-6 text-center text-gray-500 text-sm"
                      >
                        You have no active cases.
                      </td>
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

export default LawyerActiveCasesPage;
