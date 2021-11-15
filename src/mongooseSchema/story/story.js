const mongoose = require("mongoose");

const StorySchema = new mongoose.Schema(
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
    storyBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    contentType: {
      type: String,
      required: true,
      enum: ["text", "video", "audio", "image"],
    },
    views: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

const Story = mongoose.model("Story", StorySchema);

module.exports = Story;
