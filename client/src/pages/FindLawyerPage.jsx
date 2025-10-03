import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Dashboard/Sidebar';
import Header from '../components/Dashboard/Header';
import { toast } from 'react-toastify';

// These should match the options in LawyerProfilePage.jsx
const specializationOptions = [
  "Criminal Law", "Civil Law", "Family Law", "Corporate Law",
  "Property Law", "Cyber Law", "Labor and Employment", "Consumer Protection"
];

const LawyerCard = ({ lawyer, onRequestHandler, isRequesting, requestedLawyers }) => {
  const isRequested = requestedLawyers.includes(lawyer.user_id);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl hover:border-[#FBBF24] transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-[#1F2937] text-white rounded-full flex items-center justify-center text-3xl font-semibold">
          {lawyer.user.name.charAt(0)}
        </div>
        <div>
          <h3 className="text-xl font-bold text-[#1F2937]">{lawyer.user.name}</h3>
          <p className="text-sm text-gray-500">{lawyer.experience_years || '0'} years of experience</p>
        </div>
      </div>
      <div className="mt-4">
        <h4 className="font-semibold text-gray-600 text-sm mb-2">Specializations:</h4>
        <div className="flex flex-wrap gap-2">
          {lawyer.specializations.map(spec => (
            <span key={spec} className="text-xs font-medium bg-gray-100 text-gray-700 py-1 px-3 rounded-full">{spec}</span>
          ))}
        </div>
      </div>
      <div className="mt-6 text-right">
        <button 
          onClick={() => onRequestHandler(lawyer.user_id)}
          disabled={isRequesting || isRequested}
          className="py-2 px-5 bg-[#1F2937] text-white font-semibold rounded-lg shadow-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isRequesting ? 'Sending...' : isRequested ? 'Request Sent' : 'Send Request'}
        </button>
      </div>
    </div>
  );
};


const FindLawyerPage = () => {
  const [lawyers, setLawyers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [searchParams] = useSearchParams();
  const caseId = searchParams.get('caseId');

  const [isRequesting, setIsRequesting] = useState(false);
  const [requestedLawyers, setRequestedLawyers] = useState([]);


  useEffect(() => {
    const fetchLawyers = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const params = {};
        if (filter) {
          params.specialization = filter;
        }
        const response = await axios.get('http://localhost:5050/api/lawyers', {
          headers: { Authorization: `Bearer ${token}` },
          params: params
        });
        setLawyers(response.data);
      } catch (error) {
        console.error("Failed to fetch lawyers", error);
        toast.error("Failed to fetch lawyers.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLawyers();
  }, [filter]);

  const handleRequest = async (lawyerId) => {
    if (!caseId) {
      toast.error("No case selected. Please go back to your case and try again.");
      return;
    }
    setIsRequesting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5050/api/cases/${caseId}/request-lawyer`,
        { lawyerId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Request sent successfully!");
      setRequestedLawyers(prev => [...prev, lawyerId]);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send request.");
    } finally {
      setIsRequesting(false);
    }
  };


  return (
    <div className="flex bg-[#F9FAFB] min-h-screen">
      <Sidebar />
      <div className="ml-64 p-6 flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold text-[#1F2937]">Find a Legal Professional</h1>
          {caseId && <p className="mt-1 text-gray-500">Sending requests for Case ID: #{caseId}</p>}
          <p className="mt-2 text-gray-600 mb-8">Browse and filter verified lawyers on the LexiVerse platform.</p>

          <div className="mb-8 max-w-sm">
            <label className="block text-sm font-medium text-gray-600 mb-1">Filter by Specialization</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#FBBF24] focus:border-[#FBBF24]"
            >
              <option value="">All Specializations</option>
              {specializationOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>

          {isLoading ? (
            <p>Loading lawyers...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {/* --- THIS IS THE CORRECTED PART --- */}
              {lawyers.map(lawyer => (
                <LawyerCard 
                  key={lawyer.user_id} 
                  lawyer={lawyer}
                  onRequestHandler={handleRequest}
                  isRequesting={isRequesting}
                  requestedLawyers={requestedLawyers}
                />
              ))}
            </div>
          )}
          { !isLoading && lawyers.length === 0 && (
            <div className="text-center py-16 bg-white rounded-xl border">
              <h3 className="text-xl font-semibold text-gray-700">No Lawyers Found</h3>
              <p className="text-gray-500 mt-2">Please try adjusting your filter or check back later.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default FindLawyerPage;