const mongoose = require("mongoose");
const Joi = require("joi");

const UserSchema = new mongoose.Schema(
  {
    /// dp word is stand for Dynamic.xyz platfrom its prefix that uses in all site
    dp_user_id: {
      type: String
    },
    role: {
      type: String,
      enum: ["admin" ,"user"],
      default: "user"
    },
    status:{
      type: String,
      enum: ['active', 'inactive'],
      default: "active"
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

function validateUser(user) {
  const schema = Joi.object({
    dp_user_id: Joi.string(),
    role: Joi.string(),
    status: Joi.string(),
  });
  return schema.validate(user);
}
exports.User = User;
exports.validate = validateUser;
