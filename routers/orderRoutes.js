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

router.route("/all").get(auth, orderController.getAllOrder);

/////////////////////////////////////////////
///////// GET SINGLE ORDER /////////////////
///////////////////////////////////////////

router.route("/get-single/:id").get(auth, orderController.getSingleOrder);

///////////////////////////////////////////////
///////// GET ORER Of USER ///////////////////
/////////////////////////////////////////////

router.route("/user").get(auth, orderController.getAllUserOrder);

///////////////////////////////////////////////
///////// UPDATE ORDER ///////////////////////
/////////////////////////////////////////////

router.route("/update/:id").put(auth, orderController.updateOrder);


///////////////////////////////////////////////
///////// UPDATE ORDER ///////////////////////
/////////////////////////////////////////////

router.route("/extend-reduce/:id").put(auth, orderController.extentReducedOrderExpiry);



///////////////////////////////////////////////
///////// GET to near to expire ORDER ///////////////////////
/////////////////////////////////////////////

router.route("/near-to-expire").get(auth, orderController.nearToExpiredOrder);



///////////////////////////////////////////////////////////////////////////
///////// CHECK EXPIRY DATE AND INACTIVE THE ORDER ///////////////////////
/////////////////////////////////////////////////////////////////////////

router.route("/check-expiry").get(orderController.getAllOrderExpiry);


module.exports = router;
