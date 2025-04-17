// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
// import "./App.css";
// import Navbar from "./components/Navbar";
// import LandingPage from "./components/LandingPage";
// import Login from "./components/Auth/Login";
// import Signup from "./components/Auth/Signup";
// import { BrowserRouter, Routes, Route } from "react-router-dom";

// function App() {
//   const [count, setCount] = useState(0);

//   return (

//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<LandingPage />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";

// Core Components
import LandingPage from "./components/LandingPage";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";

// Dashboard Home
import DashboardHome from "./components/Dashboard/DashboardHome";
import ChatbotPage from "./components/chatBotPage";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import UserDashboard from "./components/Dashboard/UserDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard Entry Point */}
        <Route path="/dashboard" element={<DashboardHome />} />

        <Route path="/chatbot" element={<ChatbotPage />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
