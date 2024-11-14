const API_URL = "https://localhost:7293/api";

// Function to create a new project
export async function createProject(saveProjectDto) {
  try {
    console.log("Payload:", saveProjectDto);
    const res = await fetch(`${API_URL}/ApiGen/Projects/createProject`, {
      method: "POST",
      body: JSON.stringify(saveProjectDto),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Error response from server:", errorData);
      console.error("Validation errors:", errorData.errors);
      throw Error(errorData.title || "Failed to create project");
    }

    const { data } = await res.json();
    return data;
  } catch (err) {
    console.error("Error creating project:", err);
    throw Error("Error creating project");
  }
}

// Function to get details of a specific project
export async function getProject(projectName) {
  try {
    const res = await fetch(`${API_URL}/ApiGen/Projects/${projectName}`);
    if (!res.ok) throw Error(`Couldn't find project: ${projectName}`);

    const data = await res.json();
    return data;
  } catch (err) {
    throw Error("Error retrieving project details", err);
  }
}

// Function to get details of a specific getAllPprojects
export async function getAllProjects() {
  try {
    const res = await fetch(`${API_URL}/ApiGen/Projects/allProjects`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Use 'include' if you need to send cookies or auth headers
    });
    if (!res.ok) throw new Error("Failed to retrieve projects");

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error retrieving all projects:", err);
    return [];
  }
}

// // Function to create saveAndGenerateTestCases
export async function saveAndGenerateTestCases(saveProjectDto) {
  try {
    console.log("Payload:", saveProjectDto);
    const res = await fetch(
      `${API_URL}/ApiGen/Projects/saveandgeneratetestcases`,
      {
        method: "POST",
        body: JSON.stringify(saveProjectDto),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const contentType = res.headers.get("Content-Type");

    // Check if the response is JSON
    if (contentType && contentType.includes("application/json")) {
      const data = await res.json();

      if (data.IsProcessing) {
        console.warn("Test cases are still being processed:", data.Message);
        return data; // Return the processing response to the caller
      }

      if (res.ok) {
        return data; // Return success response
      } else {
        throw new Error(
          data.Message || "Failed to save and generate test cases"
        );
      }
    } else {
      // Handle non-JSON responses
      const text = await res.text();
      console.warn("Unexpected response format:", text);
      throw new Error(`Unexpected response from server: ${text}`);
    }
  } catch (err) {
    console.error("Error creating project:", err);
    throw new Error("Error creating project or generating test cases");
  }
}

// Function to generate test cases for a specific project
export async function generateTestCases(projectName) {
  try {
    const res = await fetch(
      `${API_URL}/ApiGen/Projects/${projectName}/genereatetescases`,
      {
        method: "POST",
      }
    );
    if (!res.ok)
      throw Error(`Failed to generate test cases for project: ${projectName}`);
  } catch (err) {
    throw Error("Error generating test cases", err);
  }
}

// Function to get test cases for a specific project
export async function getTestCases(projectName, pageNumber) {
  try {
    const res = await fetch(
      `${API_URL}/ApiGen/Projects/${projectName}/testcases?pageNumber=${pageNumber}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // Use 'include' if you need to send cookies or auth headers
      }
    );
    console.log(res.json);
    if (!res.ok)
      throw Error(`Couldn't retrieve test cases for project: ${projectName}`);

    const data = await res.json();
    return data;
  } catch (err) {
    throw Error("Error retrieving test cases", err);
  }
}

// Function to get test data for a specific project
export async function getTestData(projectName) {
  try {
    const res = await fetch(
      `${API_URL}/ApiGen/Projects/${projectName}/testdata`
    );
    if (!res.ok)
      throw Error(`Couldn't retrieve test data for project: ${projectName}`);

    const data = await res.json();
    return data;
  } catch (err) {
    throw Error("Error retrieving test data", err);
  }
}

// Function to update test data for a specific project
export async function updateTestData(projectName, updateData) {
  try {
    const res = await fetch(
      `${API_URL}/ApiGen/Projects/${projectName}/testdata=update`,
      {
        method: "PUT",
        body: JSON.stringify(updateData),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!res.ok)
      throw Error(`Failed to update test data for project: ${projectName}`);
  } catch (err) {
    throw Error("Error updating test data", err);
  }
}

// Function to fetchSwaggerInfo processing for a project
export async function fetchSwaggerInfo(baseUrl, version) {
  // Define possible paths based on the given base URL and version
  const pathsToTry = [
    `${baseUrl.replace("/index.html", "")}/${version}/swagger.json`, // Path with version, e.g., /v2/swagger.json
    `${baseUrl}/swagger/${version}/swagger.json`, // Nested version path, e.g., /swagger/v2/swagger.json
  ];

  // Try each path until a successful fetch
  for (let path of pathsToTry) {
    try {
      const response = await fetch(path);
      if (
        response.ok &&
        response.headers.get("content-type")?.includes("application/json")
      ) {
        const data = await response.json();

        // Extract necessary information
        const basePath = data.basePath || null;
        const title = data.info?.title || "Untitled Project";
        const fetchedVersion =
          data.info?.version || version || "Unknown Version";

        return {
          basePath,
          title,
          version: fetchedVersion,
        };
      }
    } catch (error) {
      console.warn(`Attempt to fetch ${path} failed`, error);
    }
  }

  // If all paths fail, return default error object
  console.error(
    "Failed to retrieve Swagger information from all attempted paths."
  );
  return {
    basePath: null,
    title: null,
    version: null,
  };
}
