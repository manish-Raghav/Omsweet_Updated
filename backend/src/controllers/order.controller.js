const crypto = require("crypto");
const orderRepository = require("../repositories/order.repository");
const productRepository = require("../repositories/product.repository");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

const DELIVERY_FEE = 40;
const FREE_DELIVERY_OVER = 999;


function toOrderResponse(orderDoc, { withCustomer = false } = {}) {
  const obj = orderDoc.toObject ? orderDoc.toObject() : orderDoc;
  return {
    id: obj.orderNumber,
    userName: withCustomer ? obj.user?.name : undefined,
    userEmail: withCustomer ? obj.user?.email : undefined,
    items: obj.items.map((i) => ({ id: i.product, name: i.name, qty: i.qty, price: i.price })),
    address: obj.address,
    paymentMethod: obj.paymentMethod,
    subtotal: obj.subtotal,
    deliveryFee: obj.deliveryFee,
    total: obj.total,
    status: obj.status,
    date: obj.createdAt,
  };
}

const create = asyncHandler(async (req, res) => {
  const { items, address, paymentMethod } = req.body || {};
  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, "Order must include at least one item.");
  }
  if (!address?.name || !address?.phone || !address?.address || !address?.city || !address?.pincode) {
    throw new ApiError(400, "A complete delivery address is required.");
  }


  const resolvedItems = [];
  for (const line of items) {
    const product = await productRepository.findById(line.id);
    if (!product) throw new ApiError(400, `Product ${line.id} no longer exists.`);
    const qty = Math.max(1, Number(line.qty) || 1);
    resolvedItems.push({ product: product._id, name: product.name, price: product.price, qty });
  }

  const subtotal = resolvedItems.reduce((s, i) => s + i.price * i.qty, 0);
  const deliveryFee = subtotal >= FREE_DELIVERY_OVER ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryFee;
  const orderNumber = "OM" + crypto.randomBytes(4).toString("hex").toUpperCase();

  const order = await orderRepository.create({
    user: req.user._id,
    orderNumber,
    items: resolvedItems,
    address,
    paymentMethod: paymentMethod || "cod",
    subtotal,
    deliveryFee,
    total,
  });

  await productRepository.bumpSoldCounts(
    resolvedItems.map((i) => ({ product: i.product, qty: i.qty }))
  );

  res.status(201).json({ order: toOrderResponse(order) });
});

const mine = asyncHandler(async (req, res) => {
  const orders = await orderRepository.findByUser(req.user._id);
  res.json({ orders: orders.map((o) => toOrderResponse(o)) });
});

const all = asyncHandler(async (req, res) => {
  const orders = await orderRepository.findAll();
  res.json({ orders: orders.map((o) => toOrderResponse(o, { withCustomer: true })) });
});

module.exports = { create, mine, all };
