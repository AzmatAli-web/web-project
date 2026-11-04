import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import authService from "./services/authService";
import AdminDashboard from "./AdminSect/AdminDashboard";
import ManageUsers from "./AdminSect/ManageUsers";
import ManageListings from "./AdminSect/ManageListings";
export default function Admin() {
  const [tab, setTab] = useState("overview");
  const user = authService.getCurrentUser();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin")
    return (
      <main className="site-width collection-message">
        <h1>Admin access required.</h1>
        <Link to="/browse" className="button button-dark">
          Explore the marketplace
        </Link>
      </main>
    );
  return (
    <main className="site-width admin-layout">
      <aside>
        <span className="eyebrow">MARKETPLACE ADMIN</span>
        <h2>Control room.</h2>
        <div className="admin-tabs">
          {[
            ["overview", "Overview"],
            ["users", "Members"],
            ["listings", "Listings"],
          ].map(([id, label]) => (
            <button
              key={id}
              aria-pressed={tab === id}
              className={tab === id ? "active" : ""}
              onClick={() => setTab(id)}
            >
              {label}
              <span>↗</span>
            </button>
          ))}
        </div>
      </aside>
      <div className="admin-content">
        {tab === "overview" ? (
          <AdminDashboard />
        ) : tab === "users" ? (
          <ManageUsers />
        ) : (
          <ManageListings />
        )}
      </div>
    </main>
  );
}
