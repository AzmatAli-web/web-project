import React, { useState } from "react";
import { z } from "zod";

// Zod schema for validating settings
const settingsSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  notifications: z.boolean(),
});

function AdminSettings() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    notifications: true,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = () => {
    const result = settingsSchema.safeParse(form);

    if (!result.success) {
      const formattedErrors = {};
      result.error.errors.forEach((err) => {
        formattedErrors[err.path[0]] = err.message;
      });
      setErrors(formattedErrors);
      return;
    }

    setErrors({});
    alert("Settings saved successfully! (Validated using Zod)");
  };

  return (
    <div className="container mt-4 styling">
      <h2 className="text-center mb-4">⚙️ Admin Settings</h2>

      <div className="card p-4 shadow-sm">

        {/* EMAIL */}
        <div className="mb-3">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
          />
          {errors.email && <small className="text-danger">{errors.email}</small>}
        </div>

        {/* PASSWORD */}
        <div className="mb-3">
          <label className="form-label">New Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={form.password}
            onChange={handleChange}
          />
          {errors.password && <small className="text-danger">{errors.password}</small>}
        </div>

        {/* NOTIFICATIONS */}
        <div className="form-check mb-3">
          <input
            type="checkbox"
            name="notifications"
            className="form-check-input"
            checked={form.notifications}
            onChange={handleChange}
          />
          <label className="form-check-label">Enable Email Notifications</label>
        </div>

        <button className="btn btn-primary mt-3" onClick={handleSubmit}>
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default AdminSettings;
