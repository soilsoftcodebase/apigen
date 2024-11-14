import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createProject,
  getTestCases,
  saveAndGenerateTestCases,
  fetchSwaggerInfo,
} from "../Services/apiGenServices";

const PopupForm = ({
  setShowForm,
  formData,
  setFormData,
  handleFormChange,
}) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [swaggerInfo, setSwaggerInfo] = useState({
    basePath: null,
    title: null,
    version: null,
  });
  const versions = ["v1", "v2", "v3", "v1.0", "v2.0", "v3.0"];

  const onClose = () => {
    setShowForm(false);
    setMessage("");
    setSwaggerInfo({ basePath: null, title: null, version: null });
    setIsVerified(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setMessage("Saving project...");
      setLoading(true);

      await createProject({
        projectName: formData.projectName,
        swaggerUrl: formData.swaggerUrl,
        swaggerVersion: formData.swaggerVersion,
      });

      setMessage("Project created successfully!");
      onClose();
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      setMessage(`Error creating project: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTestCases = async () => {
    if (
      !formData.projectName ||
      !formData.swaggerUrl ||
      !formData.swaggerVersion
    ) {
      alert("Please provide Project Name, URL, and Version.");
      return;
    }
    try {
      setMessage("Saving project...");
      setLoading(true);

      await saveAndGenerateTestCases({
        ProjectName: formData.projectName,
        SwaggerUrl: formData.swaggerUrl,
        SwaggerVersion: formData.swaggerVersion,
      });

      setMessage("Project created successfully! Generating test cases...");

      setTimeout(() => {
        onClose();
        navigate("/tests");
      }, 2000);
    } catch (error) {
      console.error("Error saving project or generating test cases:", error);
      setMessage(
        "Error creating project or generating test cases. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyUrl = async () => {
    if (!formData.swaggerUrl || !formData.swaggerVersion) {
      setVerifyMessage("Please enter both Swagger URL and Version.");
      return;
    }
    try {
      setVerifyMessage("Verifying...");
      setLoading(true);

      const info = await fetchSwaggerInfo(
        formData.swaggerUrl,
        formData.swaggerVersion
      );
      if (info.basePath || info.title || info.version) {
        setSwaggerInfo(info);
        setVerifyMessage("Swagger URL is valid!");
        setIsVerified(true);
      } else {
        setVerifyMessage("Invalid Swagger URL. Please check the URL.");
        setIsVerified(false);
      }
    } catch (error) {
      setVerifyMessage("Invalid Swagger URL. Please check the URL.");
      setIsVerified(false);
      console.error("Error verifying Swagger URL:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">
            Create New Project
          </h3>
          <button
            type="button"
            className="text-gray-500 hover:text-gray-800 transition-colors duration-200"
            onClick={onClose}
          >
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M6.293 14.707a1 1 0 010-1.414L8.586 11 6.293 8.707a1 1 0 111.414-1.414L10 9.586l2.293-2.293a1 1 0 111.414 1.414L11.414 11l2.293 2.293a1 1 0 01-1.414 1.414L10 12.414l-2.293 2.293a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <form className="mt-6" onSubmit={handleSubmit}>
          <div className="grid gap-4 mb-4">
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-800">
                Project Name
              </label>
              <input
                id="projectName"
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleFormChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                placeholder="Enter Project Name"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-800">
                Swagger URL
              </label>
              <div className="flex">
                <input
                  id="swaggerUrl"
                  type="text"
                  name="swaggerUrl"
                  value={formData.swaggerUrl}
                  onChange={(e) => {
                    handleFormChange(e);
                    setVerifyMessage("");
                    setSwaggerInfo({
                      basePath: null,
                      title: null,
                      version: null,
                    });
                    setIsVerified(false);
                  }}
                  className="w-full p-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter Swagger URL"
                  required
                />
                <button
                  type="button"
                  onClick={handleVerifyUrl}
                  className="bg-gradient-to-r from-cyan-700 to-cyan-900 text-white px-4 py-2 rounded-r-lg hover:from-cyan-600 hover:to-cyan-700 transition duration-200 font-semibold"
                >
                  Verify
                </button>
              </div>
              {verifyMessage && (
                <p className="mt-2 text-sm text-gray-600">{verifyMessage}</p>
              )}
              {swaggerInfo.title && (
                <div className="mt-2 text-sm text-gray-700">
                  <p>
                    <strong>Title:</strong> {swaggerInfo.title}
                  </p>
                  <p>
                    <strong>Version:</strong> {swaggerInfo.version}
                  </p>
                  <p>
                    <strong>Base Path:</strong> {swaggerInfo.basePath}
                  </p>
                </div>
              )}
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-800">
                Select Version
              </label>
              <select
                id="swaggerVersion"
                name="swaggerVersion"
                value={formData.swaggerVersion}
                onChange={handleFormChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="">Select Swagger Version</option>
                {versions.map((version, index) => (
                  <option key={index} value={version}>
                    {version}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex space-x-4 mt-6">
            <button
              type="submit"
              disabled={!isVerified}
              className={`w-1/3 py-2 rounded-lg font-semibold transition duration-200 ${
                isVerified
                  ? "bg-teal-600 hover:bg-teal-700 text-white"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleGenerateTestCases}
              disabled={!isVerified}
              className={`w-2/3 py-2 rounded-lg font-semibold transition duration-200 ${
                isVerified
                  ? "bg-gradient-to-r from-sky-700 to-teal-800 hover:from-sky-600 hover:to-teal-700 text-white"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Save & Generate Test Cases
            </button>
          </div>

          {message && (
            <p className="mt-4 text-center text-sm font-semibold text-gray-700">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default PopupForm;
