const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const Notification = require("../models/notificationModel");

//@description     Get all notifications
//@route           GET /api/notification
//@access          Protected
const getNotifications = asyncHandler(async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.params.userId,
    });
    console.log(notifications);
    res.json(notifications);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//@description     Set Notifications
//@route           POST /api/notification/
//@access          Protected
const setNotifications = asyncHandler(async (req, res) => {
  const { messages, user } = req.body;
  console.log(user);
  console.log(messages);

  if (!messages || !user) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  try {
    // Find or create the notification document for the user
    let notification = await Notification.findOne({ user: user });
    if (!notification) {
      notification = new Notification({ user: user, messages: [] });
    }

    // Map the messages array to a new array with the required format
    const formattedMessages = messages.map((message) => ({
      _id: message._id,
    }));

    console.log(formattedMessages);

    // Replace the existing messages array with the formatted messages
    notification.messages = formattedMessages;

    // Save the updated notification document
    await notification.save();

    return {
      success: true,
      message: "Messages saved successfully.",
      messages: formattedMessages,
    };
  } catch (error) {
    return { success: false, error: "Failed to save messages." };
  }

  //   try {
  //     await Notification.findByIdAndUpdate(req.body.userId, {
  //       messages: messages,
  //     });

  //     console.log(messages);

  //     res.json(messages);
  //   } catch (error) {
  //     console.log(error.message);
  //     res.status(404);

  //     throw new Error(error.message);
  //   }
});

module.exports = { getNotifications, setNotifications };
