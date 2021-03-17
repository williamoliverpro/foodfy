const User = require('../models/User')
const { compare } = require('bcryptjs')

function checkAllFields(body) {
    const keys = Object.keys(body)

    for(key of keys) {
        if (body[key] == "") {
            return {
                user: body,
                error: 'Por favor, preencha todos os campos.'
            }
        }
    }
}

async function post(req, res, next) {
    const isAdmin = await User.findOne(req.session.userId)

    if (isAdmin.is_admin == false) {
        return res.redirect('/admin/profile')
    }

    const fillAllFields = checkAllFields(req.body)

    if(fillAllFields){
        return res.render("admin/user/create", fillAllFields)
    }

    let { email } = req.body

    const user = await User.findOneEmail(email)

    if (user) return res.render('admin/user/create', {
        user: req.body,
        error: 'Usuário já cadastrado.'
    })

    next()
}

async function update(req, res, next) {
    const isAdmin = await User.findOne(req.session.userId)

    if (isAdmin.is_admin == false) {
        return res.render('admin/profile/index', {
            user: isAdmin,
            error: 'Apenas administradores podem editar outros usuários'
        })
    }

    const fillAllFields = checkAllFields(req.body)

    if(fillAllFields){
        return res.render("admin/user/edit", fillAllFields)
    }

    const user = await User.findOne(req.body.id)
    const toCompareEmail = await User.findOneEmail(req.body.email)

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
    const user = await User.findOne(req.session.userId)

    if (user.is_admin == false) {
        return res.render('admin/profile/index', {
            user,
            error: 'Apenas administradores podem deletar usuários'
        })
    }

    if (user.is_admin == true && user.id == req.params.id) {
        let users = await User.all()
        
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