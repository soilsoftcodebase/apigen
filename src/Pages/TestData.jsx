import TestDataTable from "../components/TestDataTable";

const TestData = () => {
  return (
    <div className="page-background min-h-screen px-8 py-8">
      <div
        className="page-background min-h-screen "
        style={{ paddingTop: "150px" }} // Adjust for header height + spacing
      >
        <div className="p-8 rounded-lg shadow-lg bg-white">
          <TestDataTable />
        </div>
      </div>
    </div>
  );
};

export default TestData;
