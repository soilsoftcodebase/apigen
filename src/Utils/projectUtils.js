// // src/utils/projectUtils.js

// const PROJECTS_STORAGE_KEY = "cachedProjectIds";

// // Your existing API function to fetch projects
// import { getAllProjects } from "../api/apiGenServices"; 

// export const getCachedProjects = async () => {
//   // Check if project IDs are in local storage
//   const cachedProjects = localStorage.getItem(PROJECTS_STORAGE_KEY);
//   if (cachedProjects) {
//     return JSON.parse(cachedProjects); // Parse and return stored project IDs
//   }

//   // Fetch projects from API
//   try {
//     const projects = await getAllProjects();
//     const projectIds = projects.map(project => project.id); // Extract IDs from projects

//     // Store project IDs in local storage
//     localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projectIds));

//     return projectIds;
//   } catch (error) {
//     console.error("Error fetching or caching projects:", error);
//     throw error; // Rethrow the error for further handling
//   }
// };
