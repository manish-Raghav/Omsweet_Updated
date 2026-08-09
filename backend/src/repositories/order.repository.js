const Order = require("../models/Order.model");

const orderRepository = {
  create(data) {
    return Order.create(data);
  },

  findByUser(userId) {
    return Order.find({ user: userId }).sort({ createdAt: -1 });
  },

  findAll() {
    return Order.find().populate("user", "name email").sort({ createdAt: -1 });
  },

  findById(id) {
    return Order.findById(id).populate("user", "name email");
  },

  count() {
    return Order.countDocuments();
  },

  sumRevenue() {
    return Order.aggregate([
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]).then((rows) => rows[0]?.total || 0);
  },
};

module.exports = orderRepository;
