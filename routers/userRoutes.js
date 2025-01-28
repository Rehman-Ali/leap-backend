const express = require("express");
const userController = require("../controllers/userControllers");
const authentication = require("../middleware/auth");
const router = express.Router();



/////////////////////////////////////////////
///////// SIGNUP AND SIGNIN USER ///////////
///////////////////////////////////////////

router.route("/signin-and-signup").post(userController.singinAndSignup);



module.exports = router;
