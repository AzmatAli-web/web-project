import { useState, useEffect } from "react";
import adminStatsService from '../services/adminStatsService';

function AdminAnalytics() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalProducts: 0,
    availableProducts: 0,
    pendingProducts: 0,
    soldProducts: 0,
    totalTransactions: 0,
    revenue: 0,
    mostActiveCategory: 'N/A',
    monthlyGrowthRate: 0,
    totalReports: 0,
    reportsToday: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch analytics data from backend
  const fetchAnalyticsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [userStats, productStats, transactionStats, platformStats] = await Promise.all([
        adminStatsService.getUserStats().catch(() => ({})),
        adminStatsService.getProductStats().catch(() => ({})),
        adminStatsService.getTransactionStats().catch(() => ({})),
        adminStatsService.getPlatformStats().catch(() => ({})),
      ]);

      setStats({
        totalUsers: userStats.totalUsers || userStats.total || 0,
        activeUsers: userStats.activeUsers || userStats.active || 0,
        totalProducts: productStats.totalProducts || productStats.total || 0,
        availableProducts: productStats.available || 0,
        pendingProducts: productStats.pending || 0,
        soldProducts: productStats.sold || 0,
        totalTransactions: transactionStats.total || 0,
        revenue: transactionStats.revenue || 0,
        mostActiveCategory: productStats.mostActiveCategory || 'N/A',
        monthlyGrowthRate: platformStats.monthlyGrowthRate || 0,
        totalReports: platformStats.totalReports || 0,
        reportsToday: platformStats.reportsToday || 0,
      });
    } catch (err) {
      console.error("Error fetching analytics data:", err);
      setError("Failed to load analytics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  return (
    <div className="container-fluid styling">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>📈 Admin Analytics</h2>
        <button className="btn btn-outline-primary btn-sm" onClick={fetchAnalyticsData} disabled={loading}>
          {loading ? '⏳ Loading...' : '🔄 Refresh'}
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
          <p className="mt-2 text-muted">Loading analytics...</p>
        </div>
      ) : (
        <>
          {/* User Analytics */}
          <h5 className="mt-4 mb-3">👥 User Analytics</h5>
          <div className="row text-center mb-4">
            <div className="col-md-4 mb-3">
              <div className="card p-3 shadow-sm">
                <h4>{stats.totalUsers}</h4>
                <p>Total Users</p>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card p-3 shadow-sm">
                <h4>{stats.activeUsers}</h4>
                <p>Active Users</p>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card p-3 shadow-sm">
                <h4>{stats.totalTransactions}</h4>
                <p>Total Transactions</p>
              </div>
            </div>
          </div>

          {/* Product Analytics */}
          <h5 className="mt-4 mb-3">📦 Product Analytics</h5>
          <div className="row text-center mb-4">
            <div className="col-md-3 mb-3">
              <div className="card p-3 shadow-sm">
                <h4>{stats.totalProducts}</h4>
                <p>Total Products</p>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card p-3 shadow-sm">
                <h4>{stats.availableProducts}</h4>
                <p>Available</p>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card p-3 shadow-sm">
                <h4>{stats.pendingProducts}</h4>
                <p>Pending Approval</p>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card p-3 shadow-sm">
                <h4>{stats.soldProducts}</h4>
                <p>Sold Products</p>
              </div>
            </div>
          </div>

          {/* Platform Analytics */}
          <h5 className="mt-4 mb-3">📊 Platform Analytics</h5>
          <div className="row text-center mb-4">
            <div className="col-md-4 mb-3">
              <div className="card p-3 shadow-sm">
                <h4>Rs. {stats.revenue.toLocaleString()}</h4>
                <p>Total Revenue</p>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card p-3 shadow-sm">
                <h4>{stats.mostActiveCategory}</h4>
                <p>Most Active Category</p>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card p-3 shadow-sm">
                <h4>{stats.monthlyGrowthRate}%</h4>
                <p>Monthly Growth Rate</p>
              </div>
            </div>
          </div>

          {/* Reports Analytics */}
          <h5 className="mt-4 mb-3">📋 Reports & Issues</h5>
          <div className="row text-center">
            <div className="col-md-6 mb-3">
              <div className="card p-3 shadow-sm">
                <h4>{stats.totalReports}</h4>
                <p>Total Reports</p>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <div className="card p-3 shadow-sm">
                <h4>{stats.reportsToday}</h4>
                <p>Reports Today</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminAnalytics;
