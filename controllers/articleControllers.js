const { Article } = require("../modal/article");
const tryCatcheHanlder = require("../utils/tryCatch");

const cloudinary = require("cloudinary").v2;

////////////////////////////////////////
/////////// Create Article 👤 ///////////
//////////////////////////////////////
// exports.createArticle = tryCatcheHanlder(async (req, res, next) => {

//    console.log(req.body,req.file, "req.body here====")

//   // const articleExited = await Article.findOne({
//   //   title: req.body.title
//   // });

//   // /// if user exist simple allow to him to login
//   // if (articleExited) {
//   //   return res
//   //     .status(400)
//   //     .json({ success: 0, message: "Article existed with this title" });
//   // }

//   // const article = await Article.create(req.body);

//   return res
//     .status(200)
//     .json({
//       success: 1,
//       // data: article,
//       message: "Article is added successfully"
//     });
// });

exports.createArticle = tryCatcheHanlder(async (req, res, next) => {
  console.log("Received files:", req.file);
  console.log("Received body:", req.body);

  // Check if file exists first
  if (!req.file) {
    return res.status(400).json({
      success: 0,
      message: "No image file uploaded"
    });
  }

  // Upload to Cloudinary
  const result = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => (error ? reject(error) : resolve(result))
    );

    uploadStream.end(req.file.buffer);
  });

  // Create article
  const article = await Article.create({
    ...req.body,
    image_url: result.secure_url
  });

  return res.status(201).json({
    success: 1,
    data: article,
    message: "Article created successfully"
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

////////////////////////////////////////
/////////// UPDATE Article 👤 ///////////
//////////////////////////////////////

exports.updateArticle = tryCatcheHanlder(async (req, res, next) => {
  // Check if file exists first
  if (!req.file) {
    await Article.updateOne(
      { _id: req.params.id },
      {
        $set: req.body
      },
      { new: true }
    );
    return res.status(200).json({
      success: 1,
      message: "Article has been updated successfully"
    });
  }

  // Upload to Cloudinary
  const result = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => (error ? reject(error) : resolve(result))
    );

    uploadStream.end(req.file.buffer);
  });

  // update article
  // const article = await Article.create({
  //   ...req.body,
  //   image_url: result.secure_url
  // });
  await Article.updateOne(
    { _id: req.params.id },
    {
      $set: {
        ...req.body,
        image_url: result.secure_url
      }
    },
    { new: true }
  );

  return res.status(201).json({
    success: 1,
    message: "Article created successfully"
  });
});
