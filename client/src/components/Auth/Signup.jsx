import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail]= useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass]=useState(false);
  const [role, setRole]= useState("");

  const handleSignup = async (e)=>{
    e.preventDefault();
    try{
      const response = await axios.post(
        "http://localhost:5050/api/auth/register",
        {
          name,
          email,
          password,
          role,
        }
      );
      const {token, user} = response.data;
      navigate("/dashboard");
    }
    catch(error){
      console.error("Signup Failed");
      alert("Signup failed : "+(error.response?.data?.message || "Server error"))
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
        <h2 className="text-2xl font-bold text-[#1F2937] mb-6 text-center">Create an Account</h2>
        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <label className="block text-[#1F2937] mb-1">Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FBBF24]"
              placeholder="John Doe"
              value={name}
              onChange={(e)=> setName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-[#1F2937] mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FBBF24]"
              placeholder="you@example.com"
              value={email}
              onChange={(e)=> setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6 relative">
            <label className="block text-[#1F2937] mb-1">Password</label>
            <input
              type={showPass? "text":"password"}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FBBF24]"
              placeholder="••••••••"
              value={password}
              onChange={(e)=> setPassword(e.target.value)}
            />
            <span
            onClick={()=> setShowPass(!showPass)}
            className='absolute right-3 top-10 cursor-pointer text-sm text-gray-400'
            >
              {showPass? "Hide": "Show"}
            </span>
          </div>
          <div className="mb-4">
            <label className="block text-[#1F2937] mb-1">Role</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FBBF24]"
              placeholder="John Doe"
              value={role}
              onChange={(e)=>setRole(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#1F2937] text-[#FBBF24] rounded hover:bg-[#FBBF24] hover:text-[#1F2937] font-medium transition duration-300"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-6 text-center text-[#1F2937]">
          Already have an account?{' '}
          <Link to="/login" className="text-[#FBBF24] hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
