import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/loginbg.jpg"; // Update path as needed
import HeaderLogin from "../components/HeaderForLogin";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === "user@example.com" && password === "password") {
      onLogin();
      navigate("/dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Header positioned at the top */}
      <div className="absolute top-0 w-full">
        <HeaderLogin />
      </div>

      {/* Login Form with Updated Gradient Border */}
      <div className="flex flex-col items-start justify-center flex-1 px-10 ml-48 mt-16">
        <div className="relative z-10 p-0 rounded-md bg-gradient-to-r from-sky-300 to-cyan-500 max-w-lg w-full animate-fade-in-left">
          <div className="rounded-md bg-white p-8">
            <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-cyan-700 text-center">
              Sign In
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-gray-600 font-semibold mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 border border-gray-300"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-gray-600 font-semibold mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 border border-gray-300"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-900 to-sky-900 hover:from-cyan-600 hover:to-sky-800 text-white py-2 rounded-md transition duration-300 transform hover:scale-105 font-semibold shadow-md"
              >
                Login
              </button>
            </form>
            <p className="text-gray-500 mt-4 text-center">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="text-sky-800 font-semibold hover:underline"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Keyframe Animations */}
      <style>
        {`
          @keyframes fadeInLeft {
            0% { opacity: 0; transform: translateX(-20px); }
            100% { opacity: 1; transform: translateX(0); }
          }
          .animate-fade-in-left { animation: fadeInLeft 1.5s ease forwards; }
        `}
      </style>
    </div>
  );
};

export default Login;
