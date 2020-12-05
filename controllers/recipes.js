const data = require("../data.json")
const fs = require("fs")
const { listRemove } = require("../utils")

exports.index = function (req, res) {
   return res.render("admin/index", { items: data.recipes }) 
}

exports.create = function (req, res) {
    return res.render("admin/create")
}

exports.show = function (req, res) {
    const recipeId = req.params.id
    let recipeFound = data.recipes[recipeId]

    if(!recipeFound) {
        return res.send("Recipe not found")
    }
    
    recipeFound.id = recipeId

    return res.render("admin/show", { item: recipeFound })
}

exports.edit = function (req, res) {
    const recipeId = req.params.id
    let recipeFound = data.recipes[recipeId]

    if(!recipeFound) {
        return res.send("Recipe not found")
    }
    
    recipeFound.id = recipeId

    return res.render("admin/edit", { item: recipeFound })
}

exports.post = function (req, res) {    
    const keys = Object.keys(req.body)


    for (let key of keys) {
        if (req.body[key] == "") {
            return res.send("Please complete all fields")
        }
    }

    let { image, title, author, ingredients, preparation, information } = req.body

    let recipe = {
        image,
        title,
        author,
        ingredients,
        preparation,
        information
    }

    data.recipes.push(recipe)

    let lastRecipe =  data.recipes.length - 1
    
    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if (err) res.send("An error occurred while writing the file")

        return res.redirect(`/admin/recipes/${lastRecipe}`)
    })
}

exports.put = function (req, res) {
    let { id } = req.body

    let { image, title, author, ingredients, preparation, information } = req.body

    let recipe = {
        image,
        title,
        author,
        ingredients: listRemove(req.body.ingredients),
        preparation: listRemove(req.body.preparation),
        information
    }

    data.recipes[id] = recipe

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if (err) res.send("An error occurred while writing the file")

        return res.redirect(`/admin/recipes/${id}`)
    })
}

exports.delete = function (req, res) {
    const { id } = req.body

    const filterRecipes = data.recipes.filter(function(recipe, index) {
        return index != id
    })

    data.recipes = filterRecipes

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if (err) res.send("An error occurred while writing the file")

        return res.redirect(`/admin/recipes`)
    })
}