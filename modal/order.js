const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const Schema = mongoose.Schema;

const OrderSchema = new mongoose.Schema(
  {
    /// dp word is stand for Dynamic.xyz platfrom its prefix that uses in all site
    duration: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["active", "pending", "inactive", "cancelled", "expired"]
    },
    price: {
      type: Number
    },
    price_in_SOL: {
      type: Number
    },
    order_category: {
      type: String,
    },
    operating_system: {
      type: String,
      enum: ["windows", "linux"],
      allow: null
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
    },
    expiry_date:{
      type: Date
    },
    api_key:{
      type: String
    }
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);

function validateOrder(order) {
  const schema = Joi.object({
    user_id: Joi.objectId(),
    duration: Joi.number(),
    status: Joi.string(),
    price: Joi.number(),
    price_in_SOL: Joi.number(),
    order_category: Joi.string(),
    operating_system: Joi.string().allow(null),
    region: Joi.string(),
    plan: Joi.string(),
    expiry_date: Joi.date(),
    api_key: Joi.string(),
  });
  return schema.validate(order);
}
exports.Order = Order;
exports.validate = validateOrder;
