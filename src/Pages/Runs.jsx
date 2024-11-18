import React from "react";
import RunTestCaseTable from "../components/RunTestCaseTable";

const Runs = () => {
  return (
    <div className="page-background min-h-screen px-8 py-8">
      <div
        className="page-background min-h-screen "
        style={{ paddingTop: "150px" }} // Adjust for header height + spacing
      >
        <div className="p-6 rounded-lg shadow-lg bg-white">
          <RunTestCaseTable />
        </div>
      </div>
    </div>
  );
};

export default Runs;
