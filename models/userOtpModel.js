const mongoose = require("mongoose");

const otpSchema = mongoose.Schema(
  {
    otp: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("otp", otpSchema);
