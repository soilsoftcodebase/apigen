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

import React, { useState, useMemo } from "react";
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
} from "lucide-react";

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
      <div className="bg-gradient-to-r from-cyan-950 to-sky-900 px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <TestTubeDiagonal className="w-8 h-8 text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                Generated Test Cases
              </h2>
              <p className="text-blue-100 text-sm">
                {/* {selectedProject?.projectName || "Select a project to view"} */}
                Selected Project Name
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <span className="text-white font-medium text-lg">
                {stats.total}
              </span>
              <span className="text-blue-100 ml-2">Total Test Cases</span>
            </div>
            {/* <div className="px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
              <span className="text-white font-medium text-lg">
                {stats.filtered}
              </span>
              <span className="text-blue-100 ml-2">Filtered Results</span>
            </div> */}
          </div>
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
              {/* <th className="px-6 py-4 text-left text-sm font-semibold uppercase text-gray-600">
                Status
              </th> */}
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
                  <td className="px-6 py-4">
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
                      <span className="text-base font-medium text-gray-900">
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
                        <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-200">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-800">
                              Test Cases
                            </h3>
                            <span className="text-sm text-gray-500">
                              {row.testCases.length} cases
                            </span>
                          </div>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="bg-gray-50">
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                                  ID
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                                  Name
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                                  Request URL
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                                  Payload
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                                  Response
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                                  Type
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                                  Status
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
                                      {getStatusIcon(testCase.status)}
                                      <span
                                        className={`text-sm font-medium ${
                                          testCase.status === "Passed"
                                            ? "text-emerald-600"
                                            : "text-red-600"
                                        }`}
                                      >
                                        {testCase.status}
                                      </span>
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
