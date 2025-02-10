const { Order, validate } = require("../modal/order");
const { User } = require("../modal/user");
const tryCatcheHanlder = require("../utils/tryCatch");
const axios = require("axios");

// Replace with your Discord webhook URL
const DISCORD_WEBHOOK_URL = "https://canary.discord.com/api/webhooks/1338613668241211412/eE399Z9LoZ4NcUkxOAOoXBlrDk02c-gW-OBdj1QqMfMukMI3ZgU35rF5HGcjMRMdEsQP";
  // "https://discord.com/api/webhooks/1338599658196566066/yzpTN2UbGrfRNJT3WfBFQn7WDzgZhcWWpok7QFks6DFe2h3FPDI7i8U3cn9nSplTpfap";

async function sendDiscordNotification(orderDetails) {
  try {
    const message = {
      content: `📦 **New Order Received!**\n
      **Order ID:** ${orderDetails._id}\n
      **Customer ID:** ${orderDetails.user_id}\n
      **Category:** ${orderDetails.order_category.toUpperCase()}\n
      **Duration:** ${orderDetails.duration/30} month\n
      **Total USD:** $${orderDetails.price}\n
      **Total SOL:** ${orderDetails.price_in_SOL} SOL\n
      **Date:** ${new Date().toLocaleString()}`,
    };

    await axios.post(DISCORD_WEBHOOK_URL, message);
    console.log("Discord notification sent.");
  } catch (error) {
    console.error("Error sending Discord notification:", error);
  }
}

////////////////////////////////////////
/////////// Create Order 👤 ///////////
//////////////////////////////////////
exports.createOrder = tryCatcheHanlder(async (req, res, next) => {
  console.log(req.body, req.user, "res body------");

  const { error } = validate(req.body);

  if (error) {
    return res.status(400).json({
      message: "Invalid data",
      error: error,
    });
  }

  const userExited = await User.findOne({
    _id: req.user.user_id,
  });

  /// if user exist simple allow to him to login
  if (!userExited) {
    return res.status(400).json({ success: 0, message: "user is not existed" });
  }

  // if user new then save it to database and allow him to login
  const order = await Order.create({ ...req.body, user_id: req.user.user_id });

  // Send notification to Discord
  await sendDiscordNotification(order);

  return res
    .status(200)
    .json({ success: 1, data: order, message: "Order is added successfully" });
});

////////////////////////////////////////
/////////// GET all Order 👤 ///////////
//////////////////////////////////////
exports.getAllOrder = tryCatcheHanlder(async (req, res, next) => {
  const orders = await Order.find();
  let arr = [];

  for (var i = 0; i < orders.length; i++) {
    // Calculate the service end date
    const serviceEndDate = new Date(orders[i].expiry_date);

    // Set the reminder date (2 days before the service ends)
    const reminderDate = new Date(serviceEndDate);
    reminderDate.setDate(reminderDate.getDate() - 2);
    // Get th1e current date
    const currentDate = new Date();
    // Check if today is the reminder date or later
    if (currentDate >= reminderDate) {
      arr.push({ ...orders[i]._doc, isExpiryNear: true });
    } else {
      arr.push({ ...orders[i]._doc, isExpiryNear: false });
    }
  }

  return res
    .status(200)
    .json({ success: 1, data: arr, message: "Get all user order list." });
});

////////////////////////////////////////
/////////// GET single Order 👤 ///////////
//////////////////////////////////////
exports.getSingleOrder = tryCatcheHanlder(async (req, res, next) => {
  const orders = await Order.findOne({
    id: req.params.id,
  });

  return res
    .status(200)
    .json({ success: 1, data: orders, message: "Get all order list." });
});

////////////////////////////////////////
/////////// GET all User Order 👤 ///////////
//////////////////////////////////////
exports.getAllUserOrder = tryCatcheHanlder(async (req, res, next) => {
  const orders = await Order.find({
    user_id: req.user.user_id,
    status: { $ne: "cancelled" }, // Exclude orders with status 'cancelled'
  });
  let arr = [];

  for (var i = 0; i < orders.length; i++) {
    // Calculate the service end date
    const serviceEndDate = new Date(orders[i].expiry_date);

    // Set the reminder date (2 days before the service ends)
    const reminderDate = new Date(serviceEndDate);
    reminderDate.setDate(reminderDate.getDate() - 2);
    // Get th1e current date
    const currentDate = new Date();
    // Check if today is the reminder date or later
    if (currentDate >= reminderDate) {
      arr.push({ ...orders[i]._doc, isExpiryNear: true });
    } else {
      arr.push({ ...orders[i]._doc, isExpiryNear: false });
    }
  }

  return res
    .status(200)
    .json({ success: 1, data: arr, message: "Get all user order list." });
});

////////////////////////////////////////
/////////// Update Order 👤 ///////////
//////////////////////////////////////
exports.updateOrder = tryCatcheHanlder(async (req, res, next) => {
  let order = await Order.findOne({ _id: req.params.id });
  if (!order)
    return res
      .status(400)
      .json({ success: 0, message: "No such order exists." });

  let updateOder = await Order.updateOne(
    { _id: req.params.id },
    {
      $set: req.body,
    },
    { new: true }
  );
  return res.status(200).json({
    success: 1,
    message: "Order has been updated successfully",
    data: updateOder,
  });
});

/////////////////////////////////////////////////
/////////// Near to Expired Order 👤 ///////////
///////////////////////////////////////////////
exports.nearToExpiredOrder = tryCatcheHanlder(async (req, res, next) => {
  const orders = await Order.find({
    user_id: req.user.user_id,
    status: "active",
  });

  console.log(orders[1].expiry_date, "order list");

  let arr = [];
  for (var i = 0; i < orders.length; i++) {
    // Calculate the service end date
    const serviceEndDate = new Date(orders[i].expiry_date);

    // Set the reminder date (2 days before the service ends)
    const reminderDate = new Date(serviceEndDate);
    reminderDate.setDate(reminderDate.getDate() - 2);
    // Get th1e current date
    const currentDate = new Date();
    // Check if today is the reminder date or later
    if (currentDate >= reminderDate) {
      arr.push(1);
    }
  }

  return res
    .status(200)
    .json({ success: 1, data: arr, message: "Get order no near to expire" });
});
