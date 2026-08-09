const router = require("express").Router();
const { getMine, addItem, incItem, decItem, removeItem, clear, merge } = require("../controllers/cart.controller");
const { protect } = require("../middlewares/auth.middleware");

router.use(protect);

router.get("/", getMine);
router.post("/items", addItem);
router.patch("/items/:id/inc", incItem);
router.patch("/items/:id/dec", decItem);
router.delete("/items/:id", removeItem);
router.delete("/", clear);
router.post("/merge", merge);

module.exports = router;
