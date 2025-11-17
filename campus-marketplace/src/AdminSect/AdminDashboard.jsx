import React, { useState, useEffect } from "react";
import { z } from "zod";

// Zod validation schema
const dashboardSchema = z.object({
  totalUsers: z.number().nonnegative(),
  activeListings: z.number().nonnegative(),
  revenue: z.number().nonnegative(),
  pendingActions: z.number().nonnegative(),
});

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeListings: 0,
    revenue: 0,
    pendingActions: 0,
  });

  // Simulated API call
  useEffect(() => {
    const fakeApiData = {
      totalUsers: 1254,
      activeListings: 324,
      revenue: 12540,
      pendingActions: 18,
    };

    // Validate with Zod
    const result = dashboardSchema.safeParse(fakeApiData);

    if (result.success) {
      setStats(result.data);
    } else {
      console.error("Zod validation error:", result.error);
    }
  }, []);

  return (
    <div>
      <h1 className="mb-4">Dashboard</h1>
      <div className="row">

        <div className="col-md-3 mb-3">
          <div className="card text-bg-primary">
            <div className="card-body">
              <h3>{stats.totalUsers}</h3>
              <p>Total Users</p>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card text-bg-success">
            <div className="card-body">
              <h3>{stats.activeListings}</h3>
              <p>Active Listings</p>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card text-bg-warning">
            <div className="card-body">
              <h3>${stats.revenue}</h3>
              <p>Revenue</p>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card text-bg-danger">
            <div className="card-body">
              <h3>{stats.pendingActions}</h3>
              <p>Pending Actions</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
