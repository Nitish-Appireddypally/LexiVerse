// import React from "react";
// import Sidebar from "./Sidebar";
// import Header from "./Header";
// import LexiBotFloating from "./LexiBotFloating";
// import LexiBotIframe from "./LexiBotIframe";
// import FeatureCards from "./FeatureCards";

// const UserDashboard = () => {
//   return (
//     <div className="flex">
//       {/* Sidebar */}
//       <div className="w-64 fixed top-0 left-0 h-full z-50">
//         <Sidebar />
//       </div>

//       {/* Main Content (pushed right by sidebar) */}
//       <div className="ml-64 w-full min-h-screen bg-gray-50 overflow-y-auto">
//         <div className="px-6 py-6">
//           <Header />
//           <h1 className="text-2xl font-bold text-gray-800 mt-6">LexiVerse Dashboard</h1>
//           <FeatureCards />
//         </div>
//         <LexiBotFloating />
//         {/* <LexiBotIframe /> */}

//       </div>
//     </div>
//   );
// };

// export default UserDashboard;

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { FaGavel, FaUserTie, FaHourglassHalf, FaRobot, FaFileSignature, FaSearch, FaBell } from 'react-icons/fa';

ChartJS.register(ArcElement, Tooltip, Legend);

// Mock Data (to be replaced with API data)
const recentCases = [
    { id: 9, title: "Cheating and Fraud in Online Purchase", status: "Lawyer Engaged", counsel: "Arjun" },
    { id: 8, title: "Property Dispute with Neighbor", status: "Submitted", counsel: null },
];
const notifications = [
    { id: 1, message: "Lawyer Arjun has accepted your case.", time: "2 hours ago", link: "/case/9" },
    { id: 2, message: "A new document 'FIR Draft' was generated.", time: "1 day ago", link: "/case/9" }
];
const chartData = {
  labels: ['Submitted', 'Lawyer Engaged', 'In Court', 'Resolved'],
  datasets: [
    {
      data: [2, 1, 1, 1],
      backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#6B7280'],
      borderColor: '#F9FAFB',
      borderWidth: 4,
    },
  ],
};
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    cutout: '70%',
};

const UserDashboard = () => {
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  return (
    <div className="flex bg-gray-50 h-screen overflow-hidden">
      <Sidebar />
      <div className="ml-64 p-6 flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 p-8 overflow-hidden">
          {/* Main Welcome Banner */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-xl font-bold text-[#1F2937]">Your Legal Command Center</h1>
            <p className="mt-1 text-gray-500 max-w-2xl">From filing your first report to tracking case progress, LexiVerse is your trusted partner.</p>
          </motion.div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Main Content (Left) */}
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="lg:col-span-2 space-y-8">
              
              {/* Core Workflow Section - Refined Styling */}
              <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                <h2 className="text-xl font-semibold text-[#1F2937] mb-4">Your Workflow</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <Link to="/chatbot" className="block p-6 bg-orange-50 rounded-lg border border-yellow-200 hover:shadow-md hover:border-yellow-300 transition-all">
                    {/* --- Color Changed Here --- */}
                    <FaRobot className="text-4xl text-red-600 mx-auto" />
                    <h3 className="font-bold mt-3 text-gray-800">1. Talk to LexiBot</h3>
                    <p className="text-xs text-gray-500 mt-1">Get instant legal insights.</p>
                  </Link>
                  <Link to="/upload-case" className="block p-6 bg-orange-50 rounded-lg border border-yellow-200 hover:shadow-md hover:border-yellow-300 transition-all">
                    {/* --- Color Changed Here --- */}
                    <FaFileSignature className="text-4xl text-red-600 mx-auto" />
                    <h3 className="font-bold mt-3 text-gray-800">2. File a Case</h3>
                    <p className="text-xs text-gray-500 mt-1">Submit your case details.</p>
                  </Link>
                   <Link to="/find-lawyer" className="block p-6 bg-orange-50 rounded-lg border border-yellow-200 hover:shadow-md hover:border-yellow-300 transition-all">
                    {/* --- Color Changed Here --- */}
                    <FaSearch className="text-4xl text-red-600 mx-auto" />
                    <h3 className="font-bold mt-3 text-gray-800">3. Find a Lawyer</h3>
                    <p className="text-xs text-gray-500 mt-1">Connect with legal experts.</p>
                  </Link>
                </div>
              </motion.div>

              {/* Recent Cases Section */}
              <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                <h2 className="text-xl font-semibold text-[#1F2937] mb-4">Recent Cases</h2>
                <div className="space-y-3">
                  {recentCases.map(c => (
                    <Link to={`/case/${c.id}`} key={c.id} className="block p-4 rounded-lg hover:bg-gray-50 border transition-all">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-gray-800">{c.title}</p>
                          {c.counsel ? <p className="text-xs text-green-600 font-medium flex items-center gap-2 mt-1"><FaUserTie /> Engaged: {c.counsel}</p> : <p className="text-xs text-gray-500 mt-1 flex items-center gap-2"><FaHourglassHalf /> Awaiting lawyer assignment</p>}
                        </div>
                        <span className={`text-xs font-bold py-1 px-3 rounded-full ${c.status === 'Resolved' ? 'bg-gray-200 text-gray-800' : c.status === 'Lawyer Engaged' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>{c.status}</span>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="text-right mt-4">
                    <Link to="/cases" className="text-sm font-semibold text-blue-600 hover:underline">View All My Cases &rarr;</Link>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Column */}
            <div className="space-y-8">
                {/* Case Status Overview - Enhanced */}
                <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col">
                  <h2 className="text-xl font-semibold text-[#1F2937] mb-4">Case Status Overview</h2>
                  <div className="relative h-48 w-48 mx-auto">
                    <Doughnut data={chartData} options={chartOptions} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold text-[#1F2937]">5</span>
                        <span className="text-sm text-gray-500">Total Cases</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-4 mt-4 text-xs">
                    {chartData.labels.map((label, i) => (
                        <div key={label} className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: chartData.datasets[0].backgroundColor[i] }}></span>
                            <span>{label}</span>
                        </div>
                    ))}
                  </div>
                </motion.div>
                
                {/* Notifications Section - Included */}
                <motion.div variants={itemVariants} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                    <h2 className="text-xl font-semibold text-[#1F2937] mb-4">Recent Notifications</h2>
                    <ul className="space-y-4">
                        {notifications.map(n => (
                        <li key={n.id} className="flex gap-4">
                            <div className="bg-blue-100 text-blue-600 rounded-full h-8 w-8 flex-shrink-0 flex items-center justify-center"><FaBell /></div>
                            <div>
                            <p className="text-sm text-gray-800 leading-tight">{n.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                            </div>
                        </li>
                        ))}
                    </ul>
                </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;