const mongoose = require("mongoose");

const FollowerSchema = new mongoose.Schema(
  {
    followedMe: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Follower = mongoose.model("Follower", FollowerSchema);

module.exports = Follower;
