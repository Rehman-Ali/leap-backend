const { Article, validate } = require("../modal/article");
const tryCatcheHanlder = require("../utils/tryCatch");

////////////////////////////////////////
/////////// Create Article 👤 ///////////
//////////////////////////////////////
exports.createArticle = tryCatcheHanlder(async (req, res, next) => {
  const { error } = validate(req.body);

  if (error) {
    return res.status(400).json({
      message: "Invalid data",
      error: error
    });
  }

  const articleExited = await Article.findOne({
    title: req.body.title
  });

  /// if user exist simple allow to him to login
  if (articleExited) {
    return res
      .status(400)
      .json({ success: 0, message: "Article existed with this title" });
  }

  const article = await Article.create(req.body);

  return res
    .status(200)
    .json({
      success: 1,
      data: article,
      message: "Article is added successfully"
    });
});

////////////////////////////////////////
/////////// GET all Article 👤 ///////////
//////////////////////////////////////
exports.getAllArticle = tryCatcheHanlder(async (req, res, next) => {
  const articles = await Article.find();

  return res
    .status(200)
    .json({ success: 1, data: articles, message: "Get all articles list." });
});

////////////////////////////////////////
/////////// GET single Article 👤 ///////////
//////////////////////////////////////
exports.getSingleArticle = tryCatcheHanlder(async (req, res, next) => {
  const article = await Article.findOne({
    _id: req.params.id
  });

  return res
    .status(200)
    .json({ success: 1, data: article, message: "Get article detail." });
});

////////////////////////////////////////
/////////// Remove Article 👤 ///////////
//////////////////////////////////////
exports.removeArticle = tryCatcheHanlder(async (req, res, next) => {
  const article = await Article.deleteOne({
    _id: req.params.id
  });

  return res
    .status(200)
    .json({ success: 1, message: "Article deleted successfully" });
});
