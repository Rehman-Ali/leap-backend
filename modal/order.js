const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const Schema = mongoose.Schema;

const OrderSchema = new mongoose.Schema(
  {
    /// dp word is stand for Dynamic.xyz platfrom its prefix that uses in all site
    duration: {
      type: String,
    },
    status: {
      type: String,
      enum: ["cancelled", "pending", "success"]
    },
    price: {
      type: String
    },
    price_in_SOL: {
      type: String
    },
    order_category: {
      type: String,
      enum: ["vps", "rpc"]
    },
    operating_system: {
      type: String,
      enum: ["windows", "linux"]
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    region: {
      type : String
    },
    plan:{
      type: String
    }
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);

function validateOrder(order) {
  const schema = Joi.object({
    user_id: Joi.objectId(),
    duration: Joi.string(),
    status: Joi.string(),
    price: Joi.string(),
    price_in_SOL: Joi.string(),
    order_category: Joi.string(),
    operating_system: Joi.string(),
    region: Joi.string(),
    plan: Joi.string(),
  });
  return schema.validate(order);
}
exports.Order = Order;
exports.validate = validateOrder;
