// import React, { useState, useEffect } from "react";
// import Sidebar from "../components/Dashboard/Sidebar";
// import Header from "../components/Dashboard/Header";
// import FileCase from "../components/FileCase/FileCase";
// import SubmissionSuccess from "../components/FileCase/SubmissionSuccess";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const UploadCasePage = () => {
//   // State to track form data
//   const [formData, setFormData] = useState({
//     userInfo: JSON.parse(localStorage.getItem("userInfo")) || {},
//     caseType: "",
//     caseDetails: {},
//     evidenceFiles: [],
//   });

//   const [submitted, setSubmitted] = useState(false);

//   // Retrieve draft from localStorage on mount
//   useEffect(() => {
//     const savedDraft = localStorage.getItem("caseDraft");
//     if (savedDraft) {
//       setFormData(JSON.parse(savedDraft));
//     }
//   }, []);

//   // Save progress to localStorage whenever form data changes
//   const updateStepData = (stepKey, data) => {
//     const updatedData = { ...formData, [stepKey]: data };
//     setFormData(updatedData);
//     localStorage.setItem("caseDraft", JSON.stringify(updatedData));
//   };

//   // Handle form submission and save to API
//   const handleSubmit = async () => {
//     try {
//       // Prepare the data to send to the server
//       const { userInfo, caseType, caseDetails, evidenceFiles } = formData;
//       const caseTitle = caseType;  // Assuming the case type is the title
//       const data = {
//         caseTitle,
//         userInfo,
//         caseDetails,
//         evidenceFiles,
//       };

//       // Make the API call to submit the case
//       const response = await fetch("http://localhost:5050/api/cases", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       });

//       if (!response.ok) throw new Error("Failed to submit");

//       // Successfully submitted
//       const responseData = await response.json();
//       console.log("Submitted case:", responseData);

//       setSubmitted(true);

//       // Show toast notification for success
//       toast.success("Your case has been submitted successfully!");

//       // Clear the draft from localStorage
//       localStorage.removeItem("caseDraft");

//     } catch (error) {
//       console.error("Submission failed:", error);
//       toast.error("Something went wrong. Please try again.");
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       {/* Sidebar */}
//       <div className="w-64 fixed top-0 left-0 h-full z-50">
//         <Sidebar />
//       </div>

//       {/* Main Content */}
//       <div className="ml-64 flex-1 overflow-y-auto">
//         <Header />
//         <ToastContainer position="top-right" autoClose={5000} />
//         <div className="px-8 py-8 max-w-6xl mx-auto max-h-[60vh]">
//           {submitted ? (
//             <SubmissionSuccess />
//           ) : (
//             <>
//               <h1 className="text-3xl font-bold text-yellow-500 mb-8">📝 File a New Case</h1>
//               <div className="bg-white shadow-xl rounded-2xl p-6 md:p-10 border border-slate-200 ">
//                 <FileCase data={formData} update={updateStepData} onSubmit={handleSubmit} />
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UploadCasePage;

import React, { useState, useEffect } from "react";
import Sidebar from "../components/Dashboard/Sidebar";
import Header from "../components/Dashboard/Header";
import FileCase from "../components/FileCase/FileCase";
import SubmissionSuccess from "../components/FileCase/SubmissionSuccess";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UploadCasePage = () => {
  const [formData, setFormData] = useState({
    userInfo: JSON.parse(localStorage.getItem("userInfo")) || {},
    caseType: "",
    caseDetails: {},
    evidenceFiles: [],
  });

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const savedDraft = localStorage.getItem("caseDraft");
    if (savedDraft) {
      setFormData(JSON.parse(savedDraft));
    }
  }, []);

  const updateStepData = (stepKey, data) => {
    const updatedData = { ...formData, [stepKey]: data };
    setFormData(updatedData);
    localStorage.setItem("caseDraft", JSON.stringify(updatedData));
  };

  const handleSubmit = async () => {
    try {
      const { userInfo, caseType, caseDetails, evidenceFiles } = formData;
      const caseTitle = caseType;
      const data = { caseTitle, userInfo, caseDetails, evidenceFiles };

      const response = await fetch("http://localhost:5050/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to submit");

      const responseData = await response.json();
      console.log("Submitted case:", responseData);

      setSubmitted(true);
      toast.success("Your case has been submitted successfully!");
      localStorage.removeItem("caseDraft");
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    // This structure now matches your DashboardHome for consistency
    <div className="flex bg-[#F9FAFB] min-h-screen">
      <Sidebar />
      <ToastContainer position="top-right" autoClose={5000} />

      {/* This single div is now the main scrollable container */}
      <div className="ml-64 flex-1 p-6 overflow-y-auto">
        <Header />
        
        <main className="mt-8">
          {submitted ? (
            <SubmissionSuccess />
          ) : (
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#1F2937]">
                  📝 File a New Case
                </h1>
                <p className="text-gray-600 mt-2">
                  Please provide the following details accurately to generate a professional FIR draft.
                </p>
              </div>

              <FileCase
                data={formData}
                update={updateStepData}
                onSubmit={handleSubmit}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};



export default UploadCasePage;
