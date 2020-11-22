const express = require("express")
const nunjucks = require("nunjucks")
const recipes = require("./data")

const app = express()

app.set("view engine", "njk")
app.use(express.static("public"))

nunjucks.configure("views", {
    express: app,
    autoescape: false
})

app.get("/", function(req, res) {
    return res.render("index", { items: recipes })
})

app.get("/recipes", function(req, res) {
    return res.render("recipes", { items: recipes })
})

app.get("/recipes/:index", function(req, res) {
    const recipeIndex = req.params.index
  
    return res.render( "recipe", { item: recipes[recipeIndex] })
})

app.get("/about", function(req, res) {
    return res.render("about")
})

app.use(function (req, res) {
    res.status(404).render("not-found");
});

app.listen(5000)