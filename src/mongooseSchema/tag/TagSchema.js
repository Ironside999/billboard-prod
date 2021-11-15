const mongoose = require("mongoose");

const TagSchema = new mongoose.Schema(
  {
    tag: {
      type: String,
      trim: true,
      required: true,
    },
    post: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  },
  {
    timestamps: true,
  }
);

const Tag = mongoose.model("Tag", TagSchema);

module.exports = Tag;
