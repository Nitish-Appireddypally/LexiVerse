import React from "react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    title: "Upload Case",
    description: "Store and manage your cases",
    icon: "📤",
    route: "/upload-case",
  },
  {
    title: "Talk to LexiBot",
    description: "Ask legal questions, get smart replies",
    icon: "🤖",
    route: "/chatbot",
  },
  {
    title: "Draft Document",
    description: "Generate contracts, notices, and more",
    icon: "📄",
    route: "/draft-document",
  },
  {
    title: "Legal Research",
    description: "Search laws, judgments, and precedents",
    icon: "📚",
    route: "/legal-research",
  },
  {
    title: "Analytics",
    description: "Track trends, actions, and insights",
    icon: "📊",
    route: "/analytics",
  },
  {
    title: "Profile & Settings",
    description: "Manage account and preferences",
    icon: "👤",
    route: "/profile",
  },
];

const FeatureCards = () => {
  const navigate = useNavigate();

  const handleClick = (route) => {
    if (route) {
      navigate(route);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-2 gap-6 mt-8 px-4">
      {features.map((feature, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-lg hover:shadow-xl p-6 transition-all duration-300 cursor-pointer border border-gray-100"
          onClick={() => handleClick(feature.route)}
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
