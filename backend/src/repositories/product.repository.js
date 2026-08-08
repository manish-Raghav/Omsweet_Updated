const Product = require("../models/Product.model");

const productRepository = {
  create(data) {
    return Product.create(data);
  },

  findAll(filter = {}) {
    const query = {};
    if (filter.cat) query.cat = filter.cat;
    if (filter.search) {
      // A partial, case-insensitive match reads better for search-as-you-type
      // than Mongo's $text index, which only matches whole/stemmed words.
      const escaped = filter.search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const pattern = new RegExp(escaped, "i");
      query.$or = [{ name: pattern }, { desc: pattern }];
    }
    if (filter.minPrice != null || filter.maxPrice != null) {
      query.price = {};
      if (filter.minPrice != null) query.price.$gte = filter.minPrice;
      if (filter.maxPrice != null) query.price.$lte = filter.maxPrice;
    }

    let cursor = Product.find(query);

    switch (filter.sort) {
      case "price-low":
        cursor = cursor.sort({ price: 1 });
        break;
      case "price-high":
        cursor = cursor.sort({ price: -1 });
        break;
      case "name":
        cursor = cursor.sort({ name: 1 });
        break;
      case "top-sold":
      default:
        cursor = cursor.sort({ sold: -1 });
        break;
    }

    return cursor;
  },

  findById(id) {
    return Product.findById(id);
  },

  findByIds(ids) {
    return Product.find({ _id: { $in: ids } });
  },

  findTopSold(cat, limit = 4) {
    return Product.find({ cat }).sort({ sold: -1 }).limit(limit);
  },

  deleteById(id) {
    return Product.findByIdAndDelete(id);
  },

  bumpSoldCounts(items) {
    // items: [{ product: id, qty }]
    const ops = items.map(({ product, qty }) => ({
      updateOne: {
        filter: { _id: product },
        update: { $inc: { sold: qty } },
      },
    }));
    if (ops.length === 0) return Promise.resolve();
    return Product.bulkWrite(ops);
  },

  count() {
    return Product.countDocuments();
  },
};

module.exports = productRepository;
