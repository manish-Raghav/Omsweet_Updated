const Cart = require("../models/Cart.model");

const cartRepository = {
  findByUser(userId) {
    return Cart.findOne({ user: userId });
  },

  async findOrCreate(userId) {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = await Cart.create({ user: userId, items: [] });
    return cart;
  },
};

module.exports = cartRepository;
