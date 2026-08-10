const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");

const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");
const cartRoutes = require("./routes/cart.routes");
const { notFound, errorHandler } = require("./middlewares/error.middleware");

const app = express();

const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((s) => s.trim());

app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "3mb" })); // headroom for base64 image uploads from the admin form

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// Serves files saved by the multer upload middleware (see upload.middleware.js)
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/api/health", (req, res) => res.json({ ok: true, service: "omsweet-backend" }));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
