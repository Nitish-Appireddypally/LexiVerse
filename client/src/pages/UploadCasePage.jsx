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
//       const response = await fetch("https://lexiverse-backend.onrender.com/api/cases", {
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
import axios from "axios";

const UploadCasePage = () => {
  const [formData, setFormData] = useState({
    complainantDetails: {},
    offenseDetails: {},
    accusedPersons: [],
    witnesses: [],
    caseNarrative: {},
    evidence: [],
  });
  const [submitted, setSubmitted] = useState(false);

  // useEffect(() => {
  //   const loadDraft = async () => {
  //     try {
  //       const token = localStorage.getItem("token");

  //       // 1️⃣ Load saved local draft first
  //       const savedDraft = localStorage.getItem("caseDraft");
  //       if (savedDraft) {
  //         setFormData(JSON.parse(savedDraft));
  //         return;
  //       }

  //       // 2️⃣ Try loading AI insight
  //       const res = await axios.get(
  //         "https://lexiverse-backend.onrender.com/api/ai-insights/latest",
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         },
  //       );

  //       if (res.data?.insight) {
  //         setFormData((prev) => ({
  //           ...prev,
  //           ...res.data.insight,
  //         }));
  //       }
  //     } catch (error) {
  //       console.log("No AI insight available");
  //     }
  //   };

  //   loadDraft();
  // }, []);

  // useEffect(() => {
  //   const fetchInsight = async () => {
  //     const token = localStorage.getItem("token");

  //     const res = await axios.get(
  //       "https://lexiverse-backend.onrender.com/api/ai-insights/latest",
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       },
  //     );

  //     if (res.data?.insight) {
  //       const ai = res.data.insight;

  //       setFormData({
  //         complainantDetails: {},
  //         offenseDetails: ai.offenseDetails || {},
  //         accusedPersons: ai.accusedPersons || [],
  //         witnesses: ai.witnesses || [],
  //         caseNarrative: ai.caseNarrative || {},
  //         evidence: [],
  //       });
  //     }
  //   };

  //   fetchInsight();
  // }, []);

  useEffect(() => {
    const loadAIInsight = async () => {
      try {
        const response = await axios.get(
          "https://lexiverse-backend.onrender.com/api/ai-insights/latest",
        );

        if (!response.data || !response.data.insight) return;

        const ai = response.data.insight;

        setFormData({
          complainantDetails: {},
          offenseDetails: ai.offenseDetails || {},
          accusedPersons: ai.accusedPersons || [],
          witnesses: ai.witnesses || [],
          caseNarrative: ai.caseNarrative || {},
          evidence: [],
        });
      } catch (error) {
        console.error("AI insight load failed:", error);
      }
    };

    loadAIInsight();
  }, []);

  const updateStepData = (stepKey, data) => {
    const updatedData = { ...formData, [stepKey]: data };
    setFormData(updatedData);
    localStorage.setItem("caseDraft", JSON.stringify(updatedData));
  };

  // This is now the ONLY function that makes the API call
  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication error. Please log in again.");
        return;
      }

      // We exclude the 'evidence' files array for now
      const { evidence, ...payload } = formData;

      const response = await axios.post(
        "https://lexiverse-backend.onrender.com/api/cases",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Submitted case:", response.data);
      setSubmitted(true);
      toast.success("Your case has been submitted successfully!");
      localStorage.removeItem("caseDraft");
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
      // Re-throw the error so the child component knows to stop its loading spinner
      throw error;
    }
  };

  return (
    <div className="flex bg-[#F9FAFB] min-h-screen">
      <Sidebar />
      <ToastContainer position="top-right" autoClose={5000} />

      <div className="ml-64 flex-1 p-6 lg:p-8 overflow-y-auto">
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
                  Please provide the following details accurately to generate a
                  professional FIR draft.
                </p>
              </div>
              <FileCase
                data={formData}
                update={updateStepData}
                onSubmit={handleSubmit} // We pass our single source of truth down
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default UploadCasePage;
