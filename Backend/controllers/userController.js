const authCtrl = require('./authController');
// use same in-memory users
const users = authCtrl._internal.users;

exports.listUsers = (req, res) => {
  // do not send passwords
  const safe = users.map(u => ({ id: u.id, name: u.name, email: u.email }));
  res.json({ message: 'Users fetched successfully', users: safe });
};

exports.getUser = (req, res) => {
  const u = users.find(x => x.id === Number(req.params.id));
  if (!u) return res.status(404).json({ message: 'User not found' });
  res.json({ message: 'User fetched', user: { id: u.id, name: u.name, email: u.email } });
};

exports.updateUser = (req, res) => {
  const u = users.find(x => x.id === Number(req.params.id));
  if (!u) return res.status(404).json({ message: 'User not found' });
  const { name, email } = req.body;
  if (name !== undefined) u.name = name;
  if (email !== undefined) u.email = email;
  res.json({ message: 'User updated successfully', user: { id: u.id, name: u.name, email: u.email } });
};

exports.deleteUser = (req, res) => {
  const idx = users.findIndex(x => x.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ message: 'User not found' });
  users.splice(idx, 1);
  res.json({ message: 'User deleted successfully' });
};
