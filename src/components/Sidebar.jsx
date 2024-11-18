import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaChartLine,
  FaFolder,
  FaVial,
  FaDatabase,
  FaPlay,
  FaCog,
  FaUser,
  FaSignOutAlt,
  FaTachometerAlt, // Importing a new icon for "Performance Tests"
} from "react-icons/fa";

const SidebarComponent = ({ onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <FaChartLine /> },
    { name: "Projects", path: "/ProjectsPage", icon: <FaFolder /> },
    { name: "Tests", path: "/tests", icon: <FaVial /> },
    { name: "Test Data", path: "/testdata", icon: <FaDatabase /> },
    { name: "Runs", path: "/runs", icon: <FaPlay /> },
    { name: "Performance Tests", path: "/performance-tests", icon: <FaTachometerAlt /> }, // New menu item
    { name: "Settings", path: "/settings", icon: <FaCog /> },
  ];

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-20" : "w-64"
        } bg-gradient-to-r from-cyan-950 to-sky-900 text-white p-5 shadow-xl flex flex-col justify-between`}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-gray-700 mt-4">
            {!isCollapsed && (
              <div>
                <h1 className="text-lg font-bold text-indigo-200">Control Panel</h1>
                <p className="text-xs font-medium text-gray-400">Admin Dashboard</p>
              </div>
            )}
            <button
              onClick={toggleSidebar}
              className="text-gray-300 transition-transform transform hover:rotate-180 text-2xl ml-2"
            >
              <FaBars />
            </button>
          </div>

          {/* Sidebar Menu */}
          <ul className="mt-6 space-y-4">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center ${
                    isCollapsed ? "justify-center" : "justify-start"
                  } p-3 transition-all duration-300 ease-in-out rounded-md ${
                    location.pathname === item.path
                      ? "bg-cyan-700 text-white"
                      : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {!isCollapsed && (
                    <span className="ml-3 text-sm font-semibold">{item.name}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Profile Section */}
        <div className="border-t border-gray-700 pt-4">
          <div
            className={`flex items-center ${
              isCollapsed ? "justify-center" : "justify-start"
            } space-x-3 mb-4`}
          >
            <FaUser className="text-lg text-gray-400" />
            {!isCollapsed && (
              <div>
                <p className="text-sm font-semibold text-gray-200">Username</p>
                <Link
                  to="/profile"
                  className="text-xs font-medium text-gray-400 hover:text-gray-200"
                >
                  View Profile
                </Link>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <button
            className={`flex items-center w-full p-3 text-sm font-semibold rounded-md bg-red-600 hover:bg-red-500 text-white ${
              isCollapsed ? "justify-center" : "justify-start"
            } transition-all duration-300 ease-in-out`}
            onClick={handleLogout}
          >
            <FaSignOutAlt className="text-lg" />
            {!isCollapsed && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div
        className={`flex-1 overflow-y-auto bg-gray-100 transition-all duration-300 ease-in-out ${
          isCollapsed ? "ml-20" : "ml-64"
        }`}
      >
        {/* The main content will be rendered here based on the current route */}
      </div>
    </div>
  );
};

export default SidebarComponent;
