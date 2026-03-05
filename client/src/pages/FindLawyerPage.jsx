import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Dashboard/Sidebar";
import Header from "../components/Dashboard/Header";
import { toast } from "react-toastify";

// These should match the options in LawyerProfilePage.jsx
const specializationOptions = [
  "Criminal Law",
  "Civil Law",
  "Family Law",
  "Corporate Law",
  "Property Law",
  "Cyber Law",
  "Labor and Employment",
  "Consumer Protection",
];

const LawyerCard = ({
  lawyer,
  onRequestHandler,
  isRequesting,
  requestedLawyers,
}) => {
  const isRequested = requestedLawyers.includes(lawyer.user_id);

  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:shadow-md hover:border-[#FBBF24] transition-all duration-300 text-sm">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-[#1F2937] text-white rounded-full flex items-center justify-center text-lg font-semibold">
          {lawyer.user.name.charAt(0)}
        </div>
        <div>
          <h3 className="text-base font-bold text-[#1F2937]">
            {lawyer.user.name}
          </h3>
          <p className="text-xs text-gray-500">
            {lawyer.experience_years || "0"} yrs experience
          </p>
        </div>
      </div>

      <div className="mt-3">
        <h4 className="font-medium text-gray-600 text-xs mb-1">
          Specializations:
        </h4>
        <div className="flex flex-wrap gap-1">
          {lawyer.specializations.map((spec) => (
            <span
              key={spec}
              className="text-[10px] font-medium bg-gray-100 text-gray-700 py-0.5 px-2 rounded-full"
            >
              {spec}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 text-right">
        <button
          onClick={() => onRequestHandler(lawyer.user_id)}
          disabled={isRequesting || isRequested}
          className="text-xs py-1.5 px-4 bg-[#1F2937] text-white font-semibold rounded-md shadow hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isRequesting
            ? "Sending..."
            : isRequested
              ? "Request Sent"
              : "Send Request"}
        </button>
      </div>
    </div>
  );
};

const FindLawyerPage = () => {
  const [lawyers, setLawyers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [searchParams] = useSearchParams();
  const caseId = searchParams.get("caseId");

  const [isRequesting, setIsRequesting] = useState(false);
  const [requestedLawyers, setRequestedLawyers] = useState([]);

  useEffect(() => {
    const fetchLawyers = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const params = {};
        if (filter) {
          params.specialization = filter;
        }
        const response = await axios.get(
          "https://lexiverse-backend.onrender.com/api/lawyers",
          {
            headers: { Authorization: `Bearer ${token}` },
            params: params,
          },
        );
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
      toast.error(
        "No case selected. Please go back to your case and try again.",
      );
      return;
    }
    setIsRequesting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `https://lexiverse-backend.onrender.com/api/cases/${caseId}/request-lawyer`,
        { lawyerId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Request sent successfully!");
      setRequestedLawyers((prev) => [...prev, lawyerId]);
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
        {" "}
        {/* ↓ Reduced padding */}
        <Header />
        <main className="flex-1 p-4 overflow-y-auto">
          <h1 className="text-2xl font-semibold text-[#1F2937]">
            Find a Legal Professional
          </h1>
          {caseId && (
            <p className="mt-0.5 text-sm text-gray-500">
              Sending requests for Case ID: #{caseId}
            </p>
          )}
          <p className="mt-1 text-sm text-gray-600 mb-6">
            Browse and filter verified lawyers on the LexiVerse platform.
          </p>

          <div className="mb-6 max-w-sm">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Specialization
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full text-sm p-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#FBBF24] focus:border-[#FBBF24]"
            >
              <option value="">All Specializations</option>
              {specializationOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {isLoading ? (
            <p className="text-sm text-gray-500">Loading lawyers...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {" "}
              {/* ↓ Gap reduced */}
              {lawyers.map((lawyer) => (
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

          {!isLoading && lawyers.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg border mt-6">
              <h3 className="text-lg font-semibold text-gray-700">
                No Lawyers Found
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Please try adjusting your filter or check back later.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default FindLawyerPage;
