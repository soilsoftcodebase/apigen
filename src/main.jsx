import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
// import { ProjectProvider, useProjects } from "./Contexts/ProjectContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <ProjectProvider> */}
      <App />
    {/* </ProjectProvider> */}
  </StrictMode>
);
