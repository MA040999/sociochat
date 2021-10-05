const router = require("express").Router();
const authController = require("../controllers/auth-controller");

const { auth } = require("../middleware/authMiddleware");

router.post("/signup", authController.createUser);
router.post("/login", authController.authenticateUser);
router.get("/logout", authController.logout);
router.get("/verify-auth", auth, authController.verifyAuth);
router.put("/update-profile", auth, authController.updateProfile);
router.get("/refresh-token", authController.verifyRefreshToken);

module.exports = router;
