/* eslint-disable react/prop-types */
import React, { useState, useEffect, useCallback } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getTestCases,
  getAllProjects,
  RunallTestCases,
  getTestsByProjectName,
  RunSelectedTestCase,
} from "../Services/apiGenServices";
import AddTestCaseForm from "./AddTestCaseForm";

const TestCasesTable = () => {
  const [testCases, setTestCases] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]); // Track selected rows
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPayload, setSelectedPayload] = useState(null);
  const [runningTests, setRunningTests] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // Manage loader popup
  const navigate = useNavigate(); // Navigate to different routes
  const [showFormPopup, setShowFormPopup] = useState(false);

  // Fetch all projects on component mount
  useEffect(() => {
    const fetchAllProjects = async () => {
      try {
        setLoading(true);
        const projects = await getAllProjects();
        setProjects(projects || []);
      } catch (error) {
        console.log("Failed to load projects. Please try again later.", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProjects();
  }, []);

  const handleSelectRow = (testCaseId) => {
    setSelectedRows(
      (prev) =>
        prev.includes(testCaseId)
          ? prev.filter((id) => id !== testCaseId) // Deselect if already selected
          : [...prev, testCaseId] // Add to selected rows if not selected
    );
  };

  const handleSelectAllRows = (isChecked) => {
    if (isChecked) {
      const allIds = testCases.map((testCase) => testCase.testCaseId);
      setSelectedRows(allIds);
    } else {
      setSelectedRows([]);
    }
  };
  const handleRunTestCases = () => {
    if (selectedRows.length === 0) {
      runAllTestCases();
    } else {
      runSelectedTestCases();
    }
  };

  const fetchTestCases = useCallback(async () => {
    if (!selectedProject) return;
    setTestCases([]);
    setLoading(true);
    try {
      const data = await getTestCases(selectedProject, currentPage);
      setTestCases(data.testCases || []);
      // Extract inputRequestUrl
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.log("Failed to load test cases. Please try again later.", error);
    } finally {
      setLoading(false);
    }
  }, [selectedProject, currentPage]);

  const getProjectStatus = useCallback(async () => {
    if (!selectedProject) return;

    try {
      const data = await getTestsByProjectName(selectedProject);

      // Set loading based on the isProcessing state
      setLoading(data.isProcessing);

      if (!data.isProcessing) {
        // Fetch test cases only if not processing
        await fetchTestCases();
      } else {
        setIsProcessing(data.isProcessing);
        setTimeout(getProjectStatus, 120000);
      }
    } catch (error) {
      console.log(
        "Failed to load project status. Please try again later.",
        error
      );
      setLoading(false);
    }
  }, [selectedProject, fetchTestCases]);

  useEffect(() => {
    getProjectStatus();
  }, [getProjectStatus]);

  // Handle project change in dropdown
  const handleProjectChange = (e) => {
    setSelectedProject(e.target.value);
    setCurrentPage(1);
    setTestCases([]);
  };

  // Download all test cases as an Excel file
  const downloadAllTestCases = async () => {
    if (!selectedProject) {
      // alert("Please select a project first.");
      toast.success("Please select a project first.", {
        // position: toast.POSITION.TOP_RIGHT,
        autoClose: 4000,
        theme: "light",
      });
      return;
    }

    try {
      let allTestCases = [];
      let currentPage = 1;
      let totalPages = 1;

      do {
        const data = await getTestCases(selectedProject, currentPage);
        allTestCases = allTestCases.concat(data.testCases || []);
        totalPages = data.totalPages || 1;
        currentPage++;
      } while (currentPage <= totalPages);

      if (allTestCases.length === 0) {
        alert("No test cases found for the selected project.");
        toast.warn("No test cases found for the selected project.", {
          // position: toast.POSITION.TOP_RIGHT,
          autoClose: 4000,
          theme: "light",
        });
        return;
      }

      const worksheet = XLSX.utils.json_to_sheet(allTestCases);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "TestCases");
      XLSX.writeFile(workbook, `TestCases_${selectedProject}.xlsx`);

      // alert("All test cases downloaded successfully.");
      toast.success("All test cases downloaded successfully.", {
        // position: toast.POSITION.TOP_RIGHT,
        autoClose: 4000,
        theme: "light",
      });
    } catch (error) {
      console.error("Error downloading all test cases:", error);
      alert("An error occurred while downloading the test cases.");
      toast.error("An error occurred while downloading the test cases.", {
        // position: toast.POSITION.TOP_RIGHT,
        autoClose: 4000,
        theme: "light",
      });
    }
  };

  // Run all test cases
  const runAllTestCases = async () => {
    if (!selectedProject) {
      // alert("Please select a project first.");
      toast.warn("Please select a project first!", {
        // position: toast.POSITION.TOP_RIGHT,
        autoClose: 4000,
        theme: "light",
      });
      return;
    }

    try {
      setRunningTests(true);
      setShowPopup(true);

      let allTestCases = [];
      let currentPage = 1;
      let totalPages = 1;

      do {
        const data = await getTestCases(selectedProject, currentPage);
        allTestCases = allTestCases.concat(data.testCases || []);
        totalPages = data.totalPages || 1;
        currentPage++;
      } while (currentPage <= totalPages);

      if (allTestCases.length === 0) {
        // alert("No test cases found for the selected project.");
        toast.error("No test cases found for the selected project.!", {
          // position: toast.POSITION.TOP_RIGHT,
          autoClose: 4000,
          theme: "light",
        });
        setShowPopup(false);
        return;
      }

      const testCaseIds = allTestCases.map((testCase) => testCase.testCaseId);

      const response = await RunallTestCases(selectedProject, testCaseIds);

      // alert(
      //   `All test cases execution started successfully. Response: ${JSON.stringify(response)}`
      // );
      toast.success(
        `All test cases execution started successfully. Response: ${JSON.stringify(
          response
        )}`,
        {
          // position: toast.POSITION.TOP_RIGHT,
          autoClose: 4000,
          theme: "light",
        }
      );
      navigate("/runs");
    } catch (error) {
      // alert(`Failed to execute all test cases. Error: ${error.message}`);
      toast.error(`Failed to execute all test cases. Error: ${error.message}`, {
        // position: toast.POSITION.TOP_RIGHT,
        autoClose: 4000,
        theme: "light",
      });
    } finally {
      setRunningTests(false);
      setShowPopup(false);
    }
  };

  const runSelectedTestCases = async () => {
    if (!selectedProject || selectedRows.length === 0) {
      toast.error("Please select at least one test case!", {
        // position: toast.POSITION.TOP_RIGHT,
        autoClose: 4000,
        theme: "light",
      });
      // alert("Please select at least one test case.");
      return;
    }

    try {
      setRunningTests(true);
      await RunSelectedTestCase(selectedProject, selectedRows);
      // alert("Selected test cases execution started.");
      toast.success("Selected test cases execution started.!", {
        // position: toast.POSITION.TOP_RIGHT,
        autoClose: 4000,
        theme: "light",
      });
      navigate("/runs"); // Navigate to the test runs page
    } catch (error) {
      // alert(`Error running selected test cases: ${error.message}`);
      toast.error(`Error running selected test cases: ${error.message}`, {
        // position: toast.POSITION.TOP_RIGHT,
        autoClose: 4000,
        theme: "light",
      });
    } finally {
      setRunningTests(false);
    }
  };

  const columns = React.useMemo(
    () => [
      {
        Header: (
          <input
            type="checkbox"
            onChange={(e) => handleSelectAllRows(e.target.checked)}
            checked={
              selectedRows.length === testCases.length && testCases.length > 0
            }
          />
        ),
        accessor: "select",
        Cell: ({ row }) => (
          <input
            type="checkbox"
            checked={selectedRows.includes(row.original.testCaseId)}
            onChange={() => handleSelectRow(row.original.testCaseId)}
          />
        ),
        disableSortBy: true,
      },
      { Header: "Test ID", accessor: "testCaseId" },
      {
        Header: "TestCase Name",
        accessor: "testCaseName",
        Cell: ({ value }) => (
          <div style={{ textAlign: "left", marginLeft: 10 }}>{value}</div>
        ),
      },
      {
        Header: (
          <p>
            Input <br />
            Request URL
          </p>
        ),
        accessor: "inputRequestUrl",
        Cell: ({ value }) => (
          <button
            onClick={() => setSelectedPayload(value)}
            className="text-blue-600 underline hover:text-blue-800"
          >
            View URL
          </button>
        ),
      },
      {
        Header: "Payload",
        accessor: "payload",
        Cell: ({ value }) => (
          <button
            onClick={() => setSelectedPayload(value)}
            className="text-blue-600 underline hover:text-blue-800"
          >
            View Payload
          </button>
        ),
      },
      {
        Header: (
          <p>
            Expected <br />
            Response Code
          </p>
        ),
        accessor: "expectedResponseCode",
      },
      {
        Header: "Steps",
        accessor: "steps",
        Cell: ({ value }) => (
          <button
            onClick={() => setSelectedPayload(value)}
            className="text-blue-600 underline hover:text-blue-800"
          >
            View Steps
          </button>
        ),
      },
      {
        Header: "Type",
        accessor: "testType",
        Cell: ({ value }) => (
          <div style={{ textAlign: "left" }}>
            {value ? value.charAt(0).toUpperCase() + value.slice(1) : ""}
          </div>
        ),
      },
    ],
    [selectedRows, testCases]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data: testCases }, useSortBy, usePagination);

  return (
    <div className="container mx-auto p-6 max-w-full">
      <h1 className="text-3xl font-bold mb-6 text-start px-2 text-sky-800 animate-fade-in ">
        Generated Test Cases
      </h1>
      <div className="w-full h-px bg-gray-300 my-6" />
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <select
          id="project-select"
          name="project"
          value={selectedProject || ""}
          onChange={handleProjectChange}
          className="p-2 border rounded w-full sm:w-auto focus:ring-2 focus:ring-blue-500 font-semibold"
        >
          <option value="" disabled>
            {projects.length > 0 ? "Choose a project" : "No projects available"}
          </option>
          {projects.map((project, index) => (
            <option key={project.id || index} value={project.id}>
              {project.projectName}
            </option>
          ))}
        </select>

        {selectedProject && (
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <button
              className="bg-green-500 font-bold text-white rounded py-2 px-4 hover:bg-green-700"
              onClick={() => setShowFormPopup(true)}
              disabled={!selectedProject}
            >
              Add New Test Case
            </button>
            <button
              className="bg-teal-600 text-white font-bold py-2 px-4 rounded hover:bg-teal-700"
              onClick={handleRunTestCases}
              disabled={runningTests || !selectedProject}
            >
              {runningTests
                ? "Running..."
                : selectedRows.length === 0
                ? "Run All Test Cases"
                : `Run (${selectedRows.length}) Test Cases`}
            </button>
            <button
              className="bg-red-400 text-white font-bold py-2 px-4 rounded hover:bg-red-700"
              onClick={downloadAllTestCases}
              disabled={!selectedProject}
            >
              Download All
            </button>
          </div>
        )}
      </div>

      {/* Loader Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-black bg-opacity-50 overflow-none">
          <div className="bg-white p-10 rounded-lg shadow-2xl transform scale-95 hover:scale-100 transition-transform duration-300 ease-out w-96 h-96 flex flex-col items-center justify-center">
            {/* Enhanced Loader Animation */}
            <div className="w-16 h-16 rounded-full border-t-4 border-b-4 border-transparent border-t-blue-500 border-b-green-500 animate-spin mb-6"></div>

            {/* Creative Text */}
            <p className="text-2xl font-extrabold text-gray-700 text-center leading-relaxed">
              🚀 Hold tight! <br />
              Your test cases are running at warp speed!
            </p>
          </div>
        </div>
      )}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="space-y-8 mt-24">
            <div
              className={`loader border-t-4 border-b-4 mx-auto ${
                isProcessing ? "border-green-500" : " border-blue-500"
              } w-12 h-12 rounded-full animate-spin`}
            ></div>
            <div
              className={`ml-4 ${
                isProcessing ? "text-green-600" : " text-blue-700"
              }`}
            >
              {`${
                isProcessing
                  ? "Sit & Relax!! -- Your testcases are generating"
                  : " Loading test cases.."
              }`}
            </div>
          </div>
        </div>
      )}

      {testCases.length > 0 && (
        <div className="overflow-x-auto">
          <table
            {...getTableProps()}
            className="table-auto w-full rounded-t-lg border-collapse border border-gray-400 shadow-md rounded-lg overflow-auto hide-scrollbar"
          >
            <thead className="bg-gradient-to-r from-cyan-950 to-sky-900 text-white rounded-t-lg">
              {headerGroups.map((headerGroup, index) => (
                <tr
                  {...headerGroup.getHeaderGroupProps()}
                  key={headerGroup.id || `headerGroup-${index}`} // Explicit key
                >
                  {headerGroup.headers.map((column, colIndex) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className="p-2 border border-gray-400 font-bold text-center"
                      key={column.id || `column-${colIndex}`} // Explicit key
                    >
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody
              {...getTableBodyProps()}
              className="odd:bg-gray-100 even:bg-gray-200bg-white"
            >
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    key={row.getRowProps().key} // Explicitly set the key for the row
                    className="hover:bg-gray-200"
                  >
                    {row.cells.map((cell) => {
                      const cellProps = cell.getCellProps();
                      const { key, ...rest } = cellProps; // Extract `key` from cellProps

                      return (
                        <td
                          {...rest} // Spread the remaining props except key
                          key={key} // Explicitly set the key for the cell
                          className="p-2 font-medium border border-gray-300 text-center"
                        >
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {testCases.length > 0 && (
        <div className="flex justify-center items-center mt-4">
          <div className="flex items-center space-x-2">
            <button
              className="p-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              First
            </button>
            <button
              className="p-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="px-4 text-gray-700 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="p-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
            <button
              className="p-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last
            </button>
          </div>
        </div>
      )}
      {/* Payload Modal */}
      {selectedPayload && (
        <div
          className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 overflow-auto hide-scrollbar"
          onClick={() => setSelectedPayload(null)}
        >
          <div className="bg-white p-6 rounded shadow-lg w-1/2 max-h-[90vh] overflow-auto">
            <h3 className="text-lg font-bold mb-4">Details</h3>
            <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">
              {selectedPayload}
            </pre>
            <div className="flex justify-between items-center mt-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
                onClick={() => {
                  navigator.clipboard.writeText(selectedPayload);
                  toast.success("Copied to clipboard!", {
                    // position: toast.POSITION.TOP_RIGHT,
                    autoClose: 4000,
                    theme: "light",
                  });
                  // alert("Copied to clipboard!");
                }}
              >
                Copy
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={() => setSelectedPayload(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* PopupForm */}
      {showFormPopup && (
        <AddTestCaseForm
          selectedProject={selectedProject}
          onClose={() => setShowFormPopup(false)}
          onTestCaseAdded={fetchTestCases}
        />
      )}
    </div>
  );
};

export default TestCasesTable;
