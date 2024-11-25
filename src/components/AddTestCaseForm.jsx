import React, { useState } from "react";
import { addTestCaseToProject } from "../Services/apiGenServices";

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
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

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
          <input
            type="text"
            name="inputRequestUrl"
            value={formData.inputRequestUrl}
            onChange={handleFormChange}
            placeholder="Input Request URL"
            className="w-full p-2 border rounded"
          />
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
          {/* <input
            type="text"
            name="apiendpoindid"
            value={formData.apiEndpointId}
            onChange={handleFormChange}
            placeholder="ApiEndpointId"
            className="w-full p-2 border rounded"
          /> */}
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
