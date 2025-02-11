const express = require("express");
const articleController = require("../controllers/articleControllers");
const auth = require("../middleware/auth");
const router = express.Router();

const multer = require("multer");

// Set up multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/////////////////////////////////////////////
///////// CREATE Article /////////////////////
///////////////////////////////////////////

router
  .route("/")
  .post(auth, upload.single("image"), articleController.createArticle);
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

router.route("/:id").delete(auth, articleController.removeArticle);

module.exports = router;
