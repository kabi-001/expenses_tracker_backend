import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
  type: String,
  required: true,
  unique: true,
  lowercase: true,
  index: true
},

    password: {
      type: String,
      required: true,
      minlength: 6
    },

    contact: {
      type: String,
      required: true
    },

    profile: {
      type: String,
      default: ""
    },

    otp: {
      type: Number,
      default: null
    },

    otpExpire: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

const user= mongoose.model(
  "user",
  userSchema
);

export default user;