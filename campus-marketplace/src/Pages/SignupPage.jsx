import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Signup from "./Signup";
import * as authService from "../services/authService";

function SignupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSignupSubmit = async (formData) => {
    setLoading(true);
    try {
      const response = await authService.signup(
        formData.fullName,
        formData.email,
        formData.studentId,
        formData.password
      );
      alert(response.message || "Signup successful!");
      navigate("/login"); // Redirect to login
    } catch (error) {
      alert(error.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return <Signup onSubmit={handleSignupSubmit} />;
}

export default SignupPage;
