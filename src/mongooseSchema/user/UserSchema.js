const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  avatar: {
    type: String,
  },
  sqlId: {
    type: String,
    index: true,
    unique: true,
  },
  blockList: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

// UserSchema.virtual("followers", {
//   ref: "Follower",
//   localField: "_id",
//   foreignField: "followedMe",
// });

// UserSchema.virtual("followings", {
//   ref: "Following",
//   localField: "_id",
//   foreignField: "iFollowed",
// });

// UserSchema.virtual("blockList", {
//   ref: "BlockList",
//   localField: "_id",
//   foreignField: "iBlock",
// });

const User = mongoose.model("User", UserSchema);

module.exports = User;
