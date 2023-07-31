const mongoose = require("mongoose");

const notificationModel = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationModel);

module.exports = Notification;
