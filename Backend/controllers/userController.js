// // controllers/userController.js
// let users = [
//   { id: 1, name: "Azmat Ali", email: "azmat@example.com", role: "admin" },
//   { id: 2, name: "Fatima Noor", email: "fatima@example.com", role: "user" },
//   { id: 3, name: "Bilal Ahmed", email: "bilal@example.com", role: "user" },
// ];

// exports.getUsers = (req, res) => {
//   res.json(users);
// };

// exports.getUserById = (req, res) => {
//   const user = users.find(u => u.id === parseInt(req.params.id));
//   if (!user) return res.status(404).json({ message: "User not found" });
//   res.json(user);
// };

// exports.deleteUser = (req, res) => {
//   const id = parseInt(req.params.id);
//   const index = users.findIndex(u => u.id === id);
//   if (index === -1) return res.status(404).json({ message: "User not found" });

//   users.splice(index, 1);
//   res.json({ message: "User deleted successfully" });
// };

// exports.updateUser = (req, res) => {
//   const id = parseInt(req.params.id);
//   const index = users.findIndex(u => u.id === id);
//   if (index === -1) return res.status(404).json({ message: "User not found" });

//   const { name, email, role } = req.body;
//   users[index] = { ...users[index], name, email, role };
//   res.json({ message: "User updated successfully", user: users[index] });
// };


const db = require('../config/database'); // Import once

const getUsers = (req, res) => {
  // Remove passwords from response
  const usersWithoutPasswords = db.users.map(user => ({
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt
  }));
  
  res.json(usersWithoutPasswords);
};

const getUserById = (req, res) => {
  const user = db.users.find(u => u.id === parseInt(req.params.id));
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Remove password from response
  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
};

const getCurrentUser = (req, res) => {
  const user = db.users.find(u => u.id === req.user.userId);
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Remove password from response
  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
};

module.exports = { getUsers, getUserById, getCurrentUser };