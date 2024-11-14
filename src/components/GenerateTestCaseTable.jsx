import React, { useState, useEffect, useCallback } from "react";
import { useTable, useSortBy, usePagination, useRowSelect } from "react-table";
import * as XLSX from "xlsx";
import { getTestCases, getAllProjects } from "../Services/apiGenServices";

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      if (resolvedRef.current) {
        resolvedRef.current.indeterminate = indeterminate;
      }
    }, [resolvedRef, indeterminate]);

    return (
      <input
        type="checkbox"
        ref={resolvedRef}
        {...rest}
        className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
      />
    );
  }
);

const TestCasesTable = () => {
  const [testCases, setTestCases] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPayload, setSelectedPayload] = useState(null);

  useEffect(() => {
    const fetchAllProjects = async () => {
      try {
        setLoading(true);
        const projects = await getAllProjects();
        setProjects(projects || []);
      } catch (error) {
        setError("Failed to load projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllProjects();
  }, []);

  const fetchTestCases = useCallback(async () => {
    if (!selectedProject) return;

    setLoading(true);
    try {
      const data = await getTestCases(selectedProject, currentPage);

      if (data.isProcessing) {
        // Show a message or spinner indicating test cases are being generated
        setError(
          `Test cases for project "${selectedProject}" are still being processed. Retrying in 2 Minutes...`
        );

        // Retry fetching test cases after a delay
        setTimeout(fetchTestCases, 120000);
      } else {
        setTestCases(data.testCases || []);
        setTotalPages(data.totalPages || 1);
        setError(null); // Clear any existing error
      }
    } catch (error) {
      setError("Failed to load test cases. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [selectedProject, currentPage]);

  useEffect(() => {
    fetchTestCases();
  }, [fetchTestCases]);

  const handleProjectChange = (e) => {
    setSelectedProject(e.target.value);
    setCurrentPage(1);
    setTestCases([]);
  };

  const downloadAllTestCases = async () => {
    if (!selectedProject) {
      alert("Please select a project first.");
      return;
    }

    try {
      let allTestCases = [];
      let currentPage = 1;
      let totalPages = 1;

      // Fetch all test cases from all pages
      do {
        const data = await getTestCases(selectedProject, currentPage);
        allTestCases = allTestCases.concat(data.testCases || []);
        totalPages = data.totalPages || 1;
        currentPage++;
      } while (currentPage <= totalPages);

      if (allTestCases.length === 0) {
        alert("No test cases found for the selected project.");
        return;
      }

      // Generate Excel file from all test cases
      const worksheet = XLSX.utils.json_to_sheet(allTestCases);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "TestCases");
      XLSX.writeFile(workbook, `TestCases_${selectedProject}.xlsx`);

      alert("All test cases downloaded successfully.");
    } catch (error) {
      console.error("Error downloading all test cases:", error);
      alert("An error occurred while downloading the test cases.");
    }
  };

  const runSelectedTestCases = () => {
    const selectedTestCases = rows
      .filter((row) => row.isSelected)
      .map((row) => row.original.testCaseId);

    if (selectedTestCases.length === 0) {
      alert("Please select at least one test case to run.");
      return;
    }

    alert(`Running Test Cases: ${selectedTestCases.join(", ")}`);
  };

  const runSingleTestCase = (testCaseId) => {
    alert(`Running Test Case: ${testCaseId}`);
  };

  const columns = React.useMemo(
    () => [
      { Header: "Test ID", accessor: "testCaseId" },
      { Header: "TestCase Name", accessor: "testCaseName" },
      {
        Header: "Input Request URL",
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
      { Header: "Expected Response", accessor: "expectedResponseCode" },
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
        Cell: ({ value }) =>
          value ? value.charAt(0).toUpperCase() + value.slice(1) : "",
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={() => runSingleTestCase(row.original.testCaseId)}
          >
            Run
          </button>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { selectedRowIds },
  } = useTable(
    { columns, data: testCases },
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "selection",
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
          ),
          Cell: ({ row }) => (
            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
          ),
        },
        ...columns,
      ]);
    }
  );

  const selectedCount = Object.keys(selectedRowIds).length;

  return (
    <div className="container mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <select
          value={selectedProject || ""}
          onChange={handleProjectChange}
          className="p-2 border rounded w-full sm:w-auto focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>
            {projects.length > 0 ? "Choose a project" : "No projects available"}
          </option>
          {projects.map((project) => (
            <option key={project.id} value={project.projectName}>
              {project.projectName}
            </option>
          ))}
        </select>

        <div className="flex space-x-4 mt-4 sm:mt-0">
          <button
            className={`bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 ${
              selectedCount === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={selectedCount === 0}
            onClick={runSelectedTestCases}
          >
            Run Selected ({selectedCount})
          </button>
          <button
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
            onClick={downloadAllTestCases}
          >
            Download All
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4">
          <span>{error}</span>
          <button
            className="absolute top-0 right-0 px-4 py-3"
            onClick={() => setError(null)}
          >
            ×
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="loader border-t-4 border-b-4 border-blue-500 w-12 h-12 rounded-full animate-spin"></div>
          <span className="ml-4 text-blue-700">
            {error || "Loading test cases..."}
          </span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table
            {...getTableProps()}
            className="table-auto w-full border-collapse border border-gray-400 shadow-md rounded-lg"
          >
            <thead className="bg-black">
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className="p-2 border border-gray-400 font-bold text-white text-center"
                    >
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()} className="bg-white">
              {rows.map((row, rowIndex) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    className={`${row.isSelected ? "bg-blue-100" : ""} ${
                      rowIndex % 2 === 0 ? "bg-gray-100" : "bg-white"
                    }`}
                  >
                    {row.cells.map((cell) => (
                      <td
                        {...cell.getCellProps()}
                        className="p-2 font-medium border border-gray-300 text-center"
                      >
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex justify-center items-center mt-4">
        <div className="flex items-center space-x-2">
          {/* First Page Button */}
          <button
            className="p-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            First
          </button>

          {/* Previous Page Button */}
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

          {/* Next Page Button */}
          <button
            className="p-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>

          {/* Last Page Button */}
          <button
            className="p-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            Last
          </button>
        </div>
      </div>

      {/* Payload Modal */}
      {selectedPayload && (
        <div
          className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50"
          tabIndex={-1}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setSelectedPayload(null);
            }
          }}
          ref={(div) => div && div.focus()}
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
                  alert("Copied to clipboard!");
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
    </div>
  );
};

export default TestCasesTable;
