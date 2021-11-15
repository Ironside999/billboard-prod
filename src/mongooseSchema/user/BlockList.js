const mongoose = require("mongoose");

const BlockListSchema = new mongoose.Schema(
  {
    iBlock: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isBlocked: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const BlockList = mongoose.model("BlockList", BlockListSchema);

module.exports = BlockList;
