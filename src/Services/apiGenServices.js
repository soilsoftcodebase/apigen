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
// export async function saveAndGenerateTestCases(saveProjectDto) {
//   try {
//     console.log("Payload:", saveProjectDto);
//     const res = await fetch(
//       `${API_URL}/ApiGen/Projects/saveandgeneratetestcases`,
//       {
//         method: "POST",
//         body: JSON.stringify(saveProjectDto),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const contentType = res.headers.get("Content-Type");

//     // Check if the response is JSON
//     if (contentType && contentType.includes("application/json")) {
//       const data = await res.json();

//       if (data.IsProcessing) {
//         console.warn("Test cases are still being processed:", data.Message);
//         return data; // Return the processing response to the caller
//       }

//       if (res.ok) {
//         return data; // Return success response
//       } else {
//         throw new Error(
//           data.Message || "Failed to save and generate test cases"
//         );
//       }
//     } else {
//       // Handle non-JSON responses
//       const text = await res.json();
//       console.warn("Unexpected response format:", text);
//       throw new Error(`Unexpected response from server: ${text}`);
//     }
//   } catch (err) {
//     console.error("Error creating project:", err);
//     throw new Error("Error creating project or generating test cases");
//   }
// }

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

    // Check for JSON responses
    if (contentType && contentType.includes("application/json")) {
      const data = await res.json();

      if (data.IsProcessing) {
        console.warn("Test cases are still being processed:", data.Message);
        return data; // Return the processing response to the caller
      }

      if (res.ok) {
        console.log("Successful response:", data);
        return data; // Return the success response
      } else {
        console.error("Error response from server:", data);
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
    if (err.name === "TypeError") {
      console.error("Network error:", err.message);
      throw new Error("Network error. Please check your connection.");
    }

    console.error("Server or validation error:", err.message);
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

export async function getTestsByProjectName(projectName) {
  try {
    const res = await fetch(
      `${API_URL}/ApiGen/Projects/${projectName}/getteststatus
`,
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

// Function to Execute the testcases for a project
// export async function RunallTestCases(projectName) {
//   try {
//     const res = await fetch(
//       `${API_URL}/TestCases/runalltestcases/${projectName}`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     if (!res.ok) {
//       let errorData = {};
//       try {
//         errorData = await res.json();
//       } catch {
//         console.error("Failed to parse error response.");
//       }
//       throw new Error(
//         `Failed to execute test cases for project ID ${projectName}. Error: ${
//           errorData.message || res.statusText || "Unknown error"
//         }`
//       );
//     }

//     const data = await res.json();
//     return data;
//   } catch (err) {
//     console.error("Error executing test cases:", err);
//     throw new Error(
//       `Error executing test cases for project ID ${projectName}: ${err.message}`
//     );
//   }
// }

export async function RunallTestCases(projectName) {
  const endpoint = `${API_URL}/TestCases/runalltestcases/${projectName}`;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  try {
    // Log the request details for debugging
    console.log("Requesting RunallTestCases:", endpoint, options);

    const res = await fetch(endpoint, options);

    // Check if the response is successful
    if (!res.ok) {
      // Try to parse error details if response has a JSON body
      let errorData = {};
      try {
        errorData = await res.json();
      } catch {
        console.error("Failed to parse error response as JSON.");
      }

      throw new Error(
        `Failed to execute test cases for project '${projectName}'. ` +
          `Error: ${errorData.message || res.statusText || "Unknown error"}`
      );
    }

    // Attempt to parse the response as JSON
    const contentType = res.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      const data = await res.json();
      console.log("Test cases executed successfully:", data);
      return data;
    } else {
      const text = await res.text();
      console.warn("Received non-JSON response:", text);
      throw new Error("Unexpected response format from the server.");
    }
  } catch (err) {
    // Log and rethrow the error with additional context
    console.error("Error executing test cases:", err);
    throw new Error(
      `Error executing test cases for project '${projectName}': ${err.message}`
    );
  }
}

// Fetch a specific test run by project ID
// export async function getTestRunByProjectName(projectName) {
//   try {
//     const res = await fetch(`${API_URL}/${projectName}/TestCases/gettestrun`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     if (!res.ok) {
//       const errorResponse = await res.json();
//       console.error("Error fetching test run by project ID:", errorResponse);
//       throw new Error(errorResponse.message || "Failed to fetch test run");
//     }

//     const data = await res.json();
//     console.log("Test run data fetched successfully:", data);
//     return data;
//   } catch (error) {
//     console.error("Error in getTestRunByProjectId:", error.message);
//     throw error;
//   }
// }

export async function getTestRunByProjectName(projectName) {
  try {
    const res = await fetch(`${API_URL}/TestCases/${projectName}/gettestruns`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorResponse = await res.text(); // Fallback to plain text if JSON parsing fails
      console.error("Error fetching test run by project name:", errorResponse);
      throw new Error(errorResponse || "Failed to fetch test run");
    }

    const contentType = res.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      const data = await res.json();
      console.log("Test run data fetched successfully:", data);
      return data;
    } else {
      const textData = await res.text();
      console.error("Unexpected response format:", textData);
      throw new Error("Server returned unexpected response format");
    }
  } catch (error) {
    console.error("Error in getTestRunByProjectName:", error.message);
    throw error;
  }
}

// Fetch all test runs
export async function getAllTestRuns() {
  try {
    const res = await fetch(`${API_URL}/TestCases/getalltestruns`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorResponse = await res.json();
      console.error("Error fetching all test runs:", errorResponse);
      throw new Error(errorResponse.message || "Failed to fetch all test runs");
    }

    const contentType = res.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      const data = await res.json();
      console.log("All test runs fetched successfully:", data);
      return data;
    } else {
      const textData = await res.text();
      console.error("Unexpected response format:", textData);
      throw new Error("Server returned unexpected response format");
    }
  } catch (error) {
    console.error("Error in getAllTestRuns:", error.message);
    throw error;
  }
}
