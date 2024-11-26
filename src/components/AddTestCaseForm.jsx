/* eslint-disable react/prop-types */
import { useState } from "react";
import { addTestCaseToProject } from "../Services/apiGenServices";

const AddTestCaseForm = ({
  selectedProject,
  onClose,
  onTestCaseAdded,
  availableUrls,
}) => {
  const [formData, setFormData] = useState({
    testCaseName: "",
    inputRequestUrl: "",
    payload: "",
    expectedResponseCode: "",
    steps: "",
    priority: "",
    testType: "",
    apiEndpointId: "",
  });

  // Handle input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle URL selection change
  const handleUrlSelect = (e) => {
    const selectedUrl = e.target.value;

    // Find the selected URL object that contains inputRequestUrl and apiEndpointId
    const selectedUrlData = availableUrls.find(
      (url) => url.inputRequestUrl === selectedUrl
    );

    if (selectedUrlData) {
      // Update the formData with the selected URL and its apiEndpointId
      setFormData({
        ...formData,
        inputRequestUrl: selectedUrlData.inputRequestUrl,
        apiEndpointId: selectedUrlData.apiEndpointId, // Set apiEndpointId
      });
    }
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!selectedProject) {
      alert("Please select a project first.");
      return;
    }

    try {
      const result = await addTestCaseToProject(selectedProject, formData);
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
      });
      onTestCaseAdded(); // Notify parent to refresh data
      onClose(); // Close the form
    } catch (error) {
      console.error("Error adding test case:", error);
      alert("An error occurred while adding the test case.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex mt-36 items-center justify-center">
      <div className="bg-white p-6 rounded-md shadow-lg w-1/2">
        <h3 className="text-lg font-bold mb-4">Add New Test Case</h3>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <input
            type="text"
            name="testCaseName"
            value={formData.testCaseName}
            onChange={handleFormChange}
            placeholder="Test Case Name"
            className="w-full p-2 border rounded"
          />

          {/* Dropdown for Input Request URL */}
          <div>
            <label htmlFor="inputRequestUrl" className="block font-medium">
              Input Request URL
            </label>
            <select
              name="inputRequestUrl"
              value={formData.inputRequestUrl}
              onChange={handleUrlSelect}
              className="w-full p-2 border rounded"
            >
              <option value="">Select a URL</option>
              {availableUrls &&
                availableUrls.map((url, index) => (
                  <option key={index} value={url.inputRequestUrl}>
                    {url.inputRequestUrl}
                  </option>
                ))}
            </select>
          </div>

          <textarea
            name="payload"
            value={formData.payload}
            onChange={handleFormChange}
            placeholder="Payload"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="expectedResponseCode"
            value={formData.expectedResponseCode}
            onChange={handleFormChange}
            placeholder="Expected Response Code"
            className="w-full p-2 border rounded"
          />
          <textarea
            name="steps"
            value={formData.steps}
            onChange={handleFormChange}
            placeholder="Steps"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="priority"
            value={formData.priority}
            onChange={handleFormChange}
            placeholder="Priority"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="testType"
            value={formData.testType}
            onChange={handleFormChange}
            placeholder="Test Type"
            className="w-full p-2 border rounded"
          />

          {/* The API Endpoint ID is automatically set when a URL is selected */}
          <input
            type="text"
            name="apiEndpointId"
            value={formData.apiEndpointId}
            onChange={handleFormChange}
            placeholder="API Endpoint ID"
            className="w-full p-2 border rounded"
            disabled
          />

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-800"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTestCaseForm;
