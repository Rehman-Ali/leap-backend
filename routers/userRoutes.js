const express = require("express");
const userController = require("../controllers/userControllers");
const authentication = require("../middleware/auth");
const router = express.Router();



////////////////////////////////////
///////// REGITSER USER ///////////
////////////////////////////////////

router.route("/").get(userController.test);
router.route("/logout").post(userController.logout);
// router.route("/register").get(authentication.auth, userController.me);



module.exports = router;
