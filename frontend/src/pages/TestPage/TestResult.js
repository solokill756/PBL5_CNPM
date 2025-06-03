import TestResultPage from "@/components/TestList/TestAnswer";
import Result from "@/components/TestList/TestResult";
import React from "react";


function TestResult() {
  return (
    <div>
      {/* Main Content */}
      <div className="px-4">
        <Result/>
        <TestResultPage/>
      </div>
    </div>
  );
}

export default TestResult;