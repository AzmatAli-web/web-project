import React from "react";
// import './AdminDashboard.css'; // reuse same style if you have it

function AdminReports() {
  // Example sample data — later you’ll fetch from backend
  const reports = [
    { id: 1, reporter: "Ali", target: "Book Listing #23", reason: "Inappropriate content", status: "Pending" },
    { id: 2, reporter: "Sara", target: "User JohnDoe", reason: "Spam messages", status: "Resolved" },
    { id: 3, reporter: "Hamza", target: "Laptop Listing #45", reason: "Incorrect information", status: "Pending" },
  ];

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

        <p className="text-center text-muted mt-3">
          (This is a static preview. You’ll later connect it to backend data.)
        </p>
      </div>
    </div>
  );
}

export default AdminReports;
