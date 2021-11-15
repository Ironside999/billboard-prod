const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      trim: true,
      required: true,
    },
    caption: {
      type: String,
      trim: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    contentType: {
      type: String,
      required: true,
      enum: ["text", "video", "audio", "image"],
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
