require("dotenv").config();
require("../config/db_config");
const bodyParser = require("body-parser");
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const homePageRoute = require("../routers/index");
const userRoute = require("../routers/userRoutes");
const orderRoute = require("../routers/orderRoutes");
const invoiceRoute = require("../routers/invoiceRoutes");
const cloudinary = require('cloudinary').v2;
const app = express();




app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cloudinary Configuration (make sure you've replaced with your credentials)
cloudinary.config({
    cloud_name: 'dr6vcennd',
    api_key: '274691982799748',
    api_secret: 'qJfZxD_mhW2vxbD3zwUxesovlvw',
  });


// Run every day at midnight
// cron.schedule('*/1 * * * *', async () => {
// // cron.schedule('0 0 * * *', async () => {
//   console.log('Running subscription check...');
//   const now = new Date();
  
//    let order = await Order.find(
//     { expiry_date: now.toISOString().split("T")[0] + "T19:00:00.000+00:00" , status: 'active' },
//    )

//   // Find subscriptions that are expired and set them to inactive
//   const expiredSubscriptions = await Order.updateMany(
//     { expiry_date: now.toISOString().split("T")[0] + "T19:00:00.000+00:00" , status: 'active' },
//     { $set: { status: 'inactive' } }
//   );

//   console.log(`${expiredSubscriptions.modifiedCount} subscriptions inactivated.`);
// });




//// ****** DEFINE ALL ROUTES HERE ******** ///////
app.use("/", homePageRoute);
app.use("/api/user", userRoute);
app.use("/api/order", orderRoute);
app.use("/api/invoice", invoiceRoute);

/////////////////////////////////////////////////






//////********** FOR Local Host ******//////////////
const PORT = process.env.PORT || "5000";
app.set("port", PORT);

var server = http.createServer(app);
server.on("listening", () => console.log("APP IS RUNNING ON PORT " + PORT));

server.listen(PORT);




//// for vercel deployment///////
// module.exports = app; // Export the Express app
