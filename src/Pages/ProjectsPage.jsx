// import { useState, useEffect } from "react";
// import PopupForm from "../components/PopupForm";
// import JsonFileProcessor from "../components/JsonFileProcessor";
// import {
//   getAllProjects,
//   createProject,
//   generateTestCases,
// } from "../Services/apiGenServices";

// const ProjectsPage = () => {
//   const [projects, setProjects] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [formData, setFormData] = useState({
//     projectName: "",
//     swaggerUrl: "",
//     swaggerVersion: "",
//   });
//   const [loading, setLoading] = useState(false);

//   // Fetch all projects on mount
//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         setLoading(true);
//         const data = await getAllProjects();
//         setProjects(data || []);
//       } catch (error) {
//         console.error("Error fetching projects:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProjects();
//   }, []);

//   const handleFormChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({ ...prevData, [name]: value }));
//   };

//   const handleCreateProject = () => {
//     setFormData({
//       projectName: "",
//       swaggerUrl: "",
//       swaggerVersion: "",
//     });
//     setShowForm(true);
//   };

//   const handleSaveProject = async (generateTestCasesFlag = false) => {
//     try {
//       if (!formData.projectName.trim()) {
//         alert("Project name cannot be empty.");
//         return;
//       }

//       const updatedProjects = await getAllProjects();
//       const projectExists = updatedProjects.some(
//         (project) =>
//           project.projectName.trim().toLowerCase() ===
//           formData.projectName.trim().toLowerCase()
//       );

//       if (projectExists) {
//         alert(
//           "A project with this name already exists. Please choose another name."
//         );
//         return;
//       }

//       const saveProjectDto = {
//         projectName: formData.projectName.trim(),
//         swaggerUrl: formData.swaggerUrl.trim(),
//         swaggerVersion: formData.swaggerVersion.trim(),
//       };

//       const newProject = await createProject(saveProjectDto);
//       setProjects([...projects, newProject]);
//       setShowForm(false);

//       if (generateTestCasesFlag) {
//         await generateTestCases(formData.projectName.trim());
//         alert(`Test cases generated successfully for project: ${formData.projectName}`);
//       }

//       setFormData({
//         projectName: "",
//         swaggerUrl: "",
//         swaggerVersion: "",
//       });

//       alert(`Project '${formData.projectName}' created successfully.`);
//     } catch (error) {
//       alert(`Error creating project: ${error.message}`);
//       console.error("Error creating project:", error);
//     }
//   };

//   const handleCardClick = (project) => {
//     setSelectedProject(project);
//   };

//   const closeModal = () => {
//     setSelectedProject(null);
//   };

//   const handleGenerateTestCases = async (projectName) => {
//     try {
//       await generateTestCases(projectName);
//       alert(`Test cases generated successfully for project: ${projectName}`);
//     } catch (error) {
//       alert(`Error generating test cases: ${error.message}`);
//     }
//   };

//   return (
//     <div className="p-8 min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 px-20 py-10">
//       <div className="flex justify-between items-center mb-10 mt-40">
//         <h1 className="text-2xl font-bold text-gray-700">Projects Dashboard</h1>
//         <button
//           className="ml-72 bg-green-600 text-xl font-bold text-white px-8 py-3 rounded shadow-lg hover:bg-green-700 focus:outline-none transition duration-300 transform hover:-translate-y-1"
//           onClick={handleCreateProject}
//         >
//           <span className="mr-2 ">+</span> Create Project
//         </button>
//       </div>

//       {showForm && (
//         <PopupForm
//           showForm={showForm}
//           setShowForm={setShowForm}
//           formData={formData}
//           handleFormChange={handleFormChange}
//           handleSaveProject={handleSaveProject}
//         />
//       )}

//       <div className="text-left mb-8 text-lg font-semibold text-gray-500">
//         Your Saved Projects
//       </div>

//       {loading && <p>Loading projects...</p>}

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {projects.map((project) => (
//           <div
//             key={project.projectId || project.projectName}
//             className="bg-white p-6 rounded-xl shadow-lg transform hover:-translate-y-2 hover:shadow-2xl transition duration-300 cursor-pointer"
//             onClick={() => handleCardClick(project)}
//           >
//             <h3 className="text-lg font-semibold text-blue-700 mb-1">
//               {project.projectName}
//             </h3>
//             <div className="flex items-center text-sm text-gray-600 mb-4">
//               <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
//                 Swagger {project.swaggerVersion}
//               </span>
//             </div>
//             <p className="text-gray-700 mb-2">
//               <strong>Swagger URL:</strong> {project.swaggerUrl}
//             </p>
//             <p className="text-gray-600 mt-2 flex items-center">
//               <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
//               Active Project
//             </p>  
//           </div>
//         ))}
//       </div>

//       {selectedProject && (
//         <div
//           className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
//           onClick={closeModal}
//         >
//           <div
//             className="bg-white w-3/4 max-w-lg p-6 rounded shadow-lg relative"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <h2 className="text-lg font-bold mb-4">
//               {selectedProject.projectName}
//             </h2>
//             <JsonFileProcessor projectId={selectedProject.projectId} />
//             <div className="flex justify-between">
//               <button
//                 className="bg-green-400 text-white px-4 py-2 rounded hover:bg-green-700"
//                 onClick={() =>
//                   handleGenerateTestCases(selectedProject.projectName)
//                 }
//               >
//                 Generate Test Cases
//               </button>
//               <button
//                 className="bg-red-300 text-white px-4 py-2 rounded hover:bg-red-700"
//                 onClick={closeModal}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProjectsPage;


import { useState, useEffect } from "react";
import PopupForm from "../components/PopupForm";
import {
  getAllProjects,
  generateTestCases,
  deleteProjectById,
} from "../Services/apiGenServices";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null); // For project details popup
  const [deleteProject, setDeleteProject] = useState(null); // For delete confirmation popup
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false); // State for button loading

  // const handleDelete = async () => {
  //   try {
  //     if (deleteProject) {
  //       const isDeleted = await deleteProjectById(deleteProject.projectId);
  //       if (isDeleted) {
  //         setProjects((prevProjects) =>
  //           prevProjects.filter((project) => project.projectId !== deleteProject.projectId)
  //         );
  //         setPopupVisible(false);
  //         setDeleteProject(null); // Reset after delete
  //         toast.success("Project deleted successfully!", {
  //           autoClose: 4000,
  //           theme: "light",
  //         });
  //       }
  //     }
  //   } catch (err) {
  //     console.error("Error deleting project:", err);
  //     toast.error(err.message || "Failed to delete the project.", {
  //       autoClose: 4000,
  //       theme: "light",
  //     });
  //   }
  // };
  const handleDelete = async () => {
    setDeleteLoading(true); // Start the loader
    try {
      if (deleteProject) {
        const isDeleted = await deleteProjectById(deleteProject.projectId);
        if (isDeleted) {
          setProjects((prevProjects) =>
            prevProjects.filter((project) => project.projectId !== deleteProject.projectId)
          );
          setPopupVisible(false);
          setDeleteProject(null); // Reset after delete
          toast.success("Project deleted successfully!", {
            autoClose: 4000,
            theme: "light",
          });
        }
      }
    } catch (err) {
      console.error("Error deleting project:", err);
      toast.error(err.message || "Failed to delete the project.", {
        autoClose: 4000,
        theme: "light",
      });
    } finally {
      setDeleteLoading(false); // Stop the loader
    }
  };

  const openDeletePopup = (project) => {
    setDeleteProject(project);
    setPopupVisible(true);
  };

  const closeDeletePopup = () => {
    setDeleteProject(null);
    setPopupVisible(false);
  };

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

  const handleCreateProject = () => {
    setShowForm(true);
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
      <div className="flex justify-between items-center mb-10 mt-40">
        <h1 className="text-2xl font-bold text-gray-700">Projects Dashboard</h1>
        <button
          className="ml-72 bg-green-600 text-xl font-bold text-white px-8 py-3 rounded shadow-lg hover:bg-green-700 focus:outline-none transition duration-300 transform hover:-translate-y-1"
          onClick={handleCreateProject}
        >
          <span className="mr-2 ">+</span> Create Project
        </button>
      </div>

      {showForm && (
        <PopupForm
          showForm={showForm}
          setShowForm={setShowForm}
        />
      )}

      <div className="text-left mb-8 text-lg font-semibold text-gray-500">
        Your Saved Projects
      </div>

      {loading && <p>Loading projects...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.projectId || project.projectName}
            className="bg-white p-6 rounded-xl shadow-lg transform hover:-translate-y-2 hover:shadow-2xl transition duration-300 cursor-pointer"
            onClick={() => handleCardClick(project)}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-blue-700 mb-1">
                {project.projectName}
              </h3>
              <button
                className="text-red-400 hover:text-red-700"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering card click
                  openDeletePopup(project);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="w-6 h-6"
                >
                  <path d="M9 3h6a1 1 0 0 1 1 1v1h4a1 1 0 1 1 0 2h-1v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7H4a1 1 0 1 1 0-2h4V4a1 1 0 0 1 1-1Zm1 2v1h4V5h-4ZM7 7v12h10V7H7Zm2 3h2v7H9v-7Zm4 0h2v7h-2v-7Z" />
                </svg>
              </button>
            </div>
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

      {selectedProject && (
        <div
          className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-0"
          onClick={closeModal}
        >
          <div
            className="bg-white w-3/4 max-w-lg p-6 rounded shadow-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-4">
              {selectedProject.projectName}
            </h2>
            <div className="flex items-center text-sm text-gray-600 mb-4">
              <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                Swagger {selectedProject.swaggerVersion}
              </span>
            </div>
            <p className="text-gray-700 mb-2">
              <strong>Swagger URL:</strong> {selectedProject.swaggerUrl}
            </p>
            <div className="flex justify-between">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={() =>
                  handleGenerateTestCases(selectedProject.projectName)
                }
              >
                Generate Test Cases
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Delete
            </h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete the project{" "}
              <strong>{deleteProject?.projectName}</strong>?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                onClick={closeDeletePopup}
              >
                Cancel
              </button>
              <button
  className={`px-4 py-2 rounded text-white flex items-center justify-center ${
    deleteLoading
      ? 'bg-gray-500 cursor-not-allowed'
      : 'bg-red-500 hover:bg-red-600'
  }`}
  onClick={handleDelete}
  disabled={deleteLoading}
>
  {/* {deleteLoading ? (
    <div className="w-5 h-5 border-2 border-t-2 border-gray-200 rounded-full animate-spin"></div>
  ) : (
    'Delete'
  )} */}
   {deleteLoading ? "Deleting..." : "Confirm"}
</button>





            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
