const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
    },
    last_name: {
        type: String,
    },
    email:{
        type: String
    },
    dynamic_user_id:{
        type: String
    }
  },
  { timestamps: false }
);


const User = mongoose.model("User", UserSchema);

exports.User = User;
