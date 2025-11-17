// controllers/userController.js
let users = [
  { id: 1, name: "Azmat Ali", email: "azmat@example.com", role: "admin" },
  { id: 2, name: "Fatima Noor", email: "fatima@example.com", role: "user" },
  { id: 3, name: "Bilal Ahmed", email: "bilal@example.com", role: "user" },
];

exports.getUsers = (req, res) => {
  res.json(users);
};

exports.getUserById = (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

exports.deleteUser = (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return res.status(404).json({ message: "User not found" });

  users.splice(index, 1);
  res.json({ message: "User deleted successfully" });
};

exports.updateUser = (req, res) => {
  const id = parseInt(req.params.id);
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return res.status(404).json({ message: "User not found" });

  const { name, email, role } = req.body;
  users[index] = { ...users[index], name, email, role };
  res.json({ message: "User updated successfully", user: users[index] });
};
