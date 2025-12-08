import React, { useState, useEffect } from "react";
import adminStatsService from '../services/adminStatsService';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newUsersThisMonth: 0,
    totalProducts: 0,
    availableProducts: 0,
    pendingProducts: 0,
    soldProducts: 0,
    totalTransactions: 0,
    revenue: 0,
    dailyActiveUsers: 0,
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data from backend
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Try to fetch all stats data
      const [userStats, productStats, transactionStats] = await Promise.all([
        adminStatsService.getUserStats().catch(() => ({})),
        adminStatsService.getProductStats().catch(() => ({})),
        adminStatsService.getTransactionStats().catch(() => ({})),
      ]);

      // Set stats from API response, with fallback to 0
      setStats({
        totalUsers: userStats.totalUsers || userStats.total || 0,
        activeUsers: userStats.activeUsers || userStats.active || 0,
        newUsersThisMonth: userStats.newThisMonth || 0,
        totalProducts: productStats.totalProducts || productStats.total || 0,
        availableProducts: productStats.available || 0,
        pendingProducts: productStats.pending || 0,
        soldProducts: productStats.sold || 0,
        totalTransactions: transactionStats.total || 0,
        revenue: transactionStats.revenue || 0,
        dailyActiveUsers: userStats.dailyActive || 0,
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard statistics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Dashboard</h1>
        <button className="btn btn-outline-primary btn-sm" onClick={fetchDashboardData} disabled={loading}>
          {loading ? '⏳ Refreshing...' : '🔄 Refresh'}
        </button>
      </div>

      {error && (
        <div className="alert alert-warning alert-dismissible fade show" role="alert">
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading dashboard statistics...</p>
        </div>
      ) : (
        <>
          {/* User Statistics Section */}
          <h5 className="mt-4 mb-3">👥 User Statistics</h5>
          <div className="row mb-4">
            <div className="col-md-3 mb-3">
              <div className="card text-bg-primary">
                <div className="card-body">
                  <h3>{stats.totalUsers}</h3>
                  <p>Total Users</p>
                </div>
              </div>
            </div>

            <div className="col-md-3 mb-3">
              <div className="card text-bg-info">
                <div className="card-body">
                  <h3>{stats.activeUsers}</h3>
                  <p>Active Users</p>
                </div>
              </div>
            </div>

            <div className="col-md-3 mb-3">
              <div className="card text-bg-success">
                <div className="card-body">
                  <h3>{stats.newUsersThisMonth}</h3>
                  <p>New This Month</p>
                </div>
              </div>
            </div>

            <div className="col-md-3 mb-3">
              <div className="card text-bg-secondary">
                <div className="card-body">
                  <h3>{stats.dailyActiveUsers}</h3>
                  <p>Daily Active Users</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Statistics Section */}
          <h5 className="mt-4 mb-3">📦 Product Statistics</h5>
          <div className="row mb-4">
            <div className="col-md-3 mb-3">
              <div className="card text-bg-primary">
                <div className="card-body">
                  <h3>{stats.totalProducts}</h3>
                  <p>Total Products</p>
                </div>
              </div>
            </div>

            <div className="col-md-3 mb-3">
              <div className="card text-bg-success">
                <div className="card-body">
                  <h3>{stats.availableProducts}</h3>
                  <p>Available</p>
                </div>
              </div>
            </div>

            <div className="col-md-3 mb-3">
              <div className="card text-bg-warning">
                <div className="card-body">
                  <h3>{stats.pendingProducts}</h3>
                  <p>Pending Approval</p>
                </div>
              </div>
            </div>

            <div className="col-md-3 mb-3">
              <div className="card text-bg-secondary">
                <div className="card-body">
                  <h3>{stats.soldProducts}</h3>
                  <p>Sold</p>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Statistics Section */}
          <h5 className="mt-4 mb-3">💰 Transaction Statistics</h5>
          <div className="row mb-4">
            <div className="col-md-6 mb-3">
              <div className="card text-bg-success">
                <div className="card-body">
                  <h3>{stats.totalTransactions}</h3>
                  <p>Total Transactions</p>
                </div>
              </div>
            </div>

            <div className="col-md-6 mb-3">
              <div className="card text-bg-warning">
                <div className="card-body">
                  <h3>Rs. {stats.revenue.toLocaleString()}</h3>
                  <p>Total Revenue</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
