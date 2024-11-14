import React from "react";
import GenerateTestCaseTable from "../components/GenerateTestCaseTable";
import Header from "../components/Header";

const Tests = () => {
  return (
    <div>
      {/* Fixed Header */}
      <Header caption="Advanced API Test Generator" onLogout={() => {}} />

      {/* Body content with padding to prevent overlap */}
      <div
        className="page-background min-h-screen px-8 py-8"
        style={{ paddingTop: "180px" }} // Adjust for header height + spacing
      >
        <div className="p-8 rounded-lg shadow-lg bg-white">
          <GenerateTestCaseTable />
        </div>
      </div>
    </div>
  );
};

export default Tests;
