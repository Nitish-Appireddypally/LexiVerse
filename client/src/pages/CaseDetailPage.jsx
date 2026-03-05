import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Dashboard/Sidebar";
import LawyerSidebar from "../components/Dashboard/LawyerSidebar";
import Header from "../components/Dashboard/Header";
import {
  FaCheckCircle,
  FaCircle,
  FaEdit,
  FaTimes,
  FaUserTie,
} from "react-icons/fa";

const DetailItem = ({ label, value }) => (
  <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
      {value || "N/A"}
    </dd>
  </div>
);

const caseStatuses = [
  "Draft",
  "Submitted",
  "FIR_Filed",
  "FIR_Accepted",
  "Investigation_In_Progress",
  "Chargesheet_Filed",
  "Closure_Report_Filed",
  "In_Court",
  "Resolved",
  "Closed",
];

const CaseDetailPage = () => {
  const { id } = useParams();
  const [caseData, setCaseData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const [isUpdating, setIsUpdating] = useState(false);
  const [editSection, setEditSection] = useState(null);
  const [formData, setFormData] = useState({});

  const fetchCaseDetails = async () => {
    setIsLoading(true);
    setEditSection(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      // --- START: CORRECTED LOGIC ---
      // Define the config object once and reuse it for all requests
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const userRes = await axios.get(
        "https://lexiverse-backend.onrender.com/api/users/me",
        config,
      );
      setCurrentUser(userRes.data);

      const caseRes = await axios.get(
        `https://lexiverse-backend.onrender.com/api/cases/${id}`,
        config,
      );
      setCaseData(caseRes.data);
      // --- END: CORRECTED LOGIC ---
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCaseDetails();
  }, [id]);

  const handleEditClick = (section, currentData) => {
    setEditSection(section);
    setFormData({
      status: currentData.status,
      fir_number: currentData.fir?.fir_number || "",
      police_station: currentData.fir?.police_station || "",
      investigating_officer: currentData.fir?.investigating_officer || "",
      io_contact: currentData.fir?.io_contact || "",
    });
  };

  const handleFormChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://lexiverse-backend.onrender.com/api/cases/${id}/investigation`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      alert("Case details updated successfully!");
      fetchCaseDetails();
    } catch (err) {
      alert(
        `Error updating details: ${err.response?.data?.message || err.message}`,
      );
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex bg-[#F9FAFB] h-screen">
        <Sidebar />
        <div className="ml-64 w-full flex flex-col">
          <Header />
          <div className="flex-1 flex items-center justify-center">
            <p>Loading Case Details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex bg-[#F9FAFB] h-screen">
        <Sidebar />
        <div className="ml-64 w-full flex flex-col">
          <Header />
          <div className="flex-1 flex items-center justify-center text-red-500">
            <p>Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  // This check must happen AFTER the loading/error guards to ensure caseData is not null
  if (!caseData) {
    return (
      <div className="flex bg-[#F9FAFB] h-screen">
        <Sidebar />
        <div className="ml-64 w-full flex flex-col">
          <Header />
          <div className="flex-1 flex items-center justify-center">
            <p>Case not found.</p>
          </div>
        </div>
      </div>
    );
  }

  const { complainant, offense } = caseData.full_details || {};
  const firDetails = caseData.fir || {};

  // --- THIS IS THE MISSING LINE ---
  const areFirDetailsFilled =
    firDetails.fir_number && firDetails.police_station;
  const isIoAssigned = areFirDetailsFilled && firDetails.investigating_officer;

  // Find the accepted lawyer in the participants list
  const assignedLawyer = caseData.participants.find(
    (p) => p.role_in_case === "LeadCounsel" && p.status === "Accepted",
  );

  return (
    <div className="flex bg-[#F9FAFB] h-screen">
      {currentUser.role === "Lawyer" ? <LawyerSidebar /> : <Sidebar />}
      {/* We apply ml-64 conditionally based on the user role */}
      <div
        className={`flex-1 flex flex-col ${currentUser.role !== "Lawyer" ? "ml-64 p-6" : "p-6"}`}
      >
        {/* --- END: FINAL CORRECTED LAYOUT --- */}

        <Header />
        <main className=" flex-1 p-8 h-[70vh]">
          <Link
            to={currentUser.role === "Lawyer" ? "/lawyer/cases" : "/cases"}
            className="text-sm text-blue-600 hover:underline mb-4 inline-block"
          >
            &larr; Back to Case List
          </Link>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#1F2937]">
                {caseData.title}
              </h1>
              <p className="text-gray-500 mt-1">Case ID: #{caseData.id}</p>
            </div>
            <span className="text-sm font-bold py-1 px-3 bg-blue-100 text-blue-800 rounded-full">
              {caseData.status.replace(/_/g, " ")}
            </span>
          </div>

          {/* 👇 ADD THIS NEW BUTTON/LINK 👇 */}
          {/* Show "Find a Lawyer" button ONLY if no lawyer is engaged */}
          {!assignedLawyer && (
            <div className="mb-8">
              <Link
                to={`/find-lawyer?caseId=${caseData.id}`}
                className="inline-block py-2 px-6 bg-[#FBBF24] text-[#1F2937] font-bold rounded-lg shadow-md hover:bg-yellow-300 transition-colors"
              >
                Find a Lawyer for this Case
              </Link>
            </div>
          )}

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-280px)]">
            {/* Left column with scroll */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md border border-gray-200 overflow-y-auto">
              <h2 className="text-2xl font-semibold text-[#1F2937] mb-4">
                Case Overview
              </h2>
              <div className="border-t border-gray-200">
                <dl>
                  <div className="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-bold text-gray-600">
                      Complainant
                    </dt>
                  </div>
                  <div className="bg-white px-4 py-4 sm:px-6">
                    <DetailItem
                      label="Name"
                      value={caseData.full_details?.complainant?.name}
                    />
                  </div>
                  <div className="bg-white px-4 py-4 sm:px-6">
                    <DetailItem
                      label="Father's/Husband's Name"
                      value={caseData.full_details?.complainant?.fatherName}
                    />
                  </div>
                  <div className="bg-white px-4 py-4 sm:px-6">
                    <DetailItem
                      label="Address"
                      value={caseData.full_details?.complainant?.address}
                    />
                  </div>

                  <div className="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-bold text-gray-600">Offense</dt>
                  </div>
                  <div className="bg-white px-4 py-4 sm:px-6">
                    <DetailItem
                      label="Date & Time"
                      value={
                        caseData.full_details?.offense?.offenseDate
                          ? `${new Date(caseData.full_details.offense.offenseDate).toLocaleDateString()} at ${caseData.full_details.offense.offenseTime}`
                          : "N/A"
                      }
                    />
                  </div>
                  <div className="bg-white px-4 py-4 sm:px-6">
                    <DetailItem
                      label="Place of Offense"
                      value={caseData.full_details?.offense?.placeOfOffense}
                    />
                  </div>

                  <div className="bg-gray-50 px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-bold text-gray-600">
                      Narrative
                    </dt>
                  </div>
                  <div className="bg-white px-4 py-5 sm:px-6">
                    <p className="text-gray-700 leading-relaxed">
                      {caseData.description || "No narrative provided."}
                    </p>
                  </div>
                </dl>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <h2 className="text-xl font-semibold text-[#1F2937] border-b pb-3 mb-6">
                  Investigation Tracker
                </h2>
                <ul className="space-y-6">
                  {/* Step 1 */}
                  <li className="flex gap-4">
                    <FaCheckCircle className="text-green-500 mt-1" size={20} />
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        Case Submitted
                      </h3>
                      <p className="text-sm text-gray-500">
                        Platform record created.
                      </p>
                    </div>
                  </li>

                  {/* Step 2 */}
                  <li
                    className={`flex gap-4 transition-opacity ${editSection && editSection !== "firDetails" ? "opacity-40" : ""}`}
                  >
                    {areFirDetailsFilled ? (
                      <FaCheckCircle
                        className="text-green-500 mt-1"
                        size={20}
                      />
                    ) : (
                      <FaCircle
                        className="text-blue-500 mt-1 animate-pulse"
                        size={20}
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">
                        FIR Details
                      </h3>
                      {editSection === "firDetails" ? (
                        <form
                          onSubmit={handleSave}
                          className="mt-2 space-y-3 text-sm bg-blue-50 p-3 rounded-lg"
                        >
                          <input
                            type="text"
                            name="fir_number"
                            placeholder="FIR Number"
                            value={formData.fir_number}
                            onChange={handleFormChange}
                            className="w-full p-2 border rounded"
                          />
                          <input
                            type="text"
                            name="police_station"
                            placeholder="Police Station"
                            value={formData.police_station}
                            onChange={handleFormChange}
                            className="w-full p-2 border rounded"
                          />
                          <div className="flex gap-2">
                            <button
                              type="submit"
                              disabled={isUpdating}
                              className="py-1 px-3 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                            >
                              {isUpdating ? "Saving..." : "Save"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditSection(null)}
                              className="py-1 px-3 bg-gray-200 text-xs rounded"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="group">
                          <p className="text-sm text-gray-500 mt-1">
                            {areFirDetailsFilled
                              ? `No: ${firDetails.fir_number} at ${firDetails.police_station}`
                              : "Update with official FIR details."}
                          </p>
                          <button
                            onClick={() =>
                              handleEditClick("firDetails", caseData)
                            }
                            className="text-blue-600 hover:underline text-xs mt-1 font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </div>
                  </li>

                  {/* Step 3 */}
                  <li
                    className={`flex gap-4 transition-opacity ${!areFirDetailsFilled || (editSection && editSection !== "ioDetails") ? "opacity-40" : ""}`}
                  >
                    {isIoAssigned ? (
                      <FaCheckCircle
                        className="text-green-500 mt-1"
                        size={20}
                      />
                    ) : (
                      <FaCircle className="text-gray-400 mt-1" size={20} />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">
                        Investigating Officer
                      </h3>
                      {editSection === "ioDetails" ? (
                        <form
                          onSubmit={handleSave}
                          className="mt-2 space-y-3 text-sm bg-blue-50 p-3 rounded-lg"
                        >
                          <input
                            type="text"
                            name="investigating_officer"
                            placeholder="IO Name"
                            value={formData.investigating_officer}
                            onChange={handleFormChange}
                            className="w-full p-2 border rounded"
                          />
                          <input
                            type="text"
                            name="io_contact"
                            placeholder="IO Contact"
                            value={formData.io_contact}
                            onChange={handleFormChange}
                            className="w-full p-2 border rounded"
                          />
                          <div className="flex gap-2">
                            <button
                              type="submit"
                              disabled={isUpdating}
                              className="py-1 px-3 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                            >
                              {isUpdating ? "Saving..." : "Save"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditSection(null)}
                              className="py-1 px-3 bg-gray-200 text-xs rounded"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="group">
                          <p className="text-sm text-gray-500 mt-1">
                            {isIoAssigned
                              ? `${firDetails.investigating_officer} - ${firDetails.io_contact}`
                              : "Update with assigned officer details."}
                          </p>
                          {areFirDetailsFilled && (
                            <button
                              onClick={() =>
                                handleEditClick("ioDetails", caseData)
                              }
                              className="text-blue-600 hover:underline text-xs mt-1 font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              Edit
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </li>

                  {/* Step 4 */}
                  <li
                    className={`flex gap-4 transition-opacity ${editSection && editSection !== "status" ? "opacity-40" : ""}`}
                  >
                    <FaEdit className="text-gray-400 mt-1" size={20} />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">
                        Update Status
                      </h3>
                      {editSection === "status" ? (
                        <form
                          onSubmit={handleSave}
                          className="mt-2 flex items-center gap-2 bg-blue-50 p-3 rounded-lg"
                        >
                          <select
                            name="status"
                            value={formData.status}
                            onChange={handleFormChange}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm"
                          >
                            <option disabled>Select a status</option>
                            {caseStatuses.map((s) => (
                              <option key={s} value={s}>
                                {s.replace(/_/g, " ")}
                              </option>
                            ))}
                          </select>
                          <button
                            type="submit"
                            disabled={isUpdating}
                            className="py-2 px-3 bg-blue-600 text-white font-semibold rounded-lg text-sm"
                          >
                            {isUpdating ? "..." : "Set"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditSection(null)}
                          >
                            <FaTimes className="text-gray-500" />
                          </button>
                        </form>
                      ) : (
                        <div className="group">
                          <p className="text-sm text-gray-500 mt-1">
                            Current:{" "}
                            <span className="font-semibold text-gray-800">
                              {caseData.status.replace(/_/g, " ")}
                            </span>
                          </p>
                          <button
                            onClick={() => handleEditClick("status", caseData)}
                            className="text-blue-600 hover:underline text-xs mt-1 font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Change Status
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CaseDetailPage;
