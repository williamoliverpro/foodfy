const Recipe = require("../models/Recipe")
const File = require("../models/File")

module.exports = {
    async index(req, res) {
        let recipes = await Recipe.all()
        let files = await Recipe.files()
        let recipesFiltered = []

        recipes.map((recipe, index) => {
            recipesFiltered.push(recipe)

            recipesFiltered[index].image = []

            files.forEach(file => {
                if(file.recipe_id == recipe.id) {
                    recipesFiltered[index].image.push(`${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`)
                }
            })
        })

        return res.render("admin/recipes/index", { recipes: recipesFiltered})
    },
    async create(req, res) {
        let results = await Recipe.chefsOptions()

        return res.render("admin/recipes/create", { chefsOptions: results })
    },
    async show(req, res) {
        let results = await Recipe.find(req.params.id)

        if (!results) return res.send("Recipe not found!")

        let recipe = results

        results = await Recipe.files()

        let recipeImage = results.filter(image => image.recipe_id == recipe.id)

        recipeImage = recipeImage.map(image => (
            {
                ...image,
                src: `${req.protocol}://${req.headers.host}${image.path.replace("public", "")}`
            }
        ))

        recipe = {
            ...recipe,
            images: recipeImage
        }

        return res.render("admin/recipes/show", { recipe })
    },
    async edit(req, res) {
        let results = await Recipe.find(req.params.id)

        if (!results) return res.send("Recipe not found!")

        let recipe = results

        results = await Recipe.chefsOptions()

        let chefsOptions = results

        results = await Recipe.files()

        let recipeImage = results.filter(image => image.recipe_id == recipe.id)

        recipeImage = recipeImage.map(image => (
            {
                ...image,
                src: `${req.protocol}://${req.headers.host}${image.path.replace("public", "")}`
            }
        ))

        recipe = {
            ...recipe,
            images: recipeImage
        }

        return res.render("admin/recipes/edit", { recipe, chefsOptions })
    },
    async post(req, res) {
        const keys = Object.keys(req.body)

        for (let key of keys) {
            if (req.body[key] == "") {
                return res.send("Please complete all fields")
            }
        }

        if (req.files.length == 0) {
            return res.send("Please, send at least one image")
        }

        let results = await Recipe.create(req.body)

        recipe_id = results.id

        results = req.files.map(async file => {
            results = await File.create({ name: file.filename, path: file.path })
            let file_id = results

            results = await Recipe.recipe_files(recipe_id, file_id)
        })

        await Promise.all(results)

        return res.redirect(`/admin/recipes/${recipe_id}`)
    },
    async put(req, res) {
        const keys = Object.keys(req.body)
        let results = ""

        for (let key of keys) {
            if (req.body[key] == "" && req.body.removed_files) {
                return res.send("Please complete all fields")
            }
        }

        if (req.files.length != 0) {
            req.files.map(async file => {
                results = await File.create({ name: file.filename, path: file.path })
                let file_id = results

                results = await Recipe.recipe_files(req.body.id, file_id)
            })
        }

        if (req.body.removed_files != "") {

            const removedFiles = req.body.removed_files.split(",")
            const lastIndex = removedFiles.length - 1
            removedFiles.splice(lastIndex, 1)

            let allFiles = removedFiles.map(id => File.allAndUnlink(id))

            await Promise.all(allFiles)

            const RemoveFilesOnTableFilesRecipes = removedFiles.map(id => Recipe.FilesRecipesDelete(id))

            await Promise.all(RemoveFilesOnTableFilesRecipes)

            const removedFilesPromise = removedFiles.map(id => File.delete(id))

            await Promise.all(removedFilesPromise)
        }

        Recipe.update(req.body)

        return res.redirect(`/admin/recipes/${req.body.id}`)
    },
    async delete(req, res) {
        let results = await Recipe.files()
        let filteredData = results.filter(data => data.recipe_id == req.body.id)
        let unlinkFiles = filteredData.map(fileRecipe => File.allAndUnlink(fileRecipe.file_id))

        await Promise.all(unlinkFiles)

        let deleteRecipeFiles = filteredData.map(fileRecipe => Recipe.deleteFilesRecipes(fileRecipe.id))

        await Promise.all(deleteRecipeFiles)

        let deleteFilesPromise = filteredData.map(fileRecipe => File.delete(fileRecipe.file_id))

        await Promise.all(deleteFilesPromise)

        Recipe.delete(req.body.id)

        return res.redirect("/admin/recipes")
    }
}