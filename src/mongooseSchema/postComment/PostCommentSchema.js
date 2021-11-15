const mongoose = require("mongoose");

const PostCommentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      trim: true,
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "PostComment" }],
  },
  {
    timestamps: true,
  }
);

const PostComment = mongoose.model("PostComment", PostCommentSchema);

module.exports = PostComment;
