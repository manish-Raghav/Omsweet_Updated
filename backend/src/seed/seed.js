require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User.model");
const Product = require("../models/Product.model");
const Order = require("../models/Order.model");
const SEED_PRODUCTS = require("./products.data");

async function run() {
  await connectDB();

  console.log("Clearing existing products and orders...");
  await Product.deleteMany({});
  await Order.deleteMany({});

  console.log(`Seeding ${SEED_PRODUCTS.length} products...`);
  await Product.insertMany(SEED_PRODUCTS);

  const adminEmail = process.env.ADMIN_EMAIL || "admin@omsweet.com";
  const existingAdmin = await User.findOne({ email: adminEmail });

  if (!existingAdmin) {
    console.log(`Creating admin account (${adminEmail})...`);
    await User.create({
      name: process.env.ADMIN_NAME || "Om Admin",
      email: adminEmail,
      password: process.env.ADMIN_PASSWORD || "admin123",
      role: "admin",
    });
  } else {
    console.log("Admin account already exists, leaving it as-is.");
  }

  console.log("Seed complete.");
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
