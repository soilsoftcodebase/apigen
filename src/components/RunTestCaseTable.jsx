import React, { useState, useEffect, useCallback } from "react";
import { ClipboardIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { getAllTestRuns, getAllProjects } from "../Services/apiGenServices";

const RunTestCaseTable = ({ testData }) => {
  const [filteredRunData, setFilteredRunData] = useState([]);
  const [isAllExpanded, setIsAllExpanded] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});
  const [copiedTextId, setCopiedTextId] = useState(null);
  const [expandedContent, setExpandedContent] = useState(null);
  const [selectedProject, setSelectedProject] = useState("All Projects");
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [runs, setRuns] = useState([]);

  const fetchProjectsAndRuns = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch projects
      const projectsResponse = await getAllProjects();
      setProjects(projectsResponse || []);

      // Fetch test runs
      const runsResponse = await getAllTestRuns();
      setRuns(runsResponse || []);
      setFilteredRunData(runs);
    } catch (err) {
      console.log("Failed to fetch data. Please try again later.", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjectsAndRuns();
  }, [fetchProjectsAndRuns]);

  const handleProjectChange = (e) => {
    const projectName = e.target.value;
    setSelectedProject(projectName);

    if (projectName === "All Projects") {
      // Show all test runs if "All Projects" is selected
      setFilteredRunData(runs || []);
    } else {
      // Filter test runs for the selected project
      const filteredData = runs.filter(
        (run) => run.projectName === projectName
      );
      setFilteredRunData(filteredData);
    }
  };

  const toggleRow = (runId) => {
    setExpandedRows((prevState) => ({
      ...prevState,
      [runId]: !prevState[runId],
    }));
  };

  const toggleAllRows = () => {
    const newState = !isAllExpanded;
    setIsAllExpanded(newState);
    const newExpandedState = filteredRunData.reduce((acc, run) => {
      acc[run.testRunId] = newState;
      return acc;
    }, {});
    setExpandedRows(newExpandedState);
  };

  const handleCopy = (text, uniqueId) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedTextId(uniqueId);
      setTimeout(() => setCopiedTextId(null), 2000);
    });
  };

  const handleExpandContent = (content) => {
    setExpandedContent(content);
  };

  const closeExpandedContent = () => {
    setExpandedContent(null);
  };

  const handleOutsideClick = (e) => {
    if (e.target.id === "modal-background") {
      closeExpandedContent();
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Passed":
        return "text-green-500 font-bold";
      case "Failed":
        return "text-red-500 font-bold";
      case "Skipped":
        return "text-yellow-500 font-bold";
      case "Blocked":
        return "text-gray-500 font-bold";
      default:
        return "text-black";
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-full">
      <h1 className="text-2xl font-bold mb-6 text-start">Run Test Cases</h1>

      {/* Project Selection Dropdown */}
      <div className="mb-6 flex items-center space-x-4">
        <label className="font-semibold text-gray-700">Select Project:</label>
        <select
          value={selectedProject}
          onChange={handleProjectChange}
          className="p-2 border border-gray-300 rounded-md"
        >
          <option value="All Projects">All Projects</option>
          {projects.map((project) => (
            <option key={project.id} value={project.projectName}>
              {project.projectName}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-auto rounded-lg shadow max-w-full">
        <table className="min-w-full w-full bg-white border-collapse">
          <thead className="bg-gradient-to-r from-sky-900 to-teal-900 text-white border-b border-gray-300">
            <tr>
              <th className="p-3 text-center border-r border-gray-200">
                <button
                  onClick={toggleAllRows}
                  className="text-white focus:outline-none"
                >
                  {isAllExpanded ? "Collapse All" : "Expand All"}
                </button>
              </th>
              <th className="p-3 text-center border-r border-gray-200">
                Run ID
              </th>
              <th className="p-3 text-center border-r border-gray-200">
                Project Name
              </th>
              <th className="p-3 text-center border-r border-gray-200">
                Total Tests
              </th>
              <th className="p-3 text-center border-r border-gray-200">
                Passed
              </th>
              <th className="p-3 text-center border-r border-gray-200">
                Failed
              </th>
              <th className="p-3 text-center border-r border-gray-200">
                Blocked
              </th>
              <th className="p-3 text-center">Skipped</th>
            </tr>
          </thead>
          <tbody>
            {filteredRunData.map((run) => (
              <React.Fragment key={run.testRunId}>
                <tr
                  className={`cursor-pointer ${
                    expandedRows[run.testRunId] ? "bg-blue-50" : "bg-white"
                  } hover:bg-blue-100 border-b border-gray-200`}
                  onClick={() => toggleRow(run.testRunId)}
                >
                  <td className="p-3 text-center border-r border-gray-200">
                    {expandedRows[run.testRunId] ? "▲" : "▼"}
                  </td>
                  <td className="p-3 text-center border-r border-gray-200">
                    {run.testRunId}
                  </td>
                  <td className="p-3 text-center border-r border-gray-200">
                    {run.projectName}
                  </td>
                  <td className="p-3 text-center border-r border-gray-200">
                    {run.totalTests}
                  </td>
                  <td className="p-3 text-center text-green-600 border-r border-gray-200">
                    {run.passed}
                  </td>
                  <td className="p-3 text-center text-red-600 border-r border-gray-200">
                    {run.failed}
                  </td>
                  <td className="p-3 text-center text-blue-600 border-r border-gray-200">
                    {run.blocked}
                  </td>
                  <td className="p-3 text-center">{run.skipped}</td>
                </tr>
                {expandedRows[run.testRunId] && (
                  <tr>
                    <td colSpan="8" className="p-4 bg-gray-50">
                      <div className="overflow-auto rounded-lg shadow-inner bg-white">
                        <table className="min-w-full bg-white border border-gray-300">
                          <thead className="bg-gray-700 text-white">
                            <tr>
                              <th className="p-3 text-center border-r border-gray-300">
                                Test ID
                              </th>
                              <th className="p-3 text-center border-r border-gray-300">
                                Input Request URL
                              </th>
                              <th className="p-3 text-center border-r border-gray-300">
                                Payload
                              </th>
                              <th className="p-3 text-center border-r border-gray-300">
                                Actual Response
                              </th>
                              <th className="p-3 text-center">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {run.executedTestCases.map((test) => {
                              const statusStyles = {
                                passed: "bg-green-100 text-green-800",
                                failed: "bg-red-100 text-red-800",
                                skipped: "bg-blue-100 text-blue-500",
                              };

                              const getStatusStyle = (status) =>
                                statusStyles[status.toLowerCase()] ||
                                "bg-white text-gray-800";

                              const truncateText = (text, maxLength = 30) =>
                                text && text.length > maxLength
                                  ? `${text.slice(0, maxLength)}...`
                                  : text;

                              const handleCopyFeedback = (value, id) => {
                                handleCopy(value, id);
                                // Trigger feedback for the copied value
                                alert(`Copied to clipboard: ${value}`);
                              };

                              return (
                                <tr
                                  key={test.testCaseId}
                                  className="hover:bg-gray-50 border-b border-gray-200"
                                >
                                  {/* Test Case ID */}
                                  <td className="p-3 text-center border-r border-gray-200">
                                    <span
                                      title={`Test Case ID: ${test.testCaseId}`}
                                    >
                                      {test.testCaseId}
                                    </span>
                                  </td>

                                  {/* Input URL */}
                                  <td className="p-3 text-center border-r border-gray-200">
                                    <div className="flex justify-center items-center space-x-2">
                                      <span
                                        onClick={() =>
                                          handleExpandContent(test.inputUrl)
                                        }
                                        className="cursor-pointer hover:underline"
                                        title={test.inputUrl}
                                      >
                                        {truncateText(test.inputUrl)}
                                      </span>
                                      <div
                                        onClick={() =>
                                          handleCopyFeedback(
                                            test.inputUrl,
                                            `${run.testRunId}-${test.testCaseId}-url`
                                          )
                                        }
                                        className="cursor-pointer text-gray-500 hover:text-gray-800"
                                        title="Copy URL"
                                        aria-label="Copy URL"
                                      >
                                        <ClipboardIcon className="w-4 h-4 inline-block" />
                                      </div>
                                    </div>
                                  </td>

                                  {/* Payload */}
                                  <td className="p-3 text-center border-r border-gray-200">
                                    <div className="flex justify-center items-center space-x-2">
                                      <span
                                        onClick={() =>
                                          handleExpandContent(
                                            test.payload || "N/A"
                                          )
                                        }
                                        className="cursor-pointer hover:underline"
                                        title={test.payload || "N/A"}
                                      >
                                        {truncateText(test.payload || "N/A")}
                                      </span>
                                      <div
                                        onClick={() =>
                                          handleCopyFeedback(
                                            test.payload || "N/A",
                                            `${run.testRunId}-${test.testCaseId}-payload`
                                          )
                                        }
                                        className="cursor-pointer text-gray-500 hover:text-gray-800"
                                        title="Copy Payload"
                                        aria-label="Copy Payload"
                                      >
                                        <ClipboardIcon className="w-4 h-4 inline-block" />
                                      </div>
                                    </div>
                                  </td>

                                  {/* Response Code */}
                                  <td className="p-3 text-center border-r border-gray-200">
                                    <span
                                      title={`Response Code: ${
                                        test.actualResponseCode || "N/A"
                                      }`}
                                    >
                                      {test.actualResponseCode || "N/A"}
                                    </span>
                                  </td>

                                  {/* Status */}
                                  <td
                                    className={`p-3 text-center font-semibold ${getStatusStyle(
                                      test.status
                                    )}`}
                                  >
                                    <span title={`Status: ${test.status}`}>
                                      {test.status}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {expandedContent && (
        <div
          id="modal-background"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 focus:outline-none"
          onClick={handleOutsideClick}
          tabIndex={-1}
        >
          <div
            className="bg-white p-6 rounded-lg max-w-xl w-full shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              id="modal-title"
              className="text-lg font-semibold mb-4 flex items-center"
            >
              Full Content
              <button
                onClick={closeExpandedContent}
                className="ml-auto text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label="Close expanded content modal"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </h2>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto relative">
              {expandedContent}
              <span
                onClick={() => handleCopy(expandedContent, `modal-content`)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer"
                title="Copy Content"
                aria-label="Copy content to clipboard"
              >
                {copiedTextId === "modal-content" ? (
                  <CheckIcon className="w-5 h-5 text-green-500" />
                ) : (
                  <ClipboardIcon className="w-5 h-5" />
                )}
              </span>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default RunTestCaseTable;
