const mongoose = require("mongoose");
const isEmail = require("validator/lib/isEmail");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [isEmail, "Please enter a valid Email"],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  listingsArray: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
    },
  ],
});

// Cascade delete listings when a user is deleted
userSchema.pre("remove", async function (next) {
  await this.model("Listing").deleteMany({ userId: this._id });
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
