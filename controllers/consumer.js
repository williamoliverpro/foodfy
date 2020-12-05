const data = require("../data.json")

exports.index = function(req, res) {
    return res.render("consumer/index", { items: data.recipes })
}

exports.recipes = function(req, res) {
    return res.render("consumer/recipes", { items: data.recipes })
}

exports.show = function(req, res) {
    const recipeIndex = req.params.index
  
    return res.render("consumer/show", { item: data.recipes[recipeIndex] })
}

exports.about = function(req, res) {
    return res.render("consumer/about")
}