const mongoose = require("mongoose");

const FollowingSchema = new mongoose.Schema(
  {
    iFollowed: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    following: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Following = mongoose.model("Following", FollowingSchema);

module.exports = Following;
