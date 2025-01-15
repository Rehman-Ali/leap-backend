const mongoose = require("mongoose");

const NumberSchema = new mongoose.Schema(
  {
    number: {
      type: String,
    },
  },
  { timestamps: false }
);


const Number = mongoose.model("Number", NumberSchema);

exports.Number = Number;
