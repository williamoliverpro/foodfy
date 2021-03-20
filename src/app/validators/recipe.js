const User = require('../models/User')
const Chef = require('../models/Chef')

async function checkAllFields(body, chefsOptions) {
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

async function post(req, res, next) {
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
        error: 'Please, send at least one image'
    })

    next()
}

async function update(req, res, next) {
    const isAdmin = await User.find(req.session.userId)

    if (isAdmin.is_admin == false) {
        return res.render('admin/profile/index', {
            user: isAdmin,
            error: 'Apenas administradores podem editar outros usuários'
        })
    }

    const fillAllFields = checkAllFields(req.body)

    if (fillAllFields){
        return res.render("admin/user/edit", fillAllFields)
    }

    const user = await User.find(req.body.id)
    const toCompareEmail = await User.findOne({where: { email: req.body.email }})

    if (user.email != req.body.email && toCompareEmail) {
        return res.render('admin/user/edit', {
            user: req.body,
            error: 'Email já cadastrado.'
        })
    }

    req.user = user

    next()
}

async function del(req, res, next) {
    const user = await User.find(req.session.userId)

    if (user.is_admin == false) {
        return res.render('admin/profile/index', {
            user,
            error: 'Apenas administradores podem deletar usuários'
        })
    }

    if (user.is_admin == true && user.id == req.params.id) {
        let users = await User.findAll()
        
        return res.render('admin/user/index', {
            users,
            error: 'Um administrador não pode ser deletado'
        })
    }

    next()
}

module.exports = {
    post,
    update,
    del
}