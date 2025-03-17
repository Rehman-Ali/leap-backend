const { Invoice } = require("../modal/invoice");
const { User } = require("../modal/user");
const tryCatcheHanlder = require("../utils/tryCatch");

////////////////////////////////////////
/////////// Create Invoice 👤 ///////////
//////////////////////////////////////
exports.createInvoice = tryCatcheHanlder(async (req, res, next) => {


  const userExited = await User.findOne({
    _id: req.user.user_id
  });

  /// if user exist simple allow to him to login
  if (!userExited) {
    return res.status(400).json({ success: 0, message: "user is not existed" });
  }

  // if user new then save it to database and allow him to login
  const invoice = await Invoice.create({
    ...req.body,
    user_id: req.user.user_id
  });

  return res
    .status(200)
    .json({
      success: 1,
      data: invoice,
      message: "Invoice is added successfully"
    });
});

////////////////////////////////////////
/////////// GET all Invoice 👤 ///////////
//////////////////////////////////////
exports.getAllInvoice = tryCatcheHanlder(async (req, res, next) => {
  const invoice = await Invoice.find().sort({ createdAt: -1 });

  return res
    .status(200)
    .json({ success: 1, data: invoice, message: "Get all user invoice list." });
});

////////////////////////////////////////
/////////// GET single Invoice 👤 ///////////
//////////////////////////////////////
exports.getSingleInvoice = tryCatcheHanlder(async (req, res, next) => {
  const invoice = await Invoice.findOne({
    id: req.params.id
  });

  return res
    .status(200)
    .json({ success: 1, data: invoice, message: "Get invoice detail." });
});

////////////////////////////////////////
/////////// GET all User Invoices 👤 ///////////
//////////////////////////////////////
exports.getAllUserInvoice = tryCatcheHanlder(async (req, res, next) => {
  const invoice = await Invoice.find({
    user_id: req.user.user_id,
  }).sort({ createdAt: -1 });
 
  return res
    .status(200)
    .json({ success: 1, data: invoice, message: "Get all user order list." });
});
