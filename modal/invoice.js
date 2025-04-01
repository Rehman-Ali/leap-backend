const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const Schema = mongoose.Schema;

const InvoiceSchema = new mongoose.Schema(
  {
    /// dp word is stand for Dynamic.xyz platfrom its prefix that uses in all site
    duration: {
      type: Number,
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
  },
  { timestamps: true }
);

const Invoice = mongoose.model("Invoice", InvoiceSchema);


exports.Invoice = Invoice;

