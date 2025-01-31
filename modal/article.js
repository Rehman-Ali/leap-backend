const mongoose = require("mongoose");
const Joi = require("joi");

const ArticlesSchema = new mongoose.Schema(
  {
    image_url: {
      type: String
    },
    category:{
      type: String
    },
    title:{
      type: String
    },
    written_by:{
      type: String
    },
    content:{
      type: String
    }
  },
  { timestamps: true }
);

const Article = mongoose.model("Article", ArticlesSchema);

function validateArticle(article) {
  const schema = Joi.object({
    image_url: Joi.string(),
    category: Joi.string(),
    title: Joi.string(),
    written_by: Joi.string(),
    content: Joi.string(),
  });
  return schema.validate(article);
}
exports.Article = Article;
exports.validate = validateArticle;
