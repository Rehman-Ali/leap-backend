const { Order, validate } = require("../modal/order");
const { User } = require("../modal/user");
const tryCatcheHanlder = require("../utils/tryCatch");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
// Replace with your Discord webhook URL
const DISCORD_WEBHOOK_URL =
  "https://discord.com/api/webhooks/1345489919438749807/CTlghvWGcLlwmTySNE7cc2sBE6PYdqXyvvxFbtadNv2NF73-kxnPe1II1LcLaPLIT4E9";

async function sendDiscordNotification(orderDetails) {
  try {
    const message = {
      content: `📦 **New Order Received!**\n
      **Order ID:** ${orderDetails._id}\n
      **Customer ID:** ${orderDetails.user_id}\n
      **Category:** ${orderDetails.order_category.toUpperCase()}\n
      **Duration:** ${orderDetails.duration / 30} month\n
      **Total USD:** $${orderDetails.price}\n
      **Total SOL:** ${orderDetails.price_in_SOL} SOL\n
      **Date:** ${new Date().toLocaleString()}`
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
    return res.status(400).json({ success: 0, message: "user is not existed" });
  }

  // if user new then save it to database and allow him to login
  const order = await Order.create({
    ...req.body,
    user_id: req.user.user_id,
    api_key: uuidv4()
  });

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
  const orders = await Order.find().sort({ createdAt: -1 });
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
    _id: req.params.id
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
    status: { $ne: "cancelled" } // Exclude orders with status 'cancelled'
  }).sort({ createdAt: -1 });
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
// exports.updateOrder = tryCatcheHanlder(async (req, res, next) => {
//   let order = await Order.findOne({ _id: req.params.id });
//   if (!order)
//     return res
//       .status(400)
//       .json({ success: 0, message: "No such order exists." });

//   let updateOder = await Order.updateOne(
//     { _id: req.params.id },
//     {
//       $set: req.body,
//     },
//     { new: true }
//   );
//   return res.status(200).json({
//     success: 1,
//     message: "Order has been updated successfully",
//     data: updateOder,
//   });
// });
exports.updateOrder = tryCatcheHanlder(async (req, res, next) => {
  // Find the order by ID
  let order = await Order.findOne({ _id: req.params.id });
  if (!order) {
    return res
      .status(400)
      .json({ success: 0, message: "No such order exists." });
  }

  // Check if the request includes duration for renewal
  // Calculate the new expiry date
  let newExpiryDate;
  console.log(req.body.duration, "newExpiryDate 2");

  // If the order is expired, calculate from current date
  if (order.expiry_date < new Date()) {
    newExpiryDate = new Date();
    console.log(newExpiryDate, "newExpiryDate 2");
  } else {
    // Otherwise, extend from the current expiry date
    newExpiryDate = new Date(order.expiry_date);
    console.log(newExpiryDate, "newExpiryDate 1");
  }

  // Add the duration (in days) to the expiry date
  newExpiryDate.setDate(newExpiryDate.getDate() + req.body.duration);
  console.log(newExpiryDate, "newExpiryDate");
  // Update the order with new expiry date and set status to active
  let updateOder = await Order.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        expiry_date: newExpiryDate,
        status: "active", // Set status to active when renewing
        ...req.body // Include other fields that might be updated
      }
    },
    { new: true }
  );

  return res.status(200).json({
    success: 1,
    message: "Order has been renewed successfully",
    data: updateOder
  });
});

////////////////////////////////////////////
///////// Extend & Reduced Order Expiry
///////////////////////////////////////////
exports.extentReducedOrderExpiry = tryCatcheHanlder(async (req, res, next) => {
  // Find the order by ID
  let order = await Order.findOne({ _id: req.params.id });
  if (!order) {
    return res
      .status(400)
      .json({ success: 0, message: "No such order exists." });
  }

  // Check if both actionType and duration are provided
  if (req.body.actionType && req.body.duration !== undefined) {
    let newExpiryDate;

    // Parse duration as a number to ensure proper calculation
    const durationDays = parseInt(req.body.duration, 10);

    // Validate duration is a positive number
    if (isNaN(durationDays) || durationDays <= 0) {
      return res
        .status(400)
        .json({ success: 0, message: "Duration must be a positive number." });
    }

    // Get the starting point for date calculation
    if (order.expiry_date < new Date() && req.body.actionType === "extended") {
      // If the order is expired and we're extending, start from current date
      newExpiryDate = new Date();
      console.log(newExpiryDate, "newExpiryDate - starting from current date");
    } else {
      // Otherwise, use the current expiry date
      newExpiryDate = new Date(order.expiry_date);
      console.log(newExpiryDate, "newExpiryDate - using existing expiry date");
    }

    // Calculate the new expiry date based on actionType
    if (req.body.actionType === "extended") {
      // Add days
      newExpiryDate.setDate(newExpiryDate.getDate() + durationDays);
    } else if (req.body.actionType === "reduced") {
      // Subtract days
      newExpiryDate.setDate(newExpiryDate.getDate() - durationDays);
    } else {
      return res
        .status(400)
        .json({
          success: 0,
          message: "actionType must be either 'extended' or 'reduced'."
        });
    }

    console.log(newExpiryDate, "newExpiryDate after adjustment");

    // Determine order status based on new expiry date
    const status = newExpiryDate > new Date() ? "active" : "expired";

    // Create update object
    const updateData = {
      expiry_date: newExpiryDate,
      status: status
    };

    // Add any other fields from req.body, but exclude actionType and duration
    const { actionType, duration, ...otherFields } = req.body;
    Object.assign(updateData, otherFields);

    // Update the order
    let updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    return res.status(200).json({
      success: 1,
      message: `Order expiry date has been ${req.body.actionType} by ${durationDays} days successfully`,
      data: updatedOrder
    });
  } 
});

/////////////////////////////////////////////////
/////////// Near to Expired Order 👤 ///////////
///////////////////////////////////////////////
exports.nearToExpiredOrder = tryCatcheHanlder(async (req, res, next) => {
  const orders = await Order.find({
    user_id: req.user.user_id,
    status: "active"
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
      arr.push(1);
    }
  }

  return res
    .status(200)
    .json({ success: 1, data: arr, message: "Get order no near to expire" });
});

//////////////////////////////////////////////
/////////// CHECK ORDER EXPIRY 👤 ///////////
////////////////////////////////////////////
exports.getAllOrderExpiry = tryCatcheHanlder(async (req, res, next) => {
  try {
    const now = new Date();
    const expiredSubscriptions = await Order.updateMany(
      {
        expiry_date: now.toISOString().split("T")[0] + "T19:00:00.000+00:00",
        status: "active"
      },
      { $set: { status: "active" } }
    );

    console.log(
      `${expiredSubscriptions.modifiedCount} subscriptions inactivated.`
    );

    return res.status(200).json({
      success: true,
      message: `${expiredSubscriptions.modifiedCount} subscriptions inactivated.`
    });
  } catch (error) {
    console.error("Error updating subscriptions:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});
