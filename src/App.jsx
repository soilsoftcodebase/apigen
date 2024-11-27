import React, { useState, useEffect } from "react";
import { ToastContainer } from 'react-toastify';
import {
  HashRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import EntrancePage from "./Pages/EntrancePage";
import ProjectsPage from "./Pages/ProjectsPage";
import SidebarComponent from "./components/Sidebar";
import Dashboard from "./Pages/DashBoard";
import Projects from "./components/Projects";
import Tests from "./Pages/Tests";
import Runs from "./Pages/Runs";
import Settings from "./Pages/Settings";
import Login from "./Pages/LoginPage";
import SignUpForm from "./components/SignUpForm";
import Header from "./components/Header";
import SavedProjects from "./components/YourProjects";
import PopupForm from "./components/PopupForm";
import GenerateTestCaseTable from "./components/GenerateTestCaseTable";
import TestData from "./Pages/TestData";
import PerformanceTestForm from "./components/PerformanceTestsForm";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => JSON.parse(localStorage.getItem("isAuthenticated")) || false
  );

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
  };

  useEffect(() => {
    // Keep the auth state in sync with localStorage
    localStorage.setItem("isAuthenticated", JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  return (
    <Router>
      <div className="flex min-h-screen">
        {/* Show Sidebar only after login */}
        {isAuthenticated && (
          <SidebarComponent onLogout={handleLogout} />
        )}

        <div className="flex-1 relative">
          {/* Render header with logout functionality */}
          {isAuthenticated && (
            <Header
              caption="Advanced API Test Generator and Executor"
              onLogout={handleLogout}
            />
          )}

          <Routes>
            {/* Default Route - Shows EntrancePage if not authenticated */}
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <EntrancePage />
                )
              }
            />

            {/* Login Route */}
            <Route path="/login" element={<Login onLogin={handleLogin} />} />

            {/* Authenticated Routes */}
            <Route
              path="/dashboard"
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
            />
            <Route
              path="/projects"
              element={isAuthenticated ? <Projects /> : <Navigate to="/" />}
            />
            <Route
              path="/saved-projects"
              element={
                isAuthenticated ? <SavedProjects /> : <Navigate to="/" />
              }
            />
            <Route
              path="/ProjectsPage"
              element={isAuthenticated ? <ProjectsPage /> : <Navigate to="/" />}
            />
            <Route
              path="/PopupForm"
              element={isAuthenticated ? <PopupForm /> : <Navigate to="/" />}
            />
            <Route
              path="/tests"
              element={isAuthenticated ? <Tests /> : <Navigate to="/" />}
            />
            <Route
              path="/testdata"
              element={isAuthenticated ? <TestData /> : <Navigate to="/" />}
            />
            <Route
              path="/runs"
              element={isAuthenticated ? <Runs /> : <Navigate to="/" />}
            />
            <Route
              path="/performance-tests"
              element={isAuthenticated ? <PerformanceTestForm /> : <Navigate to="/" />}
            />
            <Route
              path="/GenerateTestCaseTable"
              element={
                isAuthenticated ? (
                  <GenerateTestCaseTable />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/TestdataTable"
              element={
                isAuthenticated ? (
                  <GenerateTestCaseTable />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/settings"
              element={
                isAuthenticated ? (
                  <Settings onLogout={handleLogout} />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route path="/signup" element={<SignUpForm />} />
          </Routes>
        </div>
        <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
        theme="colored"
        style={{ marginTop: "25px" }} // Add margin to top
      />
      </div>
    </Router>
  );
};

export default App;
