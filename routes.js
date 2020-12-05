const express = require("express")
const recipes = require("./controllers/recipes")
const consumer = require("./controllers/consumer")
const routes = express.Router()

routes.get("/", consumer.index)
routes.get("/recipes", consumer.recipes)
routes.get("/recipes/:index", consumer.show)
routes.get("/about", consumer.about)

routes.get("/admin/recipes", recipes.index); // Mostrar a lista de receitas
routes.get("/admin/recipes/create", recipes.create); // Mostrar formulário de nova receita
routes.get("/admin/recipes/:id", recipes.show); // Exibir detalhes de uma receita
routes.get("/admin/recipes/:id/edit", recipes.edit); // Mostrar formulário de edição de receita

routes.post("/admin/recipes", recipes.post); // Cadastrar nova receita
routes.put("/admin/recipes", recipes.put); // Editar uma receita
routes.delete("/admin/recipes", recipes.delete); // Deletar uma receita

routes.use(function (req, res) {
    res.status(404).render("not-found");
});

module.exports = routes