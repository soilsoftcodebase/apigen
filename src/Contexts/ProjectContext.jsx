// // src/context/ProjectContext.js

// import { createContext, useState, useEffect, useContext } from "react";
// import { getCachedProjects } from "../Utils/projectUtils";
// // import PropTypes from "prop-types";


// const ProjectContext = createContext();

// export const ProjectProvider = ({ children }) => {
//   const [projectIds, setProjectIds] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchAndCacheProjects = async () => {
//       try {
//         const ids = await getCachedProjects();
//         setProjectIds(ids);
//       } catch (error) {
//         console.error("Failed to fetch and cache projects:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAndCacheProjects();
//   }, []);

//   return (
//     <ProjectContext.Provider value={{ projectIds, loading }}>
//       {children}
//     </ProjectContext.Provider>
//   );
// };

// export const useProjects = () => useContext(ProjectContext);

