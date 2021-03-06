const { listRemove } = require("../../lib/utils")
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
        let results = await Chef.all()
        let chef = results.find(function (chef) {
            return chef.id == req.params.id
        })
        let file = await Chef.files(chef.file_id)
        let avatar_url = {
            ...file,
            src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`
        }

        Chef.chefRecipes(chef.id, function (recipes) {

            return res.render("admin/chefs/show", { chef, recipes, avatar_url })
        })
    },
    async edit(req, res) {
        let chef = await Chef.find(req.params.id)
        let file = await Chef.files(chef.file_id)

        return res.render("admin/chefs/edit", { chef, file })
    },
    async post(req, res) {
        if (req.body.name == "") {
            return res.send("Please complete all fields")
        }

        if (req.files.length == 0) {
            return res.send("Please, send at least one image")
        }

        let results = await File.create({ name: req.files[0].filename, path: req.files[0].path })

        Chef.create(req.body, results, function (chef) {
            return res.redirect(`/admin/chefs/${chef.id}`)
        })
    },
    async put(req, res) {
        let results = ""
        let old_file = await Chef.files(req.body.old_avatar)

        if (req.body.name == "") {
            return res.send("Please complete all fields")
        }

        if (req.files != "") {
            results = await File.create({ name: req.files[0].filename, path: req.files[0].path })

            Chef.update(req.body, results)

            results = await File.delete(old_file.id)

            unlinkSync(old_file.path)

            return res.redirect(`/admin/chefs/${req.body.id}`)
        }

        Chef.update(req.body, req.body.old_avatar)

        return res.redirect(`/admin/chefs/${req.body.id}`)
    },
    async delete(req, res) {
        let results = await Chef.all()
        let chef = results.find(chef => {
            return chef.id == req.body.id
        })
        let file = await Chef.files(chef.file_id)

        if (chef.total_recipes != 0) {
            return res.send("Error: chefs who have recipes cannot be deleted")
        }

        Chef.delete(chef.id)

        File.delete(file.id)

        unlinkSync(file.path)

        return res.redirect("/admin/chefs")
    }
}