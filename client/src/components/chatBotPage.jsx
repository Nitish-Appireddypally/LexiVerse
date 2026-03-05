// import React from "react";

// const ChatbotPage = () => {
//   return (
//     <div style={{
//       height: "100vh",
//       width: "100vw",
//       overflow: "hidden",
//     }}>
//       <iframe
//         src="http://localhost:8501"
//         width="100%"
//         height="100%"
//         frameBorder="0"
//         title="LexiBot Chatbot"
//       />
//     </div>
//   );
// };

// export default ChatbotPage;

import React from "react";
import Sidebar from "./Dashboard/Sidebar";
import Header from "./Dashboard/Header";

const ChatbotPage = () => {
  const token = localStorage.getItem("token");

  const streamlitAppUrl = `http://localhost:8501/?token=${token}`;
  return (
    <div className="flex bg-[#F9FAFB]">
      {/* Sidebar */}
      <div className="w-64 fixed top-0 left-0 h-full z-50">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="ml-64 p-6 w-full flex flex-col h-screen">
        <Header />
        <main className="flex-1 p-6 overflow-hidden">
          <div className="w-full h-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <iframe
              src={streamlitAppUrl}
              width="100%"
              height="100%"
              style={{ border: "none", backgroundColor: "white" }} // Removes the default iframe border
              title="LexiVerse AI Chatbot"
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChatbotPage;
