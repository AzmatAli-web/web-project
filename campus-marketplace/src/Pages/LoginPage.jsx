import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Login from "./Login";
import * as authService from "../services/authService";

function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (formData) => {
    setLoading(true);
    try {
      const response = await authService.login(formData.email, formData.password);
      alert(response.message || "Login successful!");
      navigate("/"); // Redirect to home
    } catch (error) {
      alert(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return <Login onSubmit={handleLoginSubmit} />;
}

export default LoginPage;
