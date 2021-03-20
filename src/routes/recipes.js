const express = require("express")
const routes = express.Router()
const { onlyUsers, onlyAdmin } = require('../app/middlewares/session')
const RecipeValidator = require('../app/validators/recipe')

const recipes = require("../app/controllers/recipes")
const multer = require('../app/middlewares/multer')

routes.get("/", onlyUsers, recipes.index) // Mostrar a lista de receitas
routes.get("/create", onlyAdmin, recipes.create) // Mostrar formulário de nova receita
routes.get("/:id", recipes.show) // Exibir detalhes de uma receita
routes.get("/:id/edit", onlyAdmin, recipes.edit) // Mostrar formulário de edição de receita
routes.post("/", multer.array("photos", 5), recipes.post) // Cadastrar nova receita
routes.put("/", multer.array("photos", 5), recipes.put) // Editar uma receita
routes.delete("/", recipes.delete) // Deletar uma receita

module.exports = routes