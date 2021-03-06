const express = require("express")
const recipes = require("./app/controllers/recipes")
const chefs = require("./app/controllers/chefs")
const consumer = require("./app/controllers/consumer")
const routes = express.Router()
const multer = require('./app/middlewares/multer')

routes.get("/", consumer.index)
routes.get("/about", consumer.about)
routes.get("/recipes", consumer.recipes)
routes.get("/chefs", consumer.chefs)
routes.get("/recipes/:index", consumer.show)
routes.get("/search", consumer.search)

routes.get("/admin/recipes", recipes.index) // Mostrar a lista de receitas
routes.get("/admin/recipes/create", recipes.create) // Mostrar formulário de nova receita
routes.get("/admin/recipes/:id", recipes.show) // Exibir detalhes de uma receita
routes.get("/admin/recipes/:id/edit", recipes.edit) // Mostrar formulário de edição de receita
routes.post("/admin/recipes", multer.array("photos", 5), recipes.post) // Cadastrar nova receita
routes.put("/admin/recipes", multer.array("photos", 5), recipes.put) // Editar uma receita
routes.delete("/admin/recipes", recipes.delete) // Deletar uma receita

routes.get("/admin/chefs", chefs.index)
routes.get("/admin/chefs/create", chefs.create)
routes.get("/admin/chefs/:id", chefs.show)
routes.get("/admin/chefs/:id/edit", chefs.edit)
routes.post("/admin/chefs", multer.array("photos", 1), chefs.post)
routes.put("/admin/chefs", multer.array("photos", 1), chefs.put)
routes.delete("/admin/chefs", chefs.delete)

routes.use(function (req, res) {
    res.status(404).render("not-found");
});

module.exports = routes