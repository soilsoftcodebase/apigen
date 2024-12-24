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
import JsonFileProcessor from "../components/JsonFileProcessor";
import {
  getAllProjects,
  generateTestCases,
} from "../Services/apiGenServices";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
 
  const [loading, setLoading] = useState(false);

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
            <JsonFileProcessor projectId={selectedProject.projectId} />
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
