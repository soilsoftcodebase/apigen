// import React from "react";
import GenerateTestCaseTable from "../components/GenerateTestCaseTable";
import TestCasesTable from "../components/TestCaseTable";
// import Header from "../components/Header";

const Tests = () => {
  return (
    <div className="page-background min-h-screen px-8 py-8">
      <div
        className="page-background min-h-screen "
        style={{ paddingTop: "150px" }} // Adjust for header height + spacing
      >
        <div className="p-8 rounded-lg ">
          <GenerateTestCaseTable />
{/*           <TestCasesTable /> */}
        </div>
      </div>
    </div>
  );
};

export default Tests;
