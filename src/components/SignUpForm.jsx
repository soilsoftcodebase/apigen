import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/loginbg.jpg"; // Update path as needed
import Header from "../components/Header";

const SignUpForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { username, email, password, confirmPassword } = formData;

    if (!username || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    console.log("Form submitted:", formData);
    setError("");

    // Reset form
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    // Redirect to login page
    navigate("/login");
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center relative"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Header positioned at the top */}
      <div className="absolute top-0 w-full">
        <Header />
      </div>

      {/* SignUp Form with Gradient Border */}
      <div className="flex flex-col items-start justify-center flex-1 px-10 ml-48 mt-16">
        <div className="relative z-10 p-0 rounded-md gradient-to-r from-sky-300 to-cyan-500 max-w-lg w-full animate-fade-in-left">
          <div className="rounded-md p-8">
            <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-cyan-700 text-center">
              Sign Up
            </h2>
            {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Username"
                  className="w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 border border-gray-300"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 border border-gray-300"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 border border-gray-300"
                  required
                />
              </div>
              <div className="mb-6">
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className="w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 border border-gray-300"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-900 to-sky-900 hover:from-cyan-600 hover:to-sky-800 text-white py-2 rounded-md transition duration-300 transform hover:scale-105 font-semibold shadow-md"
              >
                Sign Up
              </button>
            </form>
            <p className="text-gray-500 mt-4 text-center">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-sky-800 font-semibold hover:underline"
              >
                Log in
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

export default SignUpForm;
