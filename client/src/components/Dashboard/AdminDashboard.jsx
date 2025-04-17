import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import LexiBotFloating from "./LexiBotFloating";
import FeatureCards from "./FeatureCards";

const AdminDashboard = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 fixed top-0 left-0 h-full z-50">
        <Sidebar />
      </div>

      {/* Main Content (pushed right by sidebar) */}
      <div className="ml-64 w-full min-h-screen bg-gray-50 overflow-y-auto">
        <div className="px-6 py-6">
          <Header />
          <h1 className="text-2xl font-bold text-gray-800 mt-6">LexiVerse Dashboard</h1>
          <FeatureCards />
        </div>
        <LexiBotFloating />
        {/* <LexiBotIframe /> */}

      </div>
    </div>
  );
};

export default AdminDashboard;
