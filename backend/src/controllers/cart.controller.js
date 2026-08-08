const mongoose = require("mongoose");
const cartRepository = require("../repositories/cart.repository");
const productRepository = require("../repositories/product.repository");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");


function toCartMap(cartDoc) {
  const map = {};
  for (const item of cartDoc.items) {
    map[item.product.toString()] = item.qty;
  }
  return map;
}

const getMine = asyncHandler(async (req, res) => {
  const cart = await cartRepository.findOrCreate(req.user._id);
  res.json({ cart: toCartMap(cart) });
});

const addItem = asyncHandler(async (req, res) => {
  const { id, qty } = req.body || {};
  if (!mongoose.Types.ObjectId.isValid(id)) throw new ApiError(400, "Invalid product id.");

  const product = await productRepository.findById(id);
  if (!product) throw new ApiError(404, "Product not found.");

  const cart = await cartRepository.findOrCreate(req.user._id);
  const addQty = Math.max(1, Number(qty) || 1);
  const line = cart.items.find((i) => i.product.toString() === id);
  if (line) line.qty += addQty;
  else cart.items.push({ product: id, qty: addQty });

  await cart.save();
  res.json({ cart: toCartMap(cart) });
});

const incItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) throw new ApiError(400, "Invalid product id.");

  const cart = await cartRepository.findOrCreate(req.user._id);
  const line = cart.items.find((i) => i.product.toString() === id);
  if (line) {
    line.qty += 1;
  } else {
    const product = await productRepository.findById(id);
    if (!product) throw new ApiError(404, "Product not found.");
    cart.items.push({ product: id, qty: 1 });
  }

  await cart.save();
  res.json({ cart: toCartMap(cart) });
});

const decItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) throw new ApiError(400, "Invalid product id.");

  const cart = await cartRepository.findOrCreate(req.user._id);
  const idx = cart.items.findIndex((i) => i.product.toString() === id);
  if (idx !== -1) {
    const next = cart.items[idx].qty - 1;
    if (next <= 0) cart.items.splice(idx, 1);
    else cart.items[idx].qty = next;
  }

  await cart.save();
  res.json({ cart: toCartMap(cart) });
});

const removeItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) throw new ApiError(400, "Invalid product id.");

  const cart = await cartRepository.findOrCreate(req.user._id);
  cart.items = cart.items.filter((i) => i.product.toString() !== id);

  await cart.save();
  res.json({ cart: toCartMap(cart) });
});

const clear = asyncHandler(async (req, res) => {
  const cart = await cartRepository.findOrCreate(req.user._id);
  cart.items = [];
  await cart.save();
  res.json({ cart: {} });
});


const merge = asyncHandler(async (req, res) => {
  const { items } = req.body || {};
  if (!items || typeof items !== "object" || Array.isArray(items)) {
    throw new ApiError(400, "items map is required.");
  }

  const candidateIds = Object.keys(items).filter((id) => mongoose.Types.ObjectId.isValid(id));
  const validProducts = await productRepository.findByIds(candidateIds);
  const validIds = new Set(validProducts.map((p) => p._id.toString()));

  const cart = await cartRepository.findOrCreate(req.user._id);

  for (const [productId, rawQty] of Object.entries(items)) {
    if (!validIds.has(productId)) continue; // skip stale/removed products
    const qty = Math.max(0, Math.floor(Number(rawQty) || 0));
    if (qty <= 0) continue;

    const line = cart.items.find((i) => i.product.toString() === productId);
    if (line) line.qty += qty;
    else cart.items.push({ product: productId, qty });
  }

  await cart.save();
  res.json({ cart: toCartMap(cart) });
});

module.exports = { getMine, addItem, incItem, decItem, removeItem, clear, merge };
