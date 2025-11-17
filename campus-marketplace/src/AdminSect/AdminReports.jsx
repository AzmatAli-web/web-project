import React, { useState, useEffect } from "react";
import { z } from "zod";

// Zod schema for ONE report
const reportSchema = z.object({
  id: z.number().int().positive(),
  reporter: z.string(),
  target: z.string(),
  reason: z.string(),
  status: z.enum(["Pending", "Resolved"]),
});

// Zod schema for array of reports
const reportListSchema = z.array(reportSchema);

function AdminReports() {
  const [reports, setReports] = useState([]);

  // Simulated backend fetch
  useEffect(() => {
    const fakeReports = [
      { id: 1, reporter: "Ali", target: "Book Listing #23", reason: "Inappropriate content", status: "Pending" },
      { id: 2, reporter: "Sara", target: "User JohnDoe", reason: "Spam messages", status: "Resolved" },
      { id: 3, reporter: "Hamza", target: "Laptop Listing #45", reason: "Incorrect information", status: "Pending" },
    ];

    const result = reportListSchema.safeParse(fakeReports);

    if (result.success) {
      setReports(result.data);
    } else {
      console.error("Zod report validation error:", result.error);
    }
  }, []);

  return (
    <div className="container mt-4 styling">
      <h2 className="text-center mb-4">📝 Admin Reports</h2>

      <div className="card shadow-sm p-3">
        <table className="table table-bordered table-striped">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Reporter</th>
              <th>Target</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td>{report.id}</td>
                <td>{report.reporter}</td>
                <td>{report.target}</td>
                <td>{report.reason}</td>
                <td>
                  <span
                    className={`badge ${
                      report.status === "Resolved" ? "bg-success" : "bg-warning text-dark"
                    }`}
                  >
                    {report.status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-sm btn-primary me-2">View</button>
                  <button className="btn btn-sm btn-success">Resolve</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminReports;
