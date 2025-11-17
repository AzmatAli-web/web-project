// controllers/authController.js

exports.signup = (req, res) => {
  const { fullName, email, studentId, password } = req.body;

  // Basic validation
  if (!fullName || !email || !studentId || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // In a real app, you'd hash the password and save to DB
  // For now, just return success
  return res.status(200).json({
    message: "Signup successful! You can now login."
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  // In a real app, you'd verify against DB and generate JWT token
  // For now, generate a mock token
  const mockToken = "Bearer_token_" + Math.random().toString(36).substr(2, 9);

  return res.status(200).json({
    message: "Login successful!",
    token: mockToken,
    user: {
      id: 1,
      email: email,
      name: "Test User"
    }
  });
};
