// Simple in-memory "users" just for demo
const users = []; // persists while server runs
let idCounter = 1;

function createMockToken(user) {
  // simple mock token (not secure) — fine for demo
  return `mock-token-${user.id}-${Date.now()}`;
}

exports.signup = (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }
  const found = users.find(u => u.email === email);
  if (found) {
    return res.status(400).json({ message: 'Email already registered (in-memory)' });
  }

  const newUser = { id: idCounter++, name: name || 'NoName', email, password };
  users.push(newUser);

  const token = createMockToken(newUser);
  return res.status(201).json({ message: 'Signup successful', user: { id: newUser.id, name: newUser.name, email: newUser.email }, token });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const token = createMockToken(user);
  return res.json({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email }, token });
};

// expose users for userController (not exported normally, but easy)
exports._internal = { users };
