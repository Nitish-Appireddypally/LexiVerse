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
        const res = await axios.get('http://localhost:5050/api/lawyers/dashboard/active-cases', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setActiveCases(res.data);
      } catch (error) {
        console.error("Failed to fetch active cases.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchActiveCases();
  }, []);

  return (
    <div className="flex bg-[#F9FAFB] min-h-screen">
      <LawyerSidebar />
      <div className="p-6 flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold text-[#1F2937] mb-8">My Active Cases</h1>
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 font-semibold text-gray-600">Case Title</th>
                  <th className="p-4 font-semibold text-gray-600">Client Name</th>
                  <th className="p-4 font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan="3" className="text-center p-4">Loading...</td></tr>
                ) : activeCases.length > 0 ? (
                  activeCases.map(caseItem => (
                    <tr key={caseItem.id} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium text-blue-600 hover:underline">
                        <Link to={`/case/${caseItem.id}`}>{caseItem.title}</Link>
                      </td>
                      <td className="p-4 text-gray-600">{caseItem.clientName}</td>
                      <td className="p-4 text-gray-600">{caseItem.status.replace('_', ' ')}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="3" className="text-center p-6 text-gray-500">You have no active cases.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LawyerActiveCasesPage;