const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
  longitude: {
    type: String,
  },
  latitude: {
    type: String,
  },
});

const Location = mongoose.model("Location", LocationSchema);

module.exports = Location;
