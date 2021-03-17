const express = require("express")
const routes = express.Router()

const consumer = require("../app/controllers/consumer")

routes.get("/", consumer.index)
routes.get("/about", consumer.about)
routes.get("/recipes", consumer.recipes)
routes.get("/chefs", consumer.chefs)
routes.get("/recipes/:index", consumer.show)
routes.get("/search", consumer.search)

module.exports = routes