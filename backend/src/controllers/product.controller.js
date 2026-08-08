const productRepository = require("../repositories/product.repository");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const { foodCardImage } = require("../utils/foodCardImage");

const CATEGORY_EMOJI = { sweets: "\u{1F36C}", bakery: "\u{1F950}", drinks: "\u{1F964}" };

const list = asyncHandler(async (req, res) => {
  const { cat, search, minPrice, maxPrice, sort, limit } = req.query;

  let query = productRepository.findAll({
    cat: cat || undefined,
    search: search || undefined,
    minPrice: minPrice != null ? Number(minPrice) : undefined,
    maxPrice: maxPrice != null ? Number(maxPrice) : undefined,
    sort,
  });

  if (limit) query = query.limit(Number(limit));

  const products = await query;
  res.json({ products });
});

const getById = asyncHandler(async (req, res) => {
  const product = await productRepository.findById(req.params.id);
  if (!product) throw new ApiError(404, "Product not found.");
  res.json({ product });
});

const create = asyncHandler(async (req, res) => {
  const { name, cat, price, unit, desc, tag } = req.body || {};
  if (!name?.trim() || !cat || !price || Number(price) <= 0 || !unit?.trim() || !desc?.trim()) {
    throw new ApiError(400, "Name, category, price, unit and description are required.");
  }

  
  const image = req.file
    ? `/uploads/${req.file.filename}`
    : req.body.image?.trim() || foodCardImage(CATEGORY_EMOJI[cat] || "\u{1F36C}", cat);

  const product = await productRepository.create({
    name: name.trim(),
    cat,
    price: Number(price),
    unit: unit.trim(),
    desc: desc.trim(),
    image,
    tag: tag?.trim() || null,
  });

  res.status(201).json({ product });
});

const remove = asyncHandler(async (req, res) => {
  const product = await productRepository.deleteById(req.params.id);
  if (!product) throw new ApiError(404, "Product not found.");
  res.json({ ok: true });
});

module.exports = { list, getById, create, remove };
