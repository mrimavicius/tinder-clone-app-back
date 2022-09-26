const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const datingUsersSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    dob: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    photos: {
      type: [String],
      required: true,
    },
    myLikes: {
      type: [{}],
      required: false,
      default: [],
    },
    gotLikes: {
      type: [{}],
      required: false,
      default: [],
    },
    filter: {
      type: {},
      required: false,
      default: {
        city: "All",
        gender: "female",
        age_min: 18,
        age_max: 35,
      },
    },
  },
  { timestamps: true }
);

const DatingUser = mongoose.model("DatingUser", datingUsersSchema);

module.exports = DatingUser;
