const express = require("express");
const articleRouter = require("./routes/articles");
const mongoose = require("mongoose");
const Article = require("./models/article");
const methodOverride = require("method-override");

mongoose.connect('mongodb+srv://prachikhaitan04:prachikhaitan04@cluster0.nvfbhxi.mongodb.net/?retryWrites=true&w=majority');

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

app.get("/", async (req, res) => {
  const articles = await Article.find().sort({ createdAt: "desc" });
  res.render("articles/index", { articles: articles });
});

app.get("/articles/edit/:id", async (req, res) => {
  const article = await Article.findById(req.params.id);
  res.render("articles/edit", { article: article });
});

// Define route to handle form submission for updating article
app.put("/articles/:id", async (req, res) => {
  const { title, content } = req.body;
  let article;

  try {
    article = await Article.findById(req.params.id);
    article.title = title;
    article.content = content;
    await article.save();
    res.redirect(`/articles/${article.id}`);
  } catch (error) {
    console.error(error);
    if (article == null) {
      res.redirect("/");
    } else {
      res.render("articles/edit", {
        article: article,
        errorMessage: "Error updating article",
      });
    }
  }
});

app.use("/articles", articleRouter);

app.listen(3000);