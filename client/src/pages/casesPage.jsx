import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Dashboard/Sidebar";
import Header from "../components/Dashboard/Header";
import { FaEye, FaFilePdf } from "react-icons/fa";
import { Link } from "react-router-dom";

const CasesPage = () => {
  const [cases, setCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generatingId, setGeneratingId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null); // State to hold the logged-in user

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token not found. Please log in.");
        }

        // Step 1: Fetch the current user's data
        const userResponse = await axios.get(
          "http://localhost:5050/api/users/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const user = userResponse.data;
        setCurrentUser(user); // Store the user in state

        if (!user) {
          throw new Error("Could not retrieve user data.");
        }

        // Step 2: Use the user's role to fetch the correct list of cases
        const endpoint =
          user.role === "Admin"
            ? "http://localhost:5050/api/cases"
            : "http://localhost:5050/api/cases/my-cases";

        const casesResponse = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
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

  const handleGenerateFir = async (caseId) => {
    setGeneratingId(caseId);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5050/api/cases/${caseId}/generate-fir`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );
      const file = new Blob([response.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = fileURL;
      const fileName = `FIR-CASE-${caseId}.pdf`;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to generate FIR.";
      alert(`Error: ${errorMessage}`);
    } finally {
      setGeneratingId(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const lowerStatus = status.toLowerCase().replace("_", " ");
    switch (lowerStatus) {
      case "submitted":
        return "bg-blue-100 text-blue-800";
      case "fir filed":
        return "bg-indigo-100 text-indigo-800";
      case "in court":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex bg-[#F9FAFB]">
      <Sidebar />
      <div className="ml-64 p-6 w-full flex flex-col h-screen">
        <Header />
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold text-[#1F2937] mb-6">
            Case Management
          </h1>
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {isLoading && (
              <p className="p-6 text-center text-gray-500">Loading cases...</p>
            )}
            {error && (
              <p className="p-6 text-center text-red-500">Error: {error}</p>
            )}
            {!isLoading && !error && (
              <table className="w-full text-left">
                 <thead className="bg-[#1F2937] text-white">
                  <tr>
                    <th className="p-4 font-semibold">Case Title</th>
                    <th className="p-4 font-semibold">Petitioner</th>
                    <th className="p-4 font-semibold">Assigned Counsel</th>
                    <th className="p-4 font-semibold">Submission Date</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cases.length > 0 ? (
                    cases.map((caseItem) => {
                      // Find the accepted lawyer in the participants list
                      const assignedLawyer = caseItem.participants.find(
                        (p) =>
                          p.role_in_case === "LeadCounsel" &&
                          p.status === "Accepted"
                      );

                      // Logic to check if the current user is a participant in this case
                      const isParticipant =
                        currentUser &&
                        caseItem.participants.some(
                          (p) => p.user_id === currentUser.id
                        );

                      return (
                        <tr
                          key={caseItem.id}
                          className="border-b border-gray-200 hover:bg-gray-50"
                        >
                          <td className="p-4 font-medium text-gray-800">
                            <Link
                              to={`/case/${caseItem.id}`}
                              className="hover:underline hover:text-blue-600"
                            >
                              {caseItem.title}
                            </Link>
                          </td>
                          <td className="p-4 text-gray-600">
                            {caseItem.participants[0]?.user?.name || "N/A"}
                          </td>
                          {/* 👇 NEW COLUMN'S DATA 👇 */}
                          <td className="p-4 font-semibold text-green-700">
                            {assignedLawyer?.user?.name || "Pending"}
                          </td>
                          <td className="p-4 text-gray-600">
                            {formatDate(caseItem.created_at)}
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadge(
                                caseItem.status
                              )}`}
                            >
                              {caseItem.status.replace("_", " ")}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-4">
                              <button
                                className="text-gray-500 hover:text-[#1F2937] transition"
                                title="View Details"
                              >
                                <FaEye size={18} />
                              </button>

                              {/* --- FINAL: Conditionally render the styled button --- */}
                              {isParticipant && (
                                <button
                                  onClick={() => handleGenerateFir(caseItem.id)}
                                  disabled={generatingId === caseItem.id}
                                  className="flex items-center gap-2 text-xs font-bold py-1 px-3 bg-[#1F2937] text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-wait transition"
                                  title="Generate FIR PDF"
                                >
                                  {generatingId === caseItem.id ? (
                                    <span>Generating...</span>
                                  ) : (
                                    <>
                                      <FaFilePdf />
                                      <span>FIR</span>
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="p-6 text-center text-gray-500">
                        No cases found.
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

export default CasesPage;
