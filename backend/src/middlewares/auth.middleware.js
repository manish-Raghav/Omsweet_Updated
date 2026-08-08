const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const userRepository = require("../repositories/user.repository");


const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    throw new ApiError(401, "Not authorized \u2014 no token provided");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new ApiError(401, "Not authorized \u2014 invalid or expired token");
  }

  const user = await userRepository.findById(decoded.id);
  if (!user) {
    throw new ApiError(401, "Not authorized \u2014 user no longer exists");
  }

  req.user = user;
  next();
});


const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    throw new ApiError(403, "Admin access required");
  }
  next();
};

module.exports = { protect, adminOnly };
