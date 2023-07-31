const express = require("express");
const {
  getNotifications,
  setNotifications,
} = require("../controllers/notificationControllers");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.route("/").get(protect, getNotifications);
router.route("/set").post(protect, setNotifications);

module.exports = router;
