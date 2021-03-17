const express = require("express")
const routes = express.Router()
const recipes = require('./recipes')
const consumer = require('./consumer')
const chefs = require('./chefs')
const users = require('./users')

routes.use('/', consumer)
routes.use('/admin/recipes', recipes)
routes.use('/admin/chefs', chefs)
routes.use('/', users)

routes.use(function (req, res) {
    res.status(404).render("not-found");
});

module.exports = routes