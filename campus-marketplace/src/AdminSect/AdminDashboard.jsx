import { useState, useEffect } from "react";
import service from "../services/adminStatsService";
export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setData(await service.getDashboardData());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);
  return (
    <section>
      <div className="section-heading">
        <div>
          <span className="eyebrow">THE BIG PICTURE</span>
          <h1>Marketplace overview.</h1>
        </div>
        <button
          className="button button-outline button-small"
          onClick={load}
          disabled={loading}
        >
          Refresh
        </button>
      </div>
      {error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : loading ? (
        <p role="status">Loading marketplace data…</p>
      ) : (
        <>
          <div className="admin-metrics">
            {[
              ["Members", data.totalUsers],
              ["Approved members", data.approvedUsers],
              ["Verified emails", data.verifiedUsers],
              ["Total listings", data.totalProducts],
            ].map(([label, value]) => (
              <div key={label}>
                <span>{label}</span>
                <strong>{value.toLocaleString()}</strong>
              </div>
            ))}
          </div>
          <div className="card p-4 mt-4">
            <h2 className="h5 mb-4">Listings by category</h2>
            {data.categories.length ? (
              data.categories.map((c) => (
                <div
                  className="d-flex justify-content-between border-bottom py-3"
                  key={c._id}
                >
                  <span className="text-capitalize">{c._id}</span>
                  <strong>{c.count}</strong>
                </div>
              ))
            ) : (
              <p>No listings have been published yet.</p>
            )}
          </div>
          <p className="small text-muted mt-4">
            These figures come from stored users and listings. Payment revenue,
            daily activity, and report analytics are not recorded by this
            version.
          </p>
        </>
      )}
    </section>
  );
}
