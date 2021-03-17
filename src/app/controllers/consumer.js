const Recipe = require("../models/Recipe")
const Chef = require("../models/Chef")

module.exports = {
    async index(req, res) {
        let recipes = await Recipe.all()
        let files = await Recipe.files()

        recipes = recipes.map((recipe, index) => {

            files.forEach((file) => {
                if (file.recipe_id == recipe.id && !recipe.image) {
                    recipe.image = (`${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)
                }
            })

            return recipe
        })

        return res.render("consumer/index", { recipes })
    },
    async recipes(req, res) {
        let recipes = await Recipe.all()
        let files = await Recipe.files()

        recipes = recipes.map((recipe) => {

            files.forEach((file) => {
                if (file.recipe_id == recipe.id && !recipe.image) {
                    recipe.image = (`${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)
                }
            })

            return recipe
        })

        return res.render("consumer/recipes", { recipes })
    },
    async chefs(req, res) {
        let chefs = await Chef.all()
        let files = await Chef.allFiles()

        chefs = await chefs.map(chef => {
            files.forEach(file => {
                if (file.id == chef.file_id && !chef.avatar_url) {
                    chef.avatar_url = (`${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)
                }
            })

            return chef
        })

        return res.render("consumer/chefs", { chefs })
    },
    async show(req, res) {
        let recipe = await Recipe.find(req.params.index)

        if (!recipe) return res.send("Recipe not found!")

        let recipeImages = await Recipe.files()

        recipeImages.filter(file => file.recipe_id == recipe.id).forEach(file => {
            if (!recipe.image) {
                recipe.image = (`${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)
            }
        })

        return res.render("consumer/show", { recipe })
    },
    about(req, res) {
        return res.render("consumer/about")
    },
    async search(req, res) {
        let { filter, page, limit } = req.query

        page = page || 1
        limit = limit || 2
        let offset = limit * (page - 1)

        const params = {
            filter,
            page,
            limit,
            offset
        }

        let recipes = await Recipe.paginate(params)

        if (recipes == "") {
            return res.send("Recipes not found")
        }

        const pagination = {
            total: Math.ceil(recipes[0].total / limit),
            page
        }

        return res.render("consumer/results", { recipes, pagination, filter })
    }
}