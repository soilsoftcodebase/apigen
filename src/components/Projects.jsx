import { useState, useEffect } from "react";
//import { useNavigate } from "react-router-dom";
import PopupForm from "../components/PopupForm";
import {
  getAllProjects,
  createProject,
  generateTestCases,
} from "../Services/apiGenServices";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [formData, setFormData] = useState({
    projectName: "",
    swaggerUrl: "",
    swaggerVersion: "",
  });
  const [loading, setLoading] = useState(false);
  //const navigate = useNavigate();

  // Fetch all projects on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await getAllProjects();
        setProjects(data || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
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

  const handleSaveProject = async () => {
    try {
      // Validate input
      if (!formData.projectName.trim()) {
        alert("Project name cannot be empty.");
        return;
      }

      // Fetch the latest projects from the backend
      const updatedProjects = await getAllProjects();

      // Check for duplicate project names (case-insensitive)
      const projectExists = updatedProjects.some(
        (project) =>
          project.projectName.trim().toLowerCase() ===
          formData.projectName.trim().toLowerCase()
      );

      if (projectExists) {
        alert(
          "A project with this name already exists. Please choose another name."
        );
        return;
      }

      // Prepare the payload for project creation
      const saveProjectDto = {
        projectName: formData.projectName.trim(),
        swaggerUrl: formData.swaggerUrl.trim(),
        swaggerVersion: formData.swaggerVersion.trim(),
      };

      // Create the project
      const newProject = await createProject(saveProjectDto);

      // Add the new project to the state
      setProjects([...projects, newProject]);
      setShowForm(false);

      // Reset the form data
      setFormData({
        projectName: "",
        swaggerUrl: "",
        swaggerVersion: "",
      });

      alert(`Project '${formData.projectName}' created successfully.`);
    } catch (error) {
      alert(`Error creating project: ${error.message}`);
      console.error("Error creating project:", error);
    }
  };

  const handleCardClick = (project) => {
    setSelectedProject(project);
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  const handleGenerateTestCases = async (projectName) => {
    try {
      await generateTestCases(projectName);
      alert(`Test cases generated successfully for project: ${projectName}`);
    } catch (error) {
      alert(`Error generating test cases: ${error.message}`);
    }
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 px-20 py-10">
      {/* Header Section */}
      <div className="mt-36">
        <h1 className="text-3xl font-bold text-sky-800 animate-fade-in ">
          Projects Dashboard
        </h1>
        <div className="w-full h-px bg-gray-300 my-6" />
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
      <div className="inline-flex  justify-between ">
        <div className="text-left text-lg mt-8 ml-2 font-semibold text-gray-500">
          Your Saved Projects
        </div>
        <button
          className="mb-10 bg-green-600 text-xl font-bold text-white px-8 py-3 rounded shadow-lg hover:bg-green-700 focus:outline-none transition duration-300 transform hover:-translate-y-1"
          onClick={handleCreateProject}
        >
          Create Project <span className="ml-2">+</span>
        </button>
      </div>

      {/* Loading Indicator */}
      {loading && <p>Loading projects...</p>}

      {/* Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.projectId || project.projectName}
            className="bg-white p-6 rounded-xl shadow-lg transform hover:-translate-y-2 hover:shadow-2xl transition duration-300 cursor-pointer"
            onClick={() => handleCardClick(project)}
          >
            {/* ✅ Project Name Wrapping Fixed */}
            <h3
              className="text-lg font-semibold text-blue-700 mb-10"
              style={{
                wordWrap: "break-word", // Ensures long text wraps
                wordBreak: "break-word", // Adds compatibility
                maxWidth: "100%", // Ensures it fits within the card
              }}
            >
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

      {/* Popup Modal for Project Details */}
      {selectedProject && (
        <div
          className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white w-3/4 max-w-lg p-6 rounded shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-4">
              {selectedProject.projectName}
            </h2>
            <p className="mb-4 text-gray-700">
              <strong>Swagger URL:</strong> {selectedProject.swaggerUrl}
            </p>
            <p className="mb-4 text-gray-700">
              <strong>Swagger Version:</strong> {selectedProject.swaggerVersion}
            </p>
            <div className="flex justify-between">
              <button
                className="bg-green-400 text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={() =>
                  handleGenerateTestCases(selectedProject.projectName)
                }
              >
                Generate Test Cases
              </button>
              <button
                className="bg-red-300 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
