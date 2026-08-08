const router = require("express").Router();
const { create, mine, all } = require("../controllers/order.controller");
const { protect, adminOnly } = require("../middlewares/auth.middleware");

router.post("/", protect, create);
router.get("/mine", protect, mine);
router.get("/", protect, adminOnly, all);

module.exports = router;
