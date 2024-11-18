import React, { useState } from "react";

const PerformanceTestForm = () => {
  const [formData, setFormData] = useState({
    testType: "Load Test",
    virtualUsers: "",
    rampUpTime: "",
    loopCount: "",
  });

  const [errors, setErrors] = useState({
    virtualUsers: false,
    rampUpTime: false,
    loopCount: false,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "testType") {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
      return;
    }

    if (value === "" || /^[0-9]+$/.test(value)) {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
      setErrors((prevErrors) => ({ ...prevErrors, [name]: false }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: true }));
    }
  };

  const handleSave = () => {
    alert("Settings saved!");
  };

  const handleSaveAndRun = () => {
    setIsModalOpen(true);
  };

  const confirmSaveAndRun = () => {
    setIsModalOpen(false);
    alert("Settings saved and performance test started!");
  };

  const isFormValid =
    formData.virtualUsers && formData.rampUpTime && formData.loopCount && !Object.values(errors).includes(true);

  return (
    <div className='mt-48'>
        <div className="mb-6 flex items-center ml-48">
        <label className="font-bold text-gray-700">Select Project:</label>
        <select
          // value={selectedProject}
          // onChange={handleProjectChange}
          className="p-2 border border-gray-300 w-48 rounded-md ml-3">
          <option value="All Projects">All Projects</option>
          {/* {projects.map((project) => (
            <option key={project.id} value={project.projectName}>
              {project.projectName}
            </option>
          ))} */}
        </select>
        <label className="font-bold text-gray-700 ml-72">Select API:</label>
        <select
          // value={selectedProject}
          // onChange={handleProjectChange}
          className="p-2 border border-gray-300 w-48 rounded-md ml-3">
          <option value="Your APIs">Your APIs</option>
          {/* {projects.map((project) => (
            <option key={project.id} value={project.projectName}>
              {project.projectName}
            </option>
          ))} */}
        </select>
      </div>
        
    <div className="p-8 bg-white shadow-xl rounded-lg max-w-4xl mx-auto">
      
      <h1 className="text-3xl font-bold mb-6 text-sky-800 animate-fade-in flex justify-center">
        Performance Tests 
      </h1>

      <form className="space-y-6">
        {/* Test Type */}
        <div className="animate-slide-up">
          <label
            htmlFor="testType"
            className="block text-sm font-bold text-gray-700"
          >
            Test Type
          </label>
          <select
            id="testType"
            name="testType"
            value={formData.testType}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-300"
          >
            <option>Load Test</option>
            <option>Stress Test</option>
            <option>Spike Test</option>
          </select>
          <p className="text-xs  text-gray-500 mt-1">
            Choose the type of performance test to run.
          </p>
        </div>

        {/* Virtual Users */}
        <div className="animate-slide-up">
          <label
            htmlFor="virtualUsers"
            className="block text-sm font-bold text-gray-700"
          >
            Number of Virtual Users
          </label>
          <input
            type="number"
            id="virtualUsers"
            name="virtualUsers"
            value={formData.virtualUsers}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border ${
              errors.virtualUsers ? "border-red-500" : "border-gray-300"
            } p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-transform duration-300 focus:scale-105`}
            placeholder="Enter number of virtual users"
          />
          {errors.virtualUsers && (
            <p className="text-red-500 text-sm mt-1">
              Please enter a valid integer.
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Specify the number of users simulated in the test.
          </p>
        </div>

        {/* Ramp Up Time */}
        <div className="animate-slide-up">
          <label
            htmlFor="rampUpTime"
            className="block text-sm font-bold text-gray-700"
          >
            Ramp up time (seconds)
          </label>
          <input
            type="number"
            id="rampUpTime"
            name="rampUpTime"
            value={formData.rampUpTime}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border ${
              errors.rampUpTime ? "border-red-500" : "border-gray-300"
            } p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-transform duration-300 focus:scale-105`}
            placeholder="Enter ramp up time in seconds"
          />
          {errors.rampUpTime && (
            <p className="text-red-500 text-sm mt-1">
              Please enter a valid integer.
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Time in seconds to ramp up the users.
          </p>
        </div>

        {/* Loop Count */}
        <div className="animate-slide-up">
          <label
            htmlFor="loopCount"
            className="block text-sm font-bold text-gray-700"
          >
            Loop Count
          </label>
          <input
            type="number"
            id="loopCount"
            name="loopCount"
            value={formData.loopCount}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border ${
              errors.loopCount ? "border-red-500" : "border-gray-300"
            } p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-transform duration-300 focus:scale-105`}
            placeholder="Enter loop count"
          />
          {errors.loopCount && (
            <p className="text-red-500 text-sm mt-1">
              Please enter a valid integer.
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            The number of times the test should repeat.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={handleSave}
            disabled={!isFormValid}
            className={`px-6 py-2 text-sm font-bold rounded-md shadow transform hover:scale-105 ${
              isFormValid
                ? "bg-gray-500 text-white hover:bg-gray-600"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            } transition-all duration-200`}
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleSaveAndRun}
            disabled={!isFormValid}
            className={`px-8 py-2 text-sm font-bold rounded-md shadow transform hover:scale-105 ${
              isFormValid
                ? "bg-teal-600 text-white hover:bg-teal-700"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            } transition-all duration-200`}
          >
            Save and Run
          </button>
        </div>
      </form>

      {/* Modal for Save and Run Confirmation */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-bold text-gray-800">
              Confirm Save and Run
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              Are you sure you want to save the settings and start the test?
            </p>
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmSaveAndRun}
                className="px-4 py-2 bg-sky-700 text-white rounded-md hover:bg-sky-900"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default PerformanceTestForm;
