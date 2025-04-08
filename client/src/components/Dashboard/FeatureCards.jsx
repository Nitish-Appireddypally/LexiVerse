// FeatureCards.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaFileAlt,
  FaUpload,
  FaRobot,
  FaBookOpen,
  FaChartBar,
  FaUserShield,
} from "react-icons/fa";

const features = [
  {
    title: "Upload Case",
    description: "Store and manage your cases",
    icon: "📤",
  },
  {
    title: "Talk to LexiBot",
    description: "Ask legal questions, get smart replies",
    icon: "🤖",
  },
  {
    title: "Draft Document",
    description: "Generate contracts, notices, and more",
    icon: "📄",
  },
  {
    title: "Legal Research",
    description: "Search laws, judgments, and precedents",
    icon: "📚",
  },
  {
    title: "Analytics",
    description: "Track trends, actions, and insights",
    icon: "📊",
  },
  {
    title: "Profile & Settings",
    description: "Manage account and preferences",
    icon: "👤",
  },
];

const FeatureCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-2 gap-6 mt-8 px-4">
      {features.map((feature, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-lg hover:shadow-xl p-6 transition-all duration-300 cursor-pointer border border-gray-100"
        >
          <div className="text-4xl bg-yellow-400 w-14 h-14 flex items-center justify-center rounded-full mb-4">
            {feature.icon}
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-1">{feature.title}</h2>
          <p className="text-sm text-gray-600">{feature.description}</p>
        </div>
      ))}
    </div>
  );
};

export default FeatureCards;
