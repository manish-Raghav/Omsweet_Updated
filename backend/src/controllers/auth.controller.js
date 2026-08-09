const userRepository = require("../repositories/user.repository");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

function toSafeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name?.trim() || !email?.trim() || !password || password.length < 6) {
    throw new ApiError(400, "Name, a valid email and a password (6+ chars) are required.");
  }

  const existing = await userRepository.findByEmail(email);
  if (existing) throw new ApiError(409, "An account with this email already exists.");

  const user = await userRepository.create({
    name: name.trim(),
    email: email.trim(),
    password,
    role: "user",
  });

  res.status(201).json({ token: generateToken(user), user: toSafeUser(user) });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) throw new ApiError(400, "Email and password are required.");

  const user = await userRepository.findByEmail(email, { withPassword: true });
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Incorrect email or password.");
  }

  res.json({ token: generateToken(user), user: toSafeUser(user) });
});

const me = asyncHandler(async (req, res) => {
  res.json({ user: toSafeUser(req.user) });
});

const listUsers = asyncHandler(async (req, res) => {
  const users = await userRepository.findAll();
  res.json({ users: users.map(toSafeUser) });
});

module.exports = { signup, login, me, listUsers, toSafeUser };
