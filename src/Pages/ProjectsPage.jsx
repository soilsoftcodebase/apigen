import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PopupForm from "../components/PopupForm";
import { getAllProjects } from "../Services/apiGenServices";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    projectName: "",
    swaggerUrl: "",
    swaggerVersion: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getAllProjects();
        console.log(data);
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreateProject = () => {
    setShowForm(true);
  };

  const handleSaveProject = () => {
    const newProject = {
      id: projects.length + 1,
      ...formData,
    };
    setProjects([...projects, newProject]);
    setShowForm(false);
    setFormData({
      projectName: "",
      swaggerUrl: "",
      swaggerVersion: "",
    });
  };

  // const handleCardClick = (projectId) => {
  //   navigate(`/project/${projectId}`);
  // };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 px-20 py-10">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-10 mt-40">
        <h1 className="text-2xl font-bold text-gray-700">Projects Dashboard</h1>
        <button
          className="bg-green-600 text-xl  font-bold text-white px-8 py-3 rounded shadow-lg hover:bg-green-700 focus:outline-none transition duration-300 transform hover:-translate-y-1"
          onClick={handleCreateProject}
        >
          Create Project <span className="ml-2">+</span>
        </button>
      </div>

      {/* Popup Form */}
      {showForm && (
        <PopupForm
          showForm={showForm}
          setShowForm={setShowForm}
          formData={formData}
          handleFormChange={handleFormChange}
          handleSaveProject={handleSaveProject}
        />
      )}

      {/* Projects Title */}

      <div className="text-left mb-8 text-lg font-semibold text-gray-500">
        Your Saved Projects
      </div>

      {/* Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.projectId || project.projectName}
            className="bg-white p-6 rounded-xl shadow-lg transform hover:-translate-y-2 hover:shadow-2xl transition duration-300 cursor-pointer"
            onClick={() => handleCardClick(project.projectId)}
          >
            <h3 className="text-lg font-semibold text-blue-700 mb-1">
              {project.projectName}
            </h3>
            <div className="flex items-center text-sm text-gray-600 mb-4">
              <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                Swagger {project.swaggerVersion}
              </span>
            </div>
            <p className="text-gray-700 mb-2">
              <strong>Swagger URL:</strong> {project.swaggerUrl}
            </p>
            <p className="text-gray-600 mt-2 flex items-center">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Active Project
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
