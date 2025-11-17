import { useState, useEffect } from "react";
import { z } from "zod";

// ZOD schema for validating admin analytics data
const analyticsSchema = z.object({
  users: z.number().nonnegative(),
  listings: z.number().nonnegative(),
  reports: z.number().nonnegative(),
});

function AdminAnalytics() {
  const [stats, setStats] = useState({
    users: 0,
    listings: 0,
    reports: 0,
  });

  // Simulate fetching analytics data from backend
  useEffect(() => {
    const fakeApiData = {
      users: 120,
      listings: 87,
      reports: 5,
    };

    // Validate with Zod
    const result = analyticsSchema.safeParse(fakeApiData);

    if (result.success) {
      setStats(result.data);
    } else {
      console.error("Validation failed:", result.error);
    }
  }, []);

  return (
    <div className="container mt-4 styling">
      <h2 className="text-center mb-4">📈 Admin Analytics</h2>

      <div className="row text-center">

        <div className="col-md-4 mb-3">
          <div className="card p-3 shadow-sm">
            <h4>{stats.users}</h4>
            <p>Active Users</p>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card p-3 shadow-sm">
            <h4>{stats.listings}</h4>
            <p>Active Listings</p>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card p-3 shadow-sm">
            <h4>{stats.reports}</h4>
            <p>Reports Today</p>
          </div>
        </div>

      </div>

      <p className="text-center text-muted mt-3">
        (Validated using Zod. Data can be fetched from API later.)
      </p>
    </div>
  );
}

export default AdminAnalytics;
