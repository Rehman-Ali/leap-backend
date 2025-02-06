const express = require("express");
const orderController = require("../controllers/orderControllers");
const auth = require("../middleware/auth");
const router = express.Router();



/////////////////////////////////////////////
///////// CREATE ORDER /////////////////////
///////////////////////////////////////////

router.route("/create").post(auth, orderController.createOrder);

/////////////////////////////////////////////
///////// GET ALL ORDERS ///////////////////
///////////////////////////////////////////

router.route("/all").get(orderController.getAllOrder);

/////////////////////////////////////////////
///////// GET SINGLE ORDER /////////////////
///////////////////////////////////////////

router.route("/get-single").get(orderController.getSingleOrder);


/////////////////////////////////////////////
///////// GET ORER Of USER /////////////////
///////////////////////////////////////////

router.route("/user").get(orderController.getAllUserOrder);





module.exports = router;
