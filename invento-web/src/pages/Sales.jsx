import React, { useState } from "react";
import Header from "../components/Header";
import Aside from "../components/AsideBar";
import Swal from "sweetalert2";

export default function () {
  const [salesReport, setSalesReport] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const generateReport = async (e) => {
    e.preventDefault();

    if (!startDate || !endDate || !salesReport) {
      Swal.fire("Error", "Each field is required", "error");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/sales-report?fromDate=${startDate}&toDate=${endDate}&name=${salesReport}`
      );

      if (!response.ok) {
        Swal.fire("Error", "Failed to generate report", "error");
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "sales_report.xlsx";
      link.click();
      URL.revokeObjectURL(url);
      Swal.fire("Success", "Report Generated Successfully", "success");
    } catch {
      Swal.fire("Error", "Error downloading report", "error");
    }
  };

  return (
    <div>
      <div>
        <Header openSidebar={() => setSidebarOpen(true)} />
        <Aside
          isOpen={isSidebarOpen}
          closeSidebar={() => setSidebarOpen(false)}
          active="sales"
        />
      </div>
      <div className="w-full px-3">
        <h1 className="text-xl font-semibold ms-2 mt-2 md:mt-4 md:ms-3 md:text-2xl w-full text-center">
          Sales Report
        </h1>
        <form onSubmit={generateReport}>
          <div className="w-full md:w-2/3 lg:w-1/2 bg-white p-6 rounded-lg shadow mx-auto mt-4">
            <h1 className="text-xl font-bold mb-3">Report Filters</h1>
            <p className="mb-2">Report Type</p>
            <div className="w-full flex justify-between gap-3 mb-4">
              <select
                className="border h-12 p-2 rounded w-full"
                value={salesReport}
                onChange={(e) => setSalesReport(e.target.value)}
              >
                <optgroup>
                  <option value=''>Select Report Type</option>
                  <option value="Monthly Sales Report">
                    Monthly Sales Report
                  </option>
                  <option value="Yearly Sales Report">
                    Yearly Sales Report
                  </option>
                  <option value="Customize Sales Report">
                    Customize Sales Report
                  </option>
                </optgroup>
              </select>
            </div>
            <p className="mb-2">Date Range</p>
            <div className="w-full flex justify-between mb-4 md:justify-start">
              <input
                type="date"
                className="w-36 p-3 border rounded-lg md:me-4"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <input
                type="date"
                className="w-36 p-3 border rounded-lg"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-6 w-full md:w-2/3 lg:w-1/2 mx-auto">
            <button className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700">
              Generate Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
