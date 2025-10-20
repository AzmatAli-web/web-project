 
// import './AdminDashboard.css';

function AdminAnalytics() {
  return (
    <div className="container mt-4 styling">
      <h2 className="text-center mb-4">📈 Admin Analytics</h2>

      <div className="row text-center">
        <div className="col-md-4 mb-3">
          <div className="card p-3 shadow-sm">
            <h4>120</h4>
            <p>Active Users</p>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card p-3 shadow-sm">
            <h4>87</h4>
            <p>Active Listings</p>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card p-3 shadow-sm">
            <h4>5</h4>
            <p>Reports Today</p>
          </div>
        </div>
      </div>

      <p className="text-center text-muted mt-3">
        (This is a simple summary. You can add charts or graphs later.)
      </p>
    </div>
  );
}

export default AdminAnalytics;
