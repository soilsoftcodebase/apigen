import React, { useState, version } from "react";
import { useNavigate } from "react-router-dom";

const Projects = () => {
  const [url, setUrl] = useState("");
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex justify-center bg-gray-200">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xl mt-16 max-h-min">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Create a Project
        </h2>
        <div className="mb-4">
          <label htmlFor="projectname" className="block text-gray-700 mb-2">
            Project Name
          </label>
          <input
            type="text"
            id="projectname"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Enter the Project Name"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="url" className="block text-gray-700 mb-2">
            Swagger URL
          </label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Enter the URL"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="token" className="block text-gray-700 mb-2">
            Version
          </label>
          <input
            type="text"
            id="token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="Enter the token"
            required
          />
        </div>

        <div className="flex space-x-4 mt-10">
          <button
            onClick={saveProject}
            className="w-1/4 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition duration-200"
          >
            Save Project
          </button>
          <button
            onClick={handleGenerateTestCases}
            className="w-3/4 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition duration-200"
          >
            Save & Generate TestCases
          </button>
        </div>

        {message && <p className="mt-4 text-gray-700 text-center">{message}</p>}
      </div>
    </div>
  );
};

export default Projects;
