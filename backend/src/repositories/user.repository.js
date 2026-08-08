const User = require("../models/User.model");

const userRepository = {
  create(data) {
    return User.create(data);
  },

  findByEmail(email, { withPassword = false } = {}) {
    const query = User.findOne({ email: email.toLowerCase() });
    if (withPassword) query.select("+password");
    return query;
  },

  findById(id) {
    return User.findById(id);
  },

  findAll() {
    return User.find().sort({ createdAt: -1 });
  },

  countCustomers() {
    return User.countDocuments({ role: "user" });
  },
};

module.exports = userRepository;
