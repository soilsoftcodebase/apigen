import React, { useState, useEffect } from "react";
import { FaRegEdit } from "react-icons/fa";
import {
  getAllProjects,
  getTestData,
  updateTestData,
} from "../Services/apiGenServices";

const TestDataTable = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [testData, setTestData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [editRowId, setEditRowId] = useState(null); // Track the row being edited
  const [originalData, setOriginalData] = useState(null); // Track original data for canceling

  useEffect(() => {
    const fetchAllProjects = async () => {
      try {
        setLoading(true);
        const projects = await getAllProjects();
        setProjects(projects || []);
      } catch (error) {
        console.error("Error fetching project names:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      const fetchTestData = async () => {
        try {
          setLoading(true);
          const data = await getTestData(selectedProject);
          setTestData(data || []);
          setHasChanges(false);
        } catch (error) {
          console.error("Error fetching test data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchTestData();
    }
  }, [selectedProject]);

  const handleEditChange = (testDataId, field, value) => {
    setTestData((prevData) =>
      prevData.map((item) =>
        item.testDataId === testDataId ? { ...item, [field]: value } : item
      )
    );
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      if (!selectedProject) return;
      await updateTestData(selectedProject, testData);
      setHasChanges(false);
      setEditRowId(null); // Exit editing mode
    } catch (error) {
      console.error("Error updating test data:", error);
    }
  };

  const handleEditClick = (testDataId) => {
    setEditRowId(testDataId);
    // Store original data for cancel action
    const originalItem = testData.find((item) => item.testDataId === testDataId);
    setOriginalData(originalItem);
  };

  const handleCancelEdit = () => {
    // Restore original data for the row
    if (originalData) {
      setTestData((prevData) =>
        prevData.map((item) =>
          item.testDataId === originalData.testDataId ? originalData : item
        )
      );
    }
    setEditRowId(null); // Exit editing mode without saving
    setHasChanges(false);
  };

  const handleKeyDown = (event, testDataId) => {
    if (event.key === "Enter") {
      handleSave();
    } else if (event.key === "Escape") {
      handleCancelEdit();
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <label htmlFor="project-select" className="mr-2 text-gray-900 text-lg font-bold">
            Select Project:
          </label>
          <select
            id="project-select"
            name="project-select"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="p-2 border rounded bg-white"
          >
            <option value="">Choose a project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.projectName}>
                {project.projectName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center font-bold">Loading...</div>
      ) : testData.length > 0 ? (
        <div className="overflow-hidden rounded-lg shadow max-w-full">
          <div className="overflow-y-auto max-h-96">
            <table className="min-w-full bg-white relative">
              <thead className="bg-gray-800 text-white sticky top-0">
                <tr>
                  <th className="p-3 text-left pl-10">Parameter Name</th>
                  <th className="p-3 text-left">Parameter Value</th>
                  <th className="p-3 text-center">Edit</th>
                </tr>
              </thead>
              <tbody>
                {testData.map((item) => (
                  <tr
                    key={item.testDataId}
                    className="odd:bg-gray-100 even:bg-gray-200 hover:bg-gray-300">
                    <td className="p-3 text-left font-bold pl-10">{item.parameterName}</td>

                    {/* Conditionally render input or plain text based on editRowId */}
                    <td className="p-3 text-center">
                      {editRowId === item.testDataId ? (
                        <input
                          type="text"
                          value={item.parameterValue || ""}
                          onChange={(e) =>
                            handleEditChange(
                              item.testDataId,
                              "parameterValue",
                              e.target.value
                            )
                          }
                          onKeyDown={(e) => handleKeyDown(e, item.testDataId)}
                          className="w-full p-1 border border-gray-300 rounded text-center"
                        />
                      ) : (
                        item.parameterValue
                      )}
                    </td>

                    <td className="p-3 text-center">
                      {editRowId === item.testDataId ? (
                        <>
                          <button
                            onClick={() => handleSave()}
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded mr-2"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleEditClick(item.testDataId)}
                          className="bg-neutral-500 hover:bg-neutral-700 text-white font-bold py-1 px-3 rounded"
                        >
                          <FaRegEdit />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center mt-4 font-bold text-red-600">
          No test data available for this project.
        </div>
      )}
    </div>
  );
};

export default TestDataTable;
