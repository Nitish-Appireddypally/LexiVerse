// client/src/components/Auth/SignupLawyer.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const SignupLawyer = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    bar_council_id: "", // Added lawyer-specific field
  });
  const [showPass, setShowPass] = useState(false);

  const { name, email, password, bar_council_id } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // We hardcode the role as 'Lawyer' for this form
      const payload = { ...formData, role: "Lawyer" };

      const response = await axios.post(
        "https://lexiverse-backend.onrender.com/api/auth/register",
        payload,
      );

      const { token, user } = response.data;

      // Store credentials and navigate to the lawyer dashboard
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Registration successful! Welcome to LexiVerse.");
      navigate("/lawyer/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Signup failed. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-[#1F2937] mb-2 text-center">
          Join as a Legal Professional
        </h2>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Create your professional account on LexiVerse.
        </p>
        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label className="block text-[#1F2937] text-sm font-medium mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#FBBF24]"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-[#1F2937] text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#FBBF24]"
              required
            />
          </div>
          <div className="mb-6 relative">
            <label className="block text-[#1F2937] text-sm font-medium mb-1">
              Password
            </label>
            <input
              type={showPass ? "text" : "password"}
              name="password"
              value={password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#FBBF24]"
              required
            />
            <span
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-9 cursor-pointer text-sm text-gray-400"
            >
              {showPass ? "Hide" : "Show"}
            </span>
          </div>
          {/* We can add Bar Council ID right at signup for better onboarding */}
          <div className="mb-6">
            <label className="block text-[#1F2937] text-sm font-medium mb-1">
              Bar Council ID (Optional)
            </label>
            <input
              type="text"
              name="bar_council_id"
              value={bar_council_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#FBBF24]"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#1F2937] text-[#FBBF24] rounded hover:bg-[#FBBF24] hover:text-[#1F2937] font-medium transition duration-300"
          >
            Create Lawyer Account
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-[#1F2937]">
          Already have an account?{" "}
          <Link to="/login" className="text-[#FBBF24] hover:underline">
            Log In
          </Link>
        </p>
        <p className="mt-2 text-center text-xs text-gray-500">
          Not a legal professional?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Register as a Client
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupLawyer;
