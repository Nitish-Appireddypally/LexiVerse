import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

const Login = () => {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");;
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async (e)=>{
    e.preventDefault();
    console.log(email);
    console.log(password);
    try{
      const response = await axios.post(
        "http://localhost:5050/api/auth/login",
        {
          email,
          password,
        }
      );

      const {token, user} = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      console.log(user);
      navigate("/dashboard");

    }
    catch(error){
      console.error("Login failed");
      alert("Login Failed : "+(error.response?.data?.message || "Server error"))
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        navigate('/');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] px-4">
      <div ref={containerRef} className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-[#1F2937] mb-6 text-center">Login to Your Account</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-[#1F2937] mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FBBF24]"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6 relative">
            <label className="block text-[#1F2937] mb-1">Password</label>
            <input
              type={showPass? "text":"password"}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FBBF24]"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
            onClick={()=> setShowPass(!showPass)}
            className='absolute right-3 top-10 cursor-pointer text-sm text-gray-400'
            >
              {showPass ? "Hide" : "Show"}
            </span>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#1F2937] text-[#FBBF24] rounded hover:bg-[#FBBF24] hover:text-[#1F2937] font-medium transition duration-300"
          >
            Sign In
          </button>
        </form>
        <p className="mt-6 text-center text-[#1F2937]">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#FBBF24] hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
