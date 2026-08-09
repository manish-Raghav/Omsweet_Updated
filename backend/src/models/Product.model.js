const mongoose = require("mongoose");
const applyIdTransform = require("../utils/applyIdTransform");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    cat: {
      type: String,
      required: true,
      enum: ["sweets", "bakery", "drinks"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },
    unit: {
      type: String,
      required: [true, "Unit / pack size is required"],
      trim: true,
    },
    desc: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    image: {
      type: String, // relative path served from /uploads, or a full URL
      default: "",
    },
    tag: {
      type: String,
      default: null,
    },
    sold: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

productSchema.index({ cat: 1 });
productSchema.index({ name: "text", desc: "text" });

applyIdTransform(productSchema);

module.exports = mongoose.model("Product", productSchema);
