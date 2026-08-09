const router = require("express").Router();
const { list, getById, create, remove } = require("../controllers/product.controller");
const { protect, adminOnly } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

router.get("/", list);
router.get("/:id", getById);
router.post("/", protect, adminOnly, upload.single("image"), create);
router.delete("/:id", protect, adminOnly, remove);

module.exports = router;
