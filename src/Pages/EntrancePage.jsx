import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo2 from "../assets/logo_2.png"; // Update path if needed
import sslogo from "../assets/soilsoftlogo.png"; // Update path if needed

const EntrancePage = () => {
  const navigate = useNavigate();

  const handleSignInClick = () => {
    navigate('/login'); // Redirects to login page
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-800 via-gray-900 to-slate-950 text-white relative overflow-hidden">
      {/* Soilsoft Logo on Left */}
      <img
        src={sslogo}
        alt="SOIL SOFT Logo"
        className="h-36 absolute left-8 top-8 opacity-90 ml-5 mt-5"
      />

      {/* Center APIGEN Logo */}
      <img
        src={logo2}
        alt="APIGEN Logo"
        className="h-48 mb-6 animate-fade-in"
        style={{ animationDuration: "1.2s" }}
      />

      {/* Description */}
      <p className="text-center max-w-3xl text-lg mb-10 text-gray-300 px-6 animate-fade-in-down">
        <strong>APIGEN</strong> is a powerful software testing tool designed to automate API testing effortlessly. Utilizing OpenAPI, it auto-generates and executes API test cases, providing a high-quality, efficient solution for developers and testers alike. With project creation, test generation, and comprehensive result tracking, APIGEN is your essential tool for reliable API testing.
      </p>

      {/* Dark Gradient Button */}
      <button
        onClick={handleSignInClick}
        className="px-20 py-4 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white font-semibold rounded-full shadow-lg transform transition duration-300 hover:scale-105 animate-fade-in-up"
      >
        Explore Demo
      </button>

      {/* Keyframe Animations */}
      <style>
        {`
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeInDown {
            0% { opacity: 0; transform: translateY(-20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in { animation: fadeIn 1.2s ease forwards; }
          .animate-fade-in-down { animation: fadeInDown 1.5s ease forwards; }
          .animate-fade-in-up { animation: fadeInUp 1.5s ease forwards; }
        `}
      </style>
    </div>
  );
};

export default EntrancePage;
