// import React, { useState, useEffect, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import * as XLSX from "xlsx";
// import { getTestCases, getAllProjects } from "../Services/apiGenServices";

// const TestCasesTable = () => {
//   const [testCases, setTestCases] = useState([]);
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedTestCases, setSelectedTestCases] = useState(new Set());
//   const [modalContent, setModalContent] = useState(null); // Modal content for "See More"
//   const [modalVisible, setModalVisible] = useState(false); // Modal visibility
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchAllProjects = async () => {
//       try {
//         setLoading(true);
//         const projects = await getAllProjects();
//         setProjects(projects || []);
//       } catch (error) {
//         console.error("Error fetching project names:", error);
//         setError("Failed to load projects.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAllProjects();
//   }, []);

//   const fetchTestCases = useCallback(async () => {
//     if (!selectedProject) return;
//     setLoading(true);
//     try {
//       const data = await getTestCases(selectedProject, currentPage);
//       setTestCases(data.testCases || []);
//       setTotalPages(data.totalPages || 1);

//       // If processing is still ongoing, check again after a delay
//       if (data.isProcessing) {
//         setTimeout(fetchTestCases, 5000); // Retry after 5 seconds
//       } else {
//         setLoading(false); // Processing complete, stop loading
//       }
//     } catch (error) {
//       console.error("Failed to fetch test cases:", error);
//       setError("Failed to load test cases.");
//       setLoading(false);
//     }
//   }, [selectedProject, currentPage]);

//   useEffect(() => {
//     fetchTestCases();
//   }, [fetchTestCases]);

//   const handleProjectChange = (e) => {
//     setSelectedProject(e.target.value);
//     setCurrentPage(1); // Reset to first page on project change
//     setSearchTerm(""); // Clear search term on project change
//     setSelectedTestCases(new Set()); // Clear selected test cases
//   };

//   const handleCheckboxChange = (testCaseId) => {
//     setSelectedTestCases((prevSelectedTestCases) => {
//       const newSelectedTestCases = new Set(prevSelectedTestCases);
//       newSelectedTestCases.has(testCaseId)
//         ? newSelectedTestCases.delete(testCaseId)
//         : newSelectedTestCases.add(testCaseId);
//       return newSelectedTestCases;
//     });
//   };

//   const handleSelectAllChange = (e) => {
//     if (e.target.checked) {
//       const allTestCaseIds = testCases.map((testCase) => testCase.testCaseId);
//       setSelectedTestCases(new Set(allTestCaseIds));
//     } else {
//       setSelectedTestCases(new Set());
//     }
//   };

//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   const filteredTestCases = testCases.filter((testCase) =>
//     testCase.testCaseName.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const runSelectedTestCases = () => {
//     if (selectedTestCases.size === 0) {
//       alert("Please select at least one test case to run.");
//       return;
//     }
//     alert(`Running Test Cases: ${Array.from(selectedTestCases).join(", ")}`);
//     // Add your execution logic here
//   };

//   const runSingleTestCase = (testCaseId) => {
//     alert(`Running Test Case: ${testCaseId}`);
//     // Add your single test case execution logic here
//   };

//   const downloadTestCases = async () => {
//     if (!selectedProject) {
//       alert("Please select a project first.");
//       return;
//     }

//     try {
//       let allTestCases = [];
//       let page = 1;

//       while (true) {
//         const data = await getTestCases(selectedProject, page);
//         if (data.testCases && data.testCases.length > 0) {
//           allTestCases = allTestCases.concat(data.testCases);
//           page += 1;

//           // Break if we've fetched all pages
//           if (page > data.totalPages) break;
//         } else {
//           break;
//         }
//       }

//       if (allTestCases.length === 0) {
//         alert("No test cases found to download.");
//         return;
//       }

//       const worksheet = XLSX.utils.json_to_sheet(allTestCases);
//       const workbook = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(workbook, worksheet, "TestCases");

//       XLSX.writeFile(workbook, `TestCases_${selectedProject}.xlsx`);
//     } catch (error) {
//       console.error("Failed to download test cases:", error);
//       alert("An error occurred while downloading the test cases.");
//     }
//   };

//   const handlePageChange = (newPage) => {
//     setCurrentPage(newPage);
//   };

//   const showFullContent = (content) => {
//     setModalContent(content);
//     setModalVisible(true);
//   };

//   const closeModal = () => {
//     setModalVisible(false);
//     setModalContent(null);
//   };

//   if (loading && testCases.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen text-center">
//         <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-green-500"></div>
//         <p className="mt-4 text-xl font-semibold text-gray-700">
//           Loading data... Please wait!
//         </p>
//       </div>
//     );
//   }

//   if (error) {
//     return <div className="text-center text-red-600">{error}</div>;
//   }

//   return (
//     <div className="container mx-auto">
//       {/* Modal for Full Content */}
//       {modalVisible && (
//         <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
//             <h3 className="text-lg font-bold mb-4">Full Content</h3>
//             <p className="text-gray-700">{modalContent}</p>
//             <button
//               className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//               onClick={closeModal}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//       <div className="flex justify-between items-center mb-6">
//         <div className="flex items-center">
//           <label
//             htmlFor="projectSelect"
//             className="mr-2 text-gray-700 font-bold"
//           >
//             Select Project:
//           </label>
//           <select
//             id="projectSelect"
//             value={selectedProject || ""}
//             onChange={handleProjectChange}
//             className="p-2 border rounded"
//           >
//             <option value="" disabled>
//               {projects.length > 0
//                 ? "Choose a project"
//                 : "No projects available"}
//             </option>
//             {projects.map((project) => (
//               <option key={project.id} value={project.projectName}>
//                 {project.projectName}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div className="flex space-x-4">
//           <button
//             className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition duration-200"
//             onClick={runSelectedTestCases}
//           >
//             Run Selected Test Cases
//           </button>
//           <button
//             className="bg-sky-600 text-white font-bold py-2 px-4 rounded hover:bg-sky-700 transition duration-200"
//             onClick={downloadTestCases}
//           >
//             Download All Test Cases
//           </button>
//         </div>
//       </div>

//       <div className="mb-4">
//         <input
//           type="text"
//           placeholder="Search test cases..."
//           value={searchTerm}
//           onChange={handleSearch}
//           className="p-2 border rounded w-full"
//         />
//       </div>

//       {filteredTestCases.length > 0 ? (
//         <div className="overflow-hidden rounded-lg shadow-lg">
//           <div
//             className="max-h-[500px] overflow-y-auto table-wrapper"
//             style={{ borderTop: "1px solid #e5e5e5" }}
//           >
//             <table className="min-w-2xl bg-white border rounded">
//               <thead
//                 className="bg-gray-800 text-white sticky top-0"
//                 style={{ zIndex: 1 }}
//               >
//                 <tr>
//                   <th className="p-3 text-center w-1/12">
//                     <input
//                       type="checkbox"
//                       onChange={handleSelectAllChange}
//                       checked={
//                         selectedTestCases.size > 0 &&
//                         selectedTestCases.size === filteredTestCases.length
//                       }
//                     />
//                   </th>
//                   <th className="p-3 text-center ">
//                     TestCase
//                     <br />
//                     ID
//                   </th>
//                   <th className="p-3 text-center ">TestCaseName</th>
//                   <th className="p-3 text-center ">InputRequestUrl</th>
//                   <th className="p-3 text-center ">
//                     Expected
//                     <br />
//                     ResponseCode
//                   </th>
//                   <th className="p-3 text-center ">
//                     Run
//                     <br /> TestCases
//                   </th>
//                   <th className="p-3 text-center ">
//                     Run
//                     <br /> TestCases
//                   </th>
//                   <th className="p-3 text-center ">
//                     Run
//                     <br /> TestCases
//                   </th>
//                   <th className="p-3 text-center ">
//                     Run
//                     <br /> TestCases
//                   </th>
//                   <th className="p-3 text-center ">
//                     Run
//                     <br /> TestCases
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="animate-fadeIn">
//                 {filteredTestCases.map((testCase) => (
//                   <tr key={testCase.testCaseId} className="hover:bg-gray-100">
//                     <td className="p-3 text-center">
//                       <input
//                         type="checkbox"
//                         checked={selectedTestCases.has(testCase.testCaseId)}
//                         onChange={() =>
//                           handleCheckboxChange(testCase.testCaseId)
//                         }
//                       />
//                     </td>
//                     <td className="p-3 text-center truncate  text-gray-700 font-semibold">
//                       {testCase.testCaseId}
//                     </td>
//                     <td className="p-3 text-left  text-gray-700 font-semibold truncate pl-10">
//                       {testCase.testCaseName.length > 20 ? (
//                         <>
//                           {testCase.testCaseName.substring(0, 20)}...
//                           <button
//                             className="text-blue-600 text-decoration: none"
//                             onClick={() =>
//                               showFullContent(testCase.testCaseName)
//                             }
//                           >
//                             <span className="text-xs">View</span>
//                           </button>
//                         </>
//                       ) : (
//                         testCase.testCaseName
//                       )}
//                     </td>
//                     <td className="p-3 text-center text-gray-700 font-semibold truncate">
//                       {testCase.inputRequestUrl.length > 20 ? (
//                         <>
//                           {testCase.inputRequestUrl.substring(0, 20)}...
//                           <button
//                             className="text-blue-600"
//                             onClick={() =>
//                               showFullContent(testCase.inputRequestUrl)
//                             }
//                           >
//                             <span className="text-xs">View</span>
//                           </button>
//                         </>
//                       ) : (
//                         testCase.inputRequestUrl
//                       )}
//                     </td>
//                     <td className="p-3 text-center truncate font-semibold">
//                       {testCase.expectedResponseCode}
//                     </td>
//                     <td className="p-3 text-center">
//                       <button
//                         className="bg-red-500 font-bold text-white px-6 py-2 rounded hover:bg-red-700"
//                         onClick={() => runSingleTestCase(testCase.testCaseId)}
//                       >
//                         Run
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//           <div className="flex justify-center items-center mt-8 space-x-2 mb-10">
//             <button
//               disabled={currentPage === 1}
//               onClick={() => handlePageChange(1)}
//               className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
//             >
//               First
//             </button>
//             <button
//               disabled={currentPage === 1}
//               onClick={() => handlePageChange(currentPage - 1)}
//               className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
//             >
//               Previous
//             </button>
//             <span className="font-bold px-4 py-2 bg-gray-200 rounded">
//               {currentPage} / {totalPages}
//             </span>
//             <button
//               disabled={currentPage === totalPages}
//               onClick={() => handlePageChange(currentPage + 1)}
//               className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
//             >
//               Next
//             </button>
//             <button
//               disabled={currentPage === totalPages}
//               onClick={() => handlePageChange(totalPages)}
//               className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
//             >
//               Last
//             </button>
//           </div>
//         </div>
//       ) : (
//         <p className="text-lg font-semibold text-center text-red-600 mt-10">
//           {selectedProject
//             ? "No test cases found for this project."
//             : "Please select a project to view test cases."}
//         </p>
//       )}
//     </div>
//   );
// };

// export default TestCasesTable;

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
        className="h-5 w-5 text-blue-600 border-gray-300 rounded"
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
  const [itemsPerPage, setItemsPerPage] = useState(10);
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
      setTestCases(data.testCases || []);
      setTotalPages(data.totalPages || 1);

      if (data.isProcessing) {
        setTimeout(fetchTestCases, 5000);
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

  const downloadTestCases = () => {
    if (!selectedProject) {
      alert("Please select a project first.");
      return;
    }

    try {
      const worksheet = XLSX.utils.json_to_sheet(testCases);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "TestCases");
      XLSX.writeFile(workbook, `TestCases_${selectedProject}.xlsx`);
    } catch (error) {
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
      { Header: "TestCase ID", accessor: "testCaseId" },
      { Header: "TestCase Name", accessor: "testCaseName" },
      {
        Header: "Input Request URL",
        accessor: "inputRequestUrl",
        Cell: ({ value }) => (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {value?.length > 30 ? `${value.substring(0, 30)}...` : value}
          </a>
        ),
      },
      {
        Header: "Payload",
        accessor: "payload",
        Cell: ({ value }) => (
          <button
            onClick={() => setSelectedPayload(value)}
            className="text-blue-500 underline hover:text-blue-700"
          >
            View Payload
          </button>
        ),
      },
      { Header: "Expected Response Code", accessor: "expectedResponseCode" },
      { Header: "Steps", accessor: "steps" },
      {
        Header: "Test Type",
        accessor: "testtype",
        Cell: ({ value }) =>
          value ? value.charAt(0).toUpperCase() + value.slice(1) : "",
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
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
    <div className="container mx-auto p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <select
          value={selectedProject || ""}
          onChange={handleProjectChange}
          className="p-2 border rounded w-full sm:w-auto"
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
            className="bg-sky-600 text-white font-bold py-2 px-4 rounded hover:bg-sky-700"
            onClick={downloadTestCases}
          >
            Download All
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
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
          <span className="ml-4 text-blue-700">Loading test cases...</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table
            {...getTableProps()}
            className="table-auto w-full border-collapse border border-gray-300 shadow-md rounded-lg"
          >
            <thead className="bg-gray-200">
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className="p-3 border border-gray-300 text-left font-bold text-gray-800"
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
                      rowIndex % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    {row.cells.map((cell) => (
                      <td
                        {...cell.getCellProps()}
                        className="p-3 border border-gray-300 text-left"
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

      <div className="flex justify-between items-center mt-4">
        <div>
          Items per page:
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="ml-2 border rounded p-2"
          >
            {[10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center">
          <button
            className="p-2 bg-gray-300 rounded hover:bg-gray-400 mr-2"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="p-2 bg-gray-300 rounded hover:bg-gray-400 ml-2"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {/* Payload Modal */}
      {selectedPayload && (
        <div
          className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setSelectedPayload(null);
            }
          }}
          tabIndex={-1}
          ref={(div) => div && div.focus()}
        >
          <div className="bg-white p-6 rounded shadow-lg w-1/2 max-h-[90vh] overflow-auto">
            <h3 className="text-lg font-bold mb-4">Payload Details</h3>
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
