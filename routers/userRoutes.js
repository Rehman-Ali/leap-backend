const express = require("express");
const userController = require("../controllers/userControllers");
const auth = require("../middleware/auth");
const router = express.Router();

/////////////////////////////////////////////
///////// SIGNUP AND SIGNIN USER ///////////
///////////////////////////////////////////

router.route("/signin-and-signup").post(userController.singinAndSignup);

/////////////////////////////////////////////
///////// GET all user  ///////////
///////////////////////////////////////////

router.route("/all").get(auth, userController.allUser);

module.exports = router;
