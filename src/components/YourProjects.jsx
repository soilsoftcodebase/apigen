import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [projectDetails, setProjectDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const handleProjectSelect = (e) => {
    const projectId = e.target.value;
    setSelectedProjectId(projectId);
    fetchProjectDetails(projectId);
  };



  return (
    <div className="container mx-auto p-4 ml-10 mt-10">
      <h1 className="text-2xl font-bold mb-4 ">Projects</h1>

      <label htmlFor="projectSelect" className="block mb-6">
        Select a Project:
      </label>
      <select

        id="projectSelect"
        value={selectedProjectId || ''}
        onChange={handleProjectSelect}
        className="border border-gray-300 p-2 mb-4 px-10 py-10:"
      >
        <option value="">-- Select Project --</option>
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>
      <button
            onClick={displayTestCases}
            className="px-10 ml-10 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition duration-200"
          >
            View Data
          </button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        selectedProjectId && (
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 border">TestCaseId</th>
                <th className="px-4 py-2 border">TestCaseName</th>
                <th className="px-4 py-2 border">InputRequestUrl</th>
                <th className="px-4 py-2 border">Payload</th>
                <th className="px-4 py-2 border">ExpectedResponseCode</th>
                <th className="px-4 py-2 border">Steps</th>
                <th className="px-4 py-2 border">Priority</th>
                <th className="px-4 py-2 border">TestType</th>
                <th className="px-4 py-2 border">Generated TestCase Table</th>
              </tr>
            </thead>
            <tbody>
              {projectDetails.map((testCase) => (
                <tr key={testCase.TestCaseId}>
                  <td className="px-4 py-2 border">{testCase.TestCaseId}</td>
                  <td className="px-4 py-2 border">{testCase.TestCaseName}</td>
                  <td className="px-4 py-2 border">{testCase.InputRequestUrl}</td>
                  <td className="px-4 py-2 border">{testCase.Payload}</td>
                  <td className="px-4 py-2 border">{testCase.ExpectedResponseCode}</td>
                  <td className="px-4 py-2 border">{testCase.Steps}</td>
                  <td className="px-4 py-2 border">{testCase.Priority}</td>
                  <td className="px-4 py-2 border">{testCase.TestType}</td>
                  <td className="px-4 py-2 border">{testCase.GeneratedTestCaseTable}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </div>
  );
};

export default Projects;
