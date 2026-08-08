const router = require("express").Router();
const { signup, login, me, listUsers } = require("../controllers/auth.controller");
const { protect, adminOnly } = require("../middlewares/auth.middleware");

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", protect, me);
router.get("/users", protect, adminOnly, listUsers);

module.exports = router;
