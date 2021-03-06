const Recipe = require("../models/Recipe")
const Chef = require("../models/Chef")

module.exports = {
    index(req, res) {
        Recipe.all(function (recipes) {

            return res.render("consumer/index", { recipes })
        })
    },
    recipes(req, res) {
        Recipe.all(function(recipes) {            
            return res.render("consumer/recipes", { recipes })
        })
    },
    chefs(req, res) {
        Chef.all(function (chefs) {

            return res.render("consumer/chefs", { chefs })
        })
    },
    show(req, res) {

        Recipe.find(req.params.index, function (recipe) {
            if (!recipe) return res.send("Recipe not found!")

            return res.render("consumer/show", { recipe })
        })
    },
    about(req, res) {
        return res.render("consumer/about")
    },
    search(req, res) {
        let { filter, page, limit } = req.query

        page = page || 1
        limit = limit || 2
        let offset = limit * (page - 1)

        const params = {
            filter,
            page,
            limit,
            offset,
            callback(recipes) {

                if(recipes == "") {
                    return res.send("Recipes not found")
                }

                const pagination = {
                    total: Math.ceil(recipes[0].total / limit),
                    page
                }

                return res.render("consumer/results", { recipes,
                pagination, filter })
            }
        }

        Recipe.paginate(params)
    }
}