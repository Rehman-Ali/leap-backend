const express = require("express");
const articleController = require("../controllers/articleControllers");
const auth = require("../middleware/auth");
const router = express.Router();



/////////////////////////////////////////////
///////// CREATE Article /////////////////////
///////////////////////////////////////////

router.route("/").post(articleController.createArticle);
// router.route("/").post(auth, articleController.createArticle);

/////////////////////////////////////////////
///////// GET ALL Article ///////////////////
///////////////////////////////////////////

router.route("/all").get(articleController.getAllArticle);
// router.route("/all").get(auth,articleController.getAllArticle);

/////////////////////////////////////////////
///////// GET SINGLE Article /////////////////
///////////////////////////////////////////

router.route("/:id").get(articleController.getSingleArticle);
// router.route("/get-single").get(auth,articleController.getSingleArticle);


/////////////////////////////////////////////
///////// Remove Article /////////////////
///////////////////////////////////////////

router.route("/get-single").delete(auth,articleController.getSingleArticle);




module.exports = router;
