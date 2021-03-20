const { date } = require("../../lib/utils")
const { unlinkSync } = require('fs')

const Chef = require("../models/Chef")
const File = require("../models/File")

module.exports = {
    async index(req, res) {
        let results = await Chef.index()

        let chefs = results.map(chef => (
            {
                ...chef,
                src: `${req.protocol}://${req.headers.host}${chef.file_path.replace("public", "")}`
            }
        ))

        return res.render("admin/chefs/index", { chefs })
    },
    create(req, res) {
        return res.render("admin/chefs/create")
    },
    async show(req, res) {
        let allChefs = await Chef.all()
        let chef = allChefs.find(function (chef) {
            return chef.id == req.params.id
        })

        let file = await File.find(chef.file_id)
        let avatar_url = {
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }

        recipes = await Chef.chefRecipes(chef.id)

        return res.render("admin/chefs/show", { chef, recipes, avatar_url })
    },
    async edit(req, res) {
        let chef = await Chef.find(req.params.id)
        let file = await File.find(chef.file_id)

        return res.render("admin/chefs/edit", { chef, file })
    },
    async post(req, res) {
        if (req.body.name == "") {
            return res.render('admin/chefs/create', {
                chef: req.body,
                error: "Please complete all fields"
            })
        }

        if (req.files.length == 0) {
            return res.render('admin/chefs/create', {
                chef: req.body,
                error:"Please, send at least one image"
            })
        }

        let creatingFileReturningId = await File.create({ name: req.files[0].filename, path: req.files[0].path })

        let chef = {
            name: req.body.name,
            created_at: date(Date.now()).iso,
            file_id: creatingFileReturningId
        }

        let creatingChefReturningId = await Chef.create(chef)

        return res.redirect(`/admin/chefs/${creatingChefReturningId}`)
    },
    async put(req, res) {
        let results = ""
        let old_file = await File.find(req.body.old_avatar)

        if (req.body.name == "") {
            return res.render('admin/chefs/create', {
                chef: req.body,
                error: "Please complete all fields"
            })
        }

        if (req.files != "") {
            creatingFileReturningId = await File.create({ name: req.files[0].filename, path: req.files[0].path })

            let chef = {
                name: req.body.name,
                file_id: creatingFileReturningId
            }

            Chef.update(req.body.id, chef)

            await File.delete(old_file.id)

            unlinkSync(old_file.path)

            return res.redirect(`/admin/chefs/${req.body.id}`)
        }

        let chef = {
            name: req.body.name,
            file_id: req.body.old_avatar,
        }

        await Chef.update(req.body.id, chef)

        return res.redirect(`/admin/chefs/${req.body.id}`)
    },
    async delete(req, res) {
        let allChefs = await Chef.all()
        let chef = allChefs.find(chef => {
            return chef.id == req.body.id
        })

        let file = await File.find(chef.file_id)

        if (chef.total_recipes != 0) {
            return res.render('admin/chefs/edit', {
                chef,
                file,
                error: "Error: chefs who have recipes cannot be deleted"
            })
        }

        Chef.delete(chef.id)
        File.delete(file.id)

        unlinkSync(file.path)

        return res.redirect("/admin/chefs")
    }
}