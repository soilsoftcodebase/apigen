import React, { useState, useEffect } from "react";
import { getAllProjects, getTestCases } from "../Services/apiGenServices";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [projectCount, setProjectCount] = useState(0);
  const [totalTests, setTotalTests] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all projects
        const projects = await getAllProjects();
        setProjectCount(projects.length);

        // Fetch total tests by iterating over all projects
        let testsCount = 0;
        for (const project of projects) {
          let page = 1;
          let totalPages = 1;

          do {
            const testCaseData = await getTestCases(project.projectName, page);
            testsCount += testCaseData.testCases.length || 0;
            totalPages = testCaseData.totalPages || 1;
            page++;
          } while (page <= totalPages);
        }
        setTotalTests(testsCount);
      } catch (error) {
        console.error("Error fetching data for dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-20 py-10 max-w-7xl bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen ">
      {/* Dashboard Title */}
      <div className="mb-8 text-center mt-40">
        <h2 className="text-3xl font-bold text-gray-800">Dashboard Overview</h2>
        <p className="text-gray-600 mt-2">
          Get a quick summary of your testing activity, project status, and more
          insights.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-96">
          <div className="flex space-x-2 mt-10">
            <div className="w-4 h-4 bg-red-500 rounded-full animate-bounce"></div>
            <div className="w-4 h-4 bg-green-500 rounded-full animate-bounce delay-150"></div>
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce delay-300"></div>
          </div>
          <p className="mt-6 text-2xl font-semibold text-gray-700 animate-pulse">
            "Preparing your dashboard..."
          </p>
          <p className="text-gray-500 mt-2 text-lg">
            Gathering insights to boost your testing capabilities.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          {/* Cards with Slightly Darker Background */}
          <div className="bg-gray-100 border-l-4 border-blue-500 p-6 rounded-lg shadow hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-xl font-semibold text-blue-600">Projects</h3>
            <p className="text-4xl font-bold text-gray-800 mt-2">
              {projectCount}
            </p>
            <p className="text-gray-500 mt-1">
              Total active projects under management
            </p>
          </div>

          <div className="bg-gray-100 border-l-4 border-green-500 p-6 rounded-lg shadow hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-xl font-semibold text-green-600">
              Total Tests
            </h3>
            <p className="text-4xl font-bold text-gray-800 mt-2">
              {totalTests}
            </p>
            <p className="text-gray-500 mt-1">
              Total number of tests conducted
            </p>
          </div>

          <div className="bg-gray-100 border-l-4 border-indigo-500 p-6 rounded-lg shadow hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-xl font-semibold text-indigo-600">
              Passed Tests
            </h3>
            <p className="text-4xl font-bold text-gray-800 mt-2">312</p>
            <p className="text-gray-500 mt-1">
              Successful tests that passed validation
            </p>
          </div>

          <div className="bg-gray-100 border-l-4 border-red-500 p-6 rounded-lg shadow hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-xl font-semibold text-red-600">Failed Tests</h3>
            <p className="text-4xl font-bold text-gray-800 mt-2">15</p>
            <p className="text-gray-500 mt-1">
              Tests that encountered errors or failures
            </p>
          </div>

          <div className="bg-gray-100 border-l-4 border-yellow-500 p-6 rounded-lg shadow hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-xl font-semibold text-yellow-600">
              Blocked Tests
            </h3>
            <p className="text-4xl font-bold text-gray-800 mt-2">7</p>
            <p className="text-gray-500 mt-1">
              Tests that are blocked by other dependencies
            </p>
          </div>

          <div className="bg-gray-100 border-l-4 border-purple-500 p-6 rounded-lg shadow hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
            <h3 className="text-xl font-semibold text-purple-600">
              Skipped Tests
            </h3>
            <p className="text-4xl font-bold text-gray-800 mt-2">6</p>
            <p className="text-gray-500 mt-1">
              Tests that were skipped during execution
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
