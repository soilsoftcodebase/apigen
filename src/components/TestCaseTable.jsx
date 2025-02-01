// import React, { useState, useEffect, useMemo } from "react";
// import { useTable, useSortBy } from "react-table";

// const EnhancedExpandedTable = () => {
//   const [expandedRows, setExpandedRows] = useState([]);
//   const [selectedRows, setSelectedRows] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [methodFilter, setMethodFilter] = useState("");
//   const [testTypeFilter, setTestTypeFilter] = useState("");
//   const [data, setData] = useState([]);

//   // Mock API Call
//   useEffect(() => {
//     const fetchData = async () => {
//       const mockData = [
//         {
//           endpoint: "https://petstore.swagger.io/v2/pet",
//           method: "GET",
//           testCases: [
//             {
//               id: "1",
//               name: "Get Pet by ID",
//               url: "/v2/pet/1",
//               payload: "N/A",
//               response: "200",
//               type: "GET",
//               steps: "1. Fetch pet by ID\n2. Verify response",
//             },
//           ],
//         },
//         {
//           endpoint: "https://petstore.swagger.io/v2/user",
//           method: "POST",
//           testCases: [
//             {
//               id: "3",
//               name: "Create User",
//               url: "/v2/user",
//               payload: '{"name": "John", "status": "active"}',
//               response: "201",
//               type: "POST",
//               steps: "1. Send POST request\n2. Validate user creation",
//             },
//           ],
//         },
//       ];
//       setTimeout(() => setData(mockData), 1000); // Simulating API delay
//     };

//     fetchData();
//   }, []);

//   // Apply Filters
//   const filteredData = useMemo(() => {
//     return data.filter(
//       (item) =>
//         item.endpoint.toLowerCase().includes(searchTerm.toLowerCase()) &&
//         (methodFilter ? item.method === methodFilter : true) &&
//         (testTypeFilter
//           ? item.testCases.some((tc) => tc.type === testTypeFilter)
//           : true)
//     );
//   }, [data, searchTerm, methodFilter, testTypeFilter]);

//   // Toggle Expand Row
//   const toggleRow = (rowIndex) => {
//     setExpandedRows((prev) =>
//       prev.includes(rowIndex)
//         ? prev.filter((i) => i !== rowIndex)
//         : [...prev, rowIndex]
//     );
//   };

//   // Column Definitions (Fixed)
//   const columns = useMemo(
//     () => [
//       {
//         id: "select",
//         Header: (
//           <input
//             type="checkbox"
//             className="w-5 h-5"
//             onChange={(e) =>
//               setSelectedRows(
//                 e.target.checked ? filteredData.map((_, i) => i) : []
//               )
//             }
//             checked={
//               selectedRows.length === filteredData.length &&
//               filteredData.length > 0
//             }
//           />
//         ),
//         accessor: "select",
//         Cell: ({ row }) => (
//           <input
//             type="checkbox"
//             className="w-5 h-5"
//             checked={selectedRows.includes(row.index)}
//             onChange={() => {
//               setSelectedRows((prev) =>
//                 prev.includes(row.index)
//                   ? prev.filter((id) => id !== row.index)
//                   : [...prev, row.index]
//               );
//             }}
//           />
//         ),
//         disableSortBy: true,
//       },
//       {
//         id: "sno",
//         Header: "S.No",
//         accessor: (_, index) => index + 1,
//         Cell: ({ value }) => <strong>{value}</strong>,
//         disableSortBy: true,
//       },
//       {
//         id: "endpoint",
//         Header: "Endpoint",
//         accessor: "endpoint",
//         Cell: ({ row, value }) => (
//           <div className="flex items-center space-x-2 font-medium text-gray-800">
//             <button
//               className={`text-lg font-bold transform transition-transform ${
//                 expandedRows.includes(row.index) ? "rotate-90" : ""
//               }`}
//               onClick={() => toggleRow(row.index)}
//             >
//               &#9654;
//             </button>
//             <span>{value}</span>
//           </div>
//         ),
//       },
//       {
//         id: "method",
//         Header: "Method",
//         accessor: "method",
//       },
//       {
//         id: "testCaseCount",
//         Header: "Test Case Count",
//         accessor: (row) => row.testCases?.length || 0,
//       },
//     ],
//     [expandedRows, selectedRows, filteredData]
//   );

//   // React Table Hook
//   const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
//     useTable({ columns, data: filteredData }, useSortBy);

//   return (
//     <div className="container mx-auto p-6 bg-white shadow-md rounded-lg">
//       <h1 className="text-3xl font-bold text-sky-800 mb-6">Test Cases Table</h1>

//       {/* Filters */}
//       <div className="flex items-center justify-between mb-4">
//         <input
//           type="text"
//           placeholder="Search Endpoint"
//           className="p-2 border rounded w-1/3"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//         <select
//           className="p-2 border rounded w-1/5"
//           value={methodFilter}
//           onChange={(e) => setMethodFilter(e.target.value)}
//         >
//           <option value="">All Methods</option>
//           <option value="GET">GET</option>
//           <option value="POST">POST</option>
//         </select>
//         <select
//           className="p-2 border rounded w-1/5"
//           value={testTypeFilter}
//           onChange={(e) => setTestTypeFilter(e.target.value)}
//         >
//           <option value="">All Test Types</option>
//           <option value="GET">GET</option>
//           <option value="POST">POST</option>
//         </select>
//       </div>

//       {/* Main Table */}
//       <table
//         {...getTableProps()}
//         className="table-auto w-full border-collapse border border-gray-300 rounded-lg"
//       >
//         <thead className="bg-gradient-to-r from-gray-100 to-gray-300 text-gray-900">
//           {headerGroups.map((headerGroup) => (
//             <tr {...headerGroup.getHeaderGroupProps()}>
//               {headerGroup.headers.map((column) => (
//                 <th
//                   {...column.getHeaderProps()}
//                   className="p-3 border text-left text-lg font-semibold"
//                 >
//                   {column.render("Header")}
//                 </th>
//               ))}
//             </tr>
//           ))}
//         </thead>
//         <tbody {...getTableBodyProps()} className="divide-y divide-gray-200">
//           {rows.map((row) => {
//             prepareRow(row);
//             return (
//               <React.Fragment key={row.id}>
//                 <tr
//                   {...row.getRowProps()}
//                   className="hover:bg-gray-50 transition-colors"
//                 >
//                   {row.cells.map((cell) => (
//                     <td
//                       {...cell.getCellProps()}
//                       className="p-3 border border-gray-300 text-lg font-semibold"
//                     >
//                       {cell.render("Cell")}
//                     </td>
//                   ))}
//                 </tr>
//                 {expandedRows.includes(row.index) && (
//                   <tr>
//                     <td
//                       colSpan={columns.length}
//                       className="p-3 bg-gray-50 border-t border-b"
//                     >
//                       <table className="w-full table-auto border-collapse border border-gray-300">
//                         <thead className="bg-gray-100">
//                           <tr>
//                             <th className="p-2 border text-left">
//                               Test Case ID
//                             </th>
//                             <th className="p-2 border text-left">Test Name</th>
//                             <th className="p-2 border text-left">
//                               Request URL
//                             </th>
//                             <th className="p-2 border text-left">Payload</th>
//                             <th className="p-2 border text-left">
//                               Response Code
//                             </th>
//                             <th className="p-2 border text-left">Type</th>
//                             <th className="p-2 border text-left">Steps</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {row.original.testCases.map((testCase) => (
//                             <tr
//                               key={testCase.id}
//                               className="hover:bg-gray-50 text-sm"
//                             >
//                               <td className="p-2 border">{testCase.id}</td>
//                               <td className="p-2 border">{testCase.name}</td>
//                               <td className="p-2 border">{testCase.url}</td>
//                               <td className="p-2 border">{testCase.payload}</td>
//                               <td className="p-2 border">
//                                 {testCase.response}
//                               </td>
//                               <td className="p-2 border">{testCase.type}</td>
//                               <td className="p-2 border">{testCase.steps}</td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </td>
//                   </tr>
//                 )}
//               </React.Fragment>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default EnhancedExpandedTable;

import React, { useState, useMemo, useEffect } from "react";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  ChevronDown,
  ChevronRight,
  Globe,
  AlertCircle,
  CheckCircle2,
  Search,
  Filter,
  Database,
  TestTubeDiagonal,
  PlusCircle,
  PlayCircle,
  Download,
} from "lucide-react";
import {
  getTestCases,
  getAllProjects,
  RunallTestCases,
  // getTestsByProjectName,
  RunSelectedTestCase,
} from "../Services/apiGenServices";

const mockData = [
  {
    id: 1,
    endpoint: "https://petstore.swagger.io/v2/pet",
    method: "GET",
    testCount: 5,
    status: "Passed",
    lastRun: "2024-03-15",
    testCases: [
      {
        id: "TC001",
        name: "Fetch Pet Details",
        requestUrl: "/pet/1",
        payload: "{ id: 1 }",
        responseCode: "200",
        type: "Positive",
        status: "Passed",
      },
      {
        id: "TC002",
        name: "Pet Not Found",
        requestUrl: "/pet/999",
        payload: "{ id: 999 }",
        responseCode: "404",
        type: "Negative",
        status: "Failed",
      },
      {
        id: "TC003",
        name: "Invalid ID Format",
        requestUrl: "/pet/abc",
        payload: "{ id: 'abc' }",
        responseCode: "400",
        type: "Edge",
        status: "Passed",
      },
    ],
  },
  {
    id: 2,
    endpoint: "https://petstore.swagger.io/v2/pet",
    method: "POST",
    testCount: 7,
    status: "Failed",
    lastRun: "2024-03-14",
    testCases: [
      {
        id: "TC004",
        name: "Create New Pet",
        requestUrl: "/pet",
        payload: "{ name: 'Max', status: 'available' }",
        responseCode: "201",
        type: "Positive",
        status: "Passed",
      },
      {
        id: "TC005",
        name: "Missing Required Fields",
        requestUrl: "/pet",
        payload: "{ status: 'available' }",
        responseCode: "400",
        type: "Boundary",
        status: "Failed",
      },
    ],
  },
  {
    id: 3,
    endpoint: "https://petstore.swagger.io/v2/store/inventory",
    method: "GET",
    testCount: 3,
    status: "Passed",
    lastRun: "2024-03-15",
    testCases: [
      {
        id: "TC006",
        name: "Get Inventory",
        requestUrl: "/store/inventory",
        payload: "{}",
        responseCode: "200",
        type: "Positive",
        status: "Passed",
      },
    ],
  },
];

const METHODS = ["GET", "POST", "PUT", "DELETE"];
const TEST_TYPES = ["Positive", "Negative", "Edge", "Boundary"];

const Table = () => {
  const [expandedRows, setExpandedRows] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [searchEndpoint, setSearchEndpoint] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [selectedTestType, setSelectedTestType] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [testCases, setTestCases] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFormPopup, setShowFormPopup] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]); // Track selected rows
  const [runningTests, setRunningTests] = useState(false);
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
  const handleProjectChange = (e) => {
    setSelectedProject(e.target.value);
    setCurrentPage(1);
    setTestCases([]);
  };

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
      RunallTestCases();
    } else {
      RunSelectedTestCase();
    }
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

  const filteredData = useMemo(() => {
    return mockData.filter((row) => {
      const matchesEndpoint = row.endpoint
        .toLowerCase()
        .includes(searchEndpoint.toLowerCase());
      const matchesMethod = !selectedMethod || row.method === selectedMethod;
      const matchesTestType =
        !selectedTestType ||
        row.testCases.some((tc) => tc.type === selectedTestType);
      return matchesEndpoint && matchesMethod && matchesTestType;
    });
  }, [searchEndpoint, selectedMethod, selectedTestType]);

  const stats = useMemo(() => {
    const methodCounts = METHODS.reduce((acc, method) => {
      acc[method] = filteredData.filter((row) => row.method === method).length;
      return acc;
    }, {});

    return {
      total: mockData.length,
      filtered: filteredData.length,
      methods: methodCounts,
    };
  }, [filteredData]);

  const toggleRow = (rowId) => {
    setExpandedRows((prev) =>
      prev.includes(rowId)
        ? prev.filter((id) => id !== rowId)
        : [...prev, rowId]
    );
  };

  const getMethodColor = (method) => {
    const colors = {
      GET: "bg-blue-100 text-blue-800 border-blue-200",
      POST: "bg-green-100 text-green-800 border-green-200",
      PUT: "bg-yellow-100 text-yellow-800 border-yellow-200",
      DELETE: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[method] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getStatusIcon = (status) => {
    return status === "Passed" ? (
      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
    ) : (
      <AlertCircle className="w-5 h-5 text-red-500" />
    );
  };

  return (
    <div className="w-full overflow-hidden  rounded-xl shadow-lg border border-gray-200">
      {/* Main Header */}
      <div className="bg-gradient-to-r from-cyan-950 to-sky-900 px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <TestTubeDiagonal className="w-12 h-12 text-white mb-6" />
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">
                Generated Test Cases
              </h2>
              {/* <p className="text-blue-100 text-sm">
                {selectedProject?.projectName || "Select a project to view"}
                Selected Project Name</p> */}
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <select
                  id="project-select"
                  name="project"
                  value={selectedProject || ""}
                  onChange={handleProjectChange}
                  className="h-8 bg-transparent border border-blue-400/20 w-full rounded-lg px-2 pr-10 text-lg text-white focus:outline-none focus:ring-2 focus:ring-white/30 truncate  focus:bg-white/10 "
                  style={{
                    maxWidth: "300px", // Set a fixed maximum width for the dropdown
                    overflow: "hidden", // Prevent overflowing text
                    textOverflow: "ellipsis", // Add ellipsis for long text
                    whiteSpace: "nowrap", // Prevent text from wrapping to the next line
                  }}
                >
                  <option value="" disabled>
                    {projects.length > 0
                      ? "Choose a project"
                      : "No projects available"}
                  </option>
                  {projects.map((project, index) => (
                    <option
                      key={project.id || index}
                      value={project.id}
                      className="text-gray-800"
                    >
                      {project.projectName}
                    </option>
                  ))}
                </select>

                {selectedProject && (
                  <div className="flex justify-around items-center space-x-4">
                    {/* <div className="flex items-center space-x-48 sm:mt-0"> */}
                    <div className="relative group bottom-11">
                      <div className="w-20 h-12 bg-white/10 rounded-full border-blue-400/20 backdrop-blur-sm flex flex-col justify-center items-center shadow-sm ml-5">
                        <span className="text-white font-bold text-2xl ">
                          {stats.total}20
                        </span>
                        {/* <span className="text-blue-100 text-xs ">Tests</span> */}
                      </div>

                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 ml-2 w-max bg-gray-800 text-white text-xs px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md">
                        Total Test Cases
                      </div>
                    </div>

                    <div className=" flex items-center space-x-5">
                      {/* Add New Test Case Button */}
                      <div className=" flex justify-end gap-5">
                        {/* Add Test Case Button */}
                        <button
                          className="flex items-center justify-center w-full gap-2  bg-white/10 border border-blue-400/20 text-white font-bold py-1 px-6 rounded-lg shadow-md hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => setShowFormPopup(true)}
                          disabled={!selectedProject}
                        >
                          <PlusCircle className="w-8 h-8" />
                          Add Test Case
                        </button>

                        {/* Run Test Cases Button */}
                        <button
                          className="flex items-center justify-center w-full gap-2  bg-white/10 border border-blue-400/20 text-white font-bold py-1 px-6 rounded-lg shadow-md hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={handleRunTestCases}
                          disabled={runningTests || !selectedProject}
                        >
                          <PlayCircle className="w-8 h-8" />
                          {runningTests
                            ? "Running..."
                            : selectedRows.length === 0
                            ? "Run All Test Cases"
                            : `Run (${selectedRows.length}) Test Cases`}
                        </button>
                      </div>

                      {/* Download All Button */}
                      <div className="relative group">
                        <button
                          className="flex items-center justify-center bg-white/10 border border-blue-400/20 text-white font-bold p-3 rounded-full shadow-md hover:bg-white/30  transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={downloadAllTestCases}
                          disabled={!selectedProject}
                        >
                          <Download className="w-5 h-5" />
                        </button>

                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max bg-gray-800 text-white text-xs px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md">
                          Download All Test Cases
                        </div>
                      </div>
                    </div>
                    {/* </div> */}
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* <div className="flex items-center space-x-4">
            <div className="px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <span className="text-white font-medium text-lg">
                {stats.total}
              </span>
              <span className="text-blue-100 ml-2">Total Test Cases</span>
            </div>
            <div className="px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <span className="text-white font-medium text-lg">
                {stats.filtered}
              </span>
              <span className="text-blue-100 ml-2">Filtered Results</span>
            </div>
          </div> */}
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-3 gap-6 ">
          <div className="relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-blue-300" />
            <input
              type="text"
              placeholder="Search endpoints..."
              value={searchEndpoint}
              onChange={(e) => setSearchEndpoint(e.target.value)}
              className="w-full h-12 bg-white/10 border border-blue-400/20 rounded-xl pl-12 pr-4 text-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
            <div className="grid grid-cols-2 gap-2 mb-6">
              <div className="px-2 py-1 bg-white/10 rounded-lg backdrop-blur-sm mt-4 pl-4">
                <span className="text-white font-medium text-sm">
                  {stats.total}
                </span>
                <span className="text-blue-100 ml-2">Total Endpoints</span>
              </div>

              <div className="px-2 py-1 bg-white/10 rounded-lg backdrop-blur-sm mt-4 pl-4">
                <span className="text-white font-medium text-sm">
                  {stats.total}
                </span>
                <span className="text-blue-100 ml-2">Searched</span>
              </div>
            </div>
            {/* <div className="text-white mt-2 text-base ml-2">
              Found 0 Endpoints
            </div> */}
          </div>
          <div>
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="h-12 bg-white/10 border border-blue-400/20 w-full rounded-xl px-4 text-lg text-white focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <option value="">Method</option>
              {METHODS.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
            {/* Method Stats */}
            <div>
              <div className="flex items-center space-x-2 mt-4">
                {METHODS.map((method) => (
                  <div
                    key={method}
                    className={`px-2 py-1 rounded-lg text-sm font-medium flex items-center space-x-2 
                ${
                  stats.methods[method] > 0
                    ? "bg-white/15 text-white"
                    : "bg-white/5 text-cyan-200"
                }`}
                  >
                    <span className="text-sm font-semibold">{method}</span>
                    <span className="text-blue-200">-</span>
                    <span>{stats.methods[method]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <select
            value={selectedTestType}
            onChange={(e) => setSelectedTestType(e.target.value)}
            className="h-12 bg-white/10 border border-blue-400/20 rounded-xl px-4 text-lg text-white focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            <option value="">Test Type</option>
            {TEST_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Method Stats
        <div className="flex items-center space-x-4">
          {METHODS.map((method) => (
            <div
              key={method}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 
                ${
                  stats.methods[method] > 0
                    ? "bg-white/15 text-white"
                    : "bg-white/5 text-blue-200"
                }`}
            >
              <span className="text-sm font-semibold">{method}</span>
              <span className="text-blue-200">-</span>
              <span>{stats.methods[method]}</span>
            </div>
          ))}
        </div> */}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-8 py-4 text-left text-sm font-semibold uppercase text-gray-600">
                <input
                  type="checkbox"
                  onChange={(e) => handleSelectAllRows(e.target.checked)}
                  checked={
                    selectedRows.length === testCases.length &&
                    testCases.length > 0
                  }
                  className="w-5 h-5 text-sky-600 border-gray-300 rounded focus:ring-blue-200 focus:ring-2 transition-all duration-300"
                />
              </th>
              <th className="px-6 py-4 text-left w-16"></th>

              <th className="px-6 py-4 text-left text-base font-semibold uppercase text-gray-600">
                Endpoint
              </th>
              <th className="px-6 py-4 text-left text-base font-semibold uppercase text-gray-600">
                Method
              </th>
              <th className="px-6 py-4 text-left text-base font-semibold uppercase text-gray-600">
                Test Count
              </th>

              <th className="px-6 py-4 text-left text-base font-semibold uppercase text-gray-600">
                Last Generated
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.map((row) => (
              <React.Fragment key={row.id}>
                <tr
                  className={`transition-colors ${
                    hoveredRow === row.id ? "bg-gray-50" : "bg-white"
                  }`}
                  onMouseEnter={() => setHoveredRow(row.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td className="px-8 py-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-5 h-5 text-sky-600 border-gray-300 rounded focus:ring-blue-200 focus:ring-2 transition-all duration-300"

                        // checked={selectedRows.includes(row.original.testCaseId)}
                        // onChange={() =>
                        //   handleSelectRow(row.original.testCaseId)
                        // }
                      />
                    </div>
                  </td>
                  <td className="px-0 py-4">
                    <button
                      onClick={() => toggleRow(row.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        hoveredRow === row.id
                          ? "bg-gray-200"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {expandedRows.includes(row.id) ? (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className="text-base font-semibold text-gray-900">
                        {row.endpoint}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-4 py-2 rounded-lg text-sm font-medium border ${getMethodColor(
                        row.method
                      )}`}
                    >
                      {row.method}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-base text-gray-600">
                    {row.testCount}
                  </td>
                  {/* <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(row.status)}
                      <span
                        className={`text-base font-medium ${
                          row.status === "Passed"
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {row.status}
                      </span>
                    </div>
                  </td> */}
                  <td className="px-6 py-4 text-base text-gray-600">
                    {row.lastRun}
                  </td>
                </tr>
                {expandedRows.includes(row.id) && (
                  <tr>
                    <td colSpan={6} className="px-8 py-6 bg-gray-50">
                      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-cyan-950 to-sky-900 px-6 py-4 border-b border-gray-200">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-white">
                              Test Cases
                            </h3>
                            <span className="text-sm text-gray-100">
                              {row.testCases.length} cases
                            </span>
                          </div>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="bg-gray-50">
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                                  ID
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                                  Name
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                                  Request URL
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                                  Payload
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                                  Response
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                                  Type
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                                  Steps
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {row.testCases.map((testCase) => (
                                <tr
                                  key={testCase.id}
                                  className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                                >
                                  <td className="px-6 py-4 text-sm font-medium text-gray-700">
                                    {testCase.id}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-600">
                                    {testCase.name}
                                  </td>
                                  <td className="px-6 py-4">
                                    <code className="text-sm bg-gray-100 px-3 py-1 rounded-lg text-gray-800">
                                      {testCase.requestUrl}
                                    </code>
                                  </td>
                                  <td className="px-6 py-4">
                                    <code className="text-sm bg-gray-100 px-3 py-1 rounded-lg text-gray-800">
                                      {testCase.payload}
                                    </code>
                                  </td>
                                  <td className="px-6 py-4">
                                    <span
                                      className={`px-3 py-1 rounded-lg text-sm font-medium ${
                                        testCase.responseCode.startsWith("2")
                                          ? "bg-green-100 text-green-800"
                                          : "bg-red-100 text-red-800"
                                      }`}
                                    >
                                      {testCase.responseCode}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4">
                                    <span className="text-sm font-medium px-3 py-1 bg-indigo-100 text-indigo-800 rounded-lg">
                                      {testCase.type}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4">
                                    <div className="flex items-center space-x-2">
                                      {/* {getStatusIcon(testCase.status)} */}
                                      {/* <span
                                        className={`text-sm font-medium ${
                                          testCase.status === "Passed"
                                            ? "text-emerald-600"
                                            : "text-red-600"
                                        }`}
                                      >
                                        {testCase.status}
                                      </span> */}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
