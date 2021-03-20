const Recipe = require("../models/Recipe")
const Chef = require("../models/Chef")
const User = require("../models/User")
const File = require("../models/File")
const { date, listRemove } = require("../../lib/utils")

function checkAllFields(body, chefsOptions) {
    const keys = Object.keys(body)

    for(key of keys) {
        if (body[key] == "") {
            return {
                recipe: body,
                chefsOptions,
                error: 'Por favor, preencha todos os campos.'
            }
        }
    }
}

module.exports = {
    async index(req, res) {
        let recipes = await Recipe.allFromUser(req.session.userId)
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
        // let results = await Recipe.chefsOptions()
        let chefsOptions = await Chef.findAll()

        return res.render("admin/recipes/create", { chefsOptions })
    },
    async show(req, res) {
        let recipe = await Recipe.find(req.params.id)

        if (!recipe) return res.send("Recipe not found!")

        let recipeImages = await Recipe.files()

        recipeImages = recipeImages
        .filter(image => image.recipe_id == recipe.id)
        .map(image => (
            {
                ...image,
                src: `${req.protocol}://${req.headers.host}${image.path.replace("public", "")}`
            }
        ))

        recipe = {
            ...recipe,
            images: recipeImages
        }

        return res.render("admin/recipes/show", { recipe })
    },
    async edit(req, res) {
        let recipe = await Recipe.find(req.params.id)

        if (!recipe) return res.send("Recipe not found!")

        let chefsOptions = await Chef.findAll()

        let recipeImages = await Recipe.files()

        recipeImages = recipeImages
        .filter(image => image.recipe_id == recipe.id)
        .map(image => (
            {
                ...image,
                src: `${req.protocol}://${req.headers.host}${image.path.replace("public", "")}`
            }
        ))

        recipe = {
            ...recipe,
            images: recipeImages
        }

        return res.render("admin/recipes/edit", { recipe, chefsOptions })
    },
    async post(req, res) {
        const isAdmin = await User.find(req.session.userId)
        const chefsOptions = await Chef.findAll()

        if (isAdmin.is_admin == false) {
            return res.redirect('/admin/profile')
        }

        const fillAllFields = checkAllFields(req.body, chefsOptions)

        if (fillAllFields){
            return res.render("admin/recipes/create", fillAllFields)
        }

        if (req.files.length == 0) return res.render('admin/recipes/create', {
            user: req.body,
            chefsOptions,
            error: 'Please, send at least one image'
        })

        let { chef_id, title, ingredients, preparation, information, created_at, user_id } = req.body

        let recipe = {
            chef_id, 
            title, 
            ingredients: listRemove(ingredients), 
            preparation: listRemove(preparation), 
            information, 
            created_at: date(Date.now()).iso, 
            user_id: req.session.userId
        }

        let recipeId = await Recipe.create(recipe)

        let results = req.files.map(async file => {
            fileId = await File.create({ name: file.filename, path: file.path })

            await Recipe.recipe_files(recipeId, fileId)
        })

        await Promise.all(results)

        return res.redirect(`/admin/recipes/${recipeId}`)
    },
    async put(req, res) {
        let results = ""
        const keys = Object.keys(req.body)

        for (let key of keys) {
            if (req.body[key] == "" && req.body.removed_files) {
                return res.render('admin/recipes/edit', {
                    recipe: req.body,
                    error: "Please complete all fields"
                })
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

        let { chef_id, title, ingredients, preparation, information, created_at, user_id, id } = req.body

        let recipe = {
            chef_id,
            title,
            ingredients: listRemove(ingredients),
            preparation: listRemove(preparation),
            information,
            id
        }

        Recipe.update(recipe)

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