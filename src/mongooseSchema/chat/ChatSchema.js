const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
  {
    chatName: {
      type: String,
      trim: true,
    },
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    removers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    blockedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ChatSchema.virtual("messages", {
  ref: "Message",
  localField: "_id",
  foreignField: "chat",
});

const Chat = mongoose.model("Chat", ChatSchema);

module.exports = Chat;
