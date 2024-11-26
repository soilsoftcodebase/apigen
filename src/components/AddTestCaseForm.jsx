/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  addTestCaseToProject,
  getTestcaseData,
} from "../Services/apiGenServices"; // Assuming fetchTestCasesByProject fetches test cases by project name

const AddTestCaseForm = ({ selectedProject, onClose, onTestCaseAdded }) => {
  const [formData, setFormData] = useState({
    testCaseName: "",
    inputRequestUrl: "",
    payload: "",
    expectedResponseCode: "",
    steps: "",
    priority: "",
    testType: "",
    apiEndpointId: "",
    parameters: "", // Single string for parameters (comma-separated values)
  });

  const [loading, setLoading] = useState(false);
  const [availableUrls, setAvailableUrls] = useState([]); // Stores the available test case URLs for the project

  // Fetch test cases for the selected project when the selectedProject prop changes
  useEffect(() => {
    if (!selectedProject) return; // Do nothing if no project is selected
    const fetchTestCases = async () => {
      setLoading(true);
      try {
        // Fetch test cases for the selected project
        const response = await getTestcaseData(selectedProject);
        const testCases = response.data || [];
        setAvailableUrls(testCases); // Set the available URLs from the API response
      } catch (error) {
        console.error("Error fetching test cases:", error);
        alert("An error occurred while fetching the test cases.");
      } finally {
        setLoading(false);
      }
    };

    fetchTestCases();
  }, [selectedProject]);

  // Handle input changes for all fields
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle URL selection change
  const handleUrlSelect = async (e) => {
    const selectedUrl = e.target.value;
    const selectedTestCase = availableUrls.find(
      (url) => url.inputRequest === selectedUrl
    );

    if (selectedTestCase) {
      setLoading(true); // Show loading spinner or indication
      try {
        // Populate the form with the selected test case details
        setFormData({
          ...formData,
          inputRequestUrl: selectedTestCase.inputRequest,
          expectedResponseCode: selectedTestCase.expectedResponseCode,
          payload: selectedTestCase.payload,
          apiEndpointId: selectedTestCase.apiEndpointId,
          parameters: selectedTestCase.parameters || "", // Assuming parameters are a single string
        });
      } catch (error) {
        console.error("Error selecting test case data:", error);
        alert("An error occurred while selecting the test case data.");
      } finally {
        setLoading(false); // Hide loading spinner or indication
      }
    }
  };

  // Submit the form and add the test case to the project
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProject) {
      alert("Please select a project first.");
      return;
    }

    try {
      await addTestCaseToProject(selectedProject, formData);
      alert("Test case added successfully!");
      setFormData({
        testCaseName: "",
        inputRequestUrl: "",
        payload: "",
        expectedResponseCode: "",
        steps: "",
        priority: "",
        testType: "",
        apiEndpointId: "",
        parameters: "", // Reset parameters string
      });
      onTestCaseAdded(); // Notify parent to refresh data
      onClose(); // Close the form
    } catch (error) {
      console.error("Error adding test case:", error);
      alert("An error occurred while adding the test case.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-md shadow-lg w-full sm:w-3/4 lg:w-1/2 xl:w-1/3">
        <h3 className="text-lg font-bold mb-4 text-center">
          Add New Test Case
        </h3>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Test Case Name */}
          <div>
            <label htmlFor="testCaseName" className="block font-medium">
              Test Case Name
            </label>
            <input
              type="text"
              name="testCaseName"
              value={formData.testCaseName}
              onChange={handleFormChange}
              placeholder="Test Case Name"
              className="w-full p-2 border rounded mt-2"
            />
          </div>

          {/* Input Request URL Dropdown */}
          <div>
            <label htmlFor="inputRequestUrl" className="block font-medium">
              Input Request URL
            </label>
            <select
              name="inputRequestUrl"
              value={formData.inputRequestUrl}
              onChange={handleUrlSelect}
              className="w-full p-2 border rounded mt-2"
            >
              <option value="">Select a URL</option>
              {availableUrls.map((url, index) => (
                <option key={index} value={url.inputRequest}>
                  {url.inputRequest}
                </option>
              ))}
            </select>
          </div>

          {/* Editable Input Request URL */}
          <div>
            <label htmlFor="inputRequestUrl" className="block font-medium">
              Editable Input Request URL
            </label>
            <input
              type="text"
              name="inputRequestUrl"
              value={formData.inputRequestUrl}
              onChange={handleFormChange}
              placeholder="Edit Input Request URL"
              className="w-full p-2 border rounded mt-2"
            />
          </div>

          {/* Expected Response Code */}
          <div>
            <label htmlFor="expectedResponseCode" className="block font-medium">
              Expected Response Code
            </label>
            <input
              type="text"
              name="expectedResponseCode"
              value={formData.expectedResponseCode}
              onChange={handleFormChange}
              placeholder="Expected Response Code"
              className="w-full p-2 border rounded mt-2"
            />
          </div>

          {/* Payload */}
          <div>
            <label htmlFor="payload" className="block font-medium">
              Payload
            </label>
            <textarea
              name="payload"
              value={formData.payload}
              onChange={handleFormChange}
              placeholder="Payload"
              className="w-full p-2 border rounded mt-2"
            />
          </div>

          {/* Parameters as a single string */}
          <div>
            <label htmlFor="parameters" className="block font-medium">
              Parameters (comma-separated)
            </label>
            <input
              type="text"
              name="parameters"
              value={formData.parameters}
              onChange={handleFormChange}
              placeholder="Enter parameters as a comma-separated string"
              className="w-full p-2 border rounded mt-2"
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {loading ? "Saving..." : "Save Test Case"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTestCaseForm;
