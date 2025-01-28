const { Order, validate } = require("../modal/order");
const { User } = require("../modal/user");
const tryCatcheHanlder = require("../utils/tryCatch");


////////////////////////////////////////
/////////// Create Order 👤 ///////////
//////////////////////////////////////
exports.createOrder = tryCatcheHanlder(async (req, res, next) => {
  
  console.log(req.body, req.user, "res body------")
   
  const { error } = validate(req.body);

  if (error) {
    return res.status(400).json({
      message: "Invalid data",
      error: error
    });
  }

  const userExited = await User.findOne({
    _id: req.user.user_id
  });

  /// if user exist simple allow to him to login
  if (!userExited) {
    return res.status(400).json({success: 0, message: "user is not existed"})
  }

  // if user new then save it to database and allow him to login
  const order = await Order.create({...req.body,  user_id:req.user.user_id});

  return res.status(200).json({success: 1,  data: order, message: "Order is added successfully"})
});




////////////////////////////////////////
/////////// GET all Order 👤 ///////////
//////////////////////////////////////
exports.getAllOrder = tryCatcheHanlder(async (req, res, next) => {
  
 

  const orders = await Order.findAll({
    user_id: req.user.id
  });

  return res.status(200).json({success: 1,  data: orders, message: "Get all order list."})
});


////////////////////////////////////////
/////////// GET single Order 👤 ///////////
//////////////////////////////////////
exports.getSingleOrder = tryCatcheHanlder(async (req, res, next) => {
  
  console.log(req.body, "res body------")

  const orders = await Order.findOne({
    id: req.body._id
  });

  return res.status(200).json({success: 1,  data: orders, message: "Get all order list."})
});

