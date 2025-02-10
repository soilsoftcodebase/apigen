import { useState,useLayoutEffect } from "react";
import { FaRegEdit } from "react-icons/fa";
import {
  getAllProjects,
  getTestData,
  updateTestData,
} from "../Services/apiGenServices";
import { useLocalStorageState } from "../hooks/useLocalStorageState";

const TestDataTable = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useLocalStorageState(localStorage.getItem("selectedProject"),"selectedProject");
  const [testData, setTestData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [editRowId, setEditRowId] = useState(null);
  const [originalData, setOriginalData] = useState(null);

  useLayoutEffect(() => {
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

  useLayoutEffect(() => {
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
      setEditRowId(null);
    } catch (error) {
      console.error("Error updating test data:", error);
    }
  };

  const handleEditClick = (testDataId) => {
    setEditRowId(testDataId);
    const originalItem = testData.find(
      (item) => item.testDataId === testDataId
    );
    setOriginalData(originalItem);
  };

  const handleCancelEdit = () => {
    if (originalData) {
      setTestData((prevData) =>
        prevData.map((item) =>
          item.testDataId === originalData.testDataId ? originalData : item
        )
      );
    }
    setEditRowId(null);
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
      <h1 className="text-3xl font-bold mb-6 text-start px-2 text-sky-800 animate-fade-in ">
        Your Test Data
      </h1>
      <div className="w-full h-px bg-gray-300 my-6" />
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <label
            htmlFor="project-select"
            className="mr-2 text-gray-900 text-lg font-semibold"
          >
            Select Project:
          </label>
          <select
            id="project-select"
            name="project-select"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="p-2 border rounded w-full sm:w-auto focus:ring-2 focus:ring-blue-500 font-semibold truncate"
            style={{
              maxWidth: "300px", // Set a fixed maximum width for the dropdown
              overflow: "hidden", // Prevent overflowing text
              textOverflow: "ellipsis", // Add ellipsis for long text
              whiteSpace: "nowrap", // Prevent text from wrapping to the next line
            }}
          >
            <option value="">Choose a project</option>
            {projects.map((project) => (
              <option
                key={`${project.id}-${project.projectName}`}
                value={project.projectName}
              >
                {project.projectName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center font-bold text-blue-700 text-lg animate-pulse">
          Loading...
        </div>
      ) : testData.length > 0 ? (
        <div className="overflow-hidden rounded-lg shadow-lg max-w-full border border-gray-300">
          <div className="overflow-y-auto max-h-96">
            <table className="min-w-full bg-white">
              <thead className="bg-gradient-to-r from-cyan-950 to-sky-900 text-white">
                <tr>
                  <th className="p-4 text-left border-b border-gray-300 pl-10">
                    Parameter Name
                  </th>
                  <th className="p-4 text-left border-b border-gray-300">
                    Parameter Value
                  </th>
                  <th className="p-4 text-center border-b border-gray-300">
                    Edit
                  </th>
                </tr>
              </thead>
              <tbody>
                {testData.map((item, index) => (
                  <tr
                    key={item.testDataId}
                    className={`${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100 transition-colors duration-200`}
                  >
                    <td className="p-4 text-left border-b border-gray-300 pl-10 font-medium text-gray-800">
                      {item.parameterName}
                    </td>

                    <td className="p-4 text-start border-b border-gray-300">
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
                          className="w-full p-2 border border-gray-300 rounded text-center focus:outline-none focus:ring focus:ring-blue-500"
                        />
                      ) : (
                        item.parameterValue
                      )}
                    </td>

                    <td className="p-4 text-center border-b border-gray-300">
                      {editRowId === item.testDataId ? (
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={() => handleSave()}
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-4 rounded transition-transform transform hover:scale-105"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-4 rounded transition-transform transform hover:scale-105"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEditClick(item.testDataId)}
                          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition-transform transform hover:scale-110"
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
        <div className="text-center mt-4 font-bold text-gray-600 text-lg">
          Please select a project First !!
        </div>
      )}
    </div>
  );
};

export default TestDataTable;
