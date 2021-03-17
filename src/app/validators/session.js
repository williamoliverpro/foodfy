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

async function login(req, res, next) {
    let isCheckAllFields = checkAllFields(req.body)

    if(isCheckAllFields) {
        return res.render('admin/session/login', {
            user: req.body,
            error: 'Complete all fields'
        })
    }

    const { email, password } = req.body

    const user = await User.findOneEmail(email)

    if (!user) return res.render("admin/session/login", {
        user: req.body,
        error: "Usuário não cadastrado!"
    })

    const passed = await compare(password, user.password)

    if(!passed) return res.render("admin/session/login", {
        user: req.body,
        error: "Senha incorreta."
    })

    req.user = user

    next()
}

async function forgot(req, res, next) {
    const { email } = req.body

    try {
        let user = await User.findOneEmail(email)

        if (!user) return res.render("admin/session/forgot-password", {
            user: req.body,
            error: "Usuário não cadastrado!"
        })

        req.user = user

        next()
    }catch(err) {
        console.error(err)
    }
}

async function reset(req, res, next) {
    const { email, password, token, passwordRepeat } = req.body

    const user = await User.findOneEmail(email)

    if (!user) return res.render("admin/session/reset-password", {
        user: req.body,
        token,
        error: "Usuário não cadastrado!"
    })

    // ver se o a senha bate
    if (password != passwordRepeat) return res.render('admin/session/reset-password', {
        user: req.body,
        token,
        error: 'A senha e a repetição da senha estão incorretas.'
    })

    // verificar se o token bate
    if (token != user.reset_token) return res.render('admin/session/reset-password', {
        user: req.body,
        token,
        error: 'Token inválido! Solicite uma nova recuperação de senha.'
    })

    // verificar se o token não expirou
    let now = new Date()
    now = now.setHours(now.getHours())

    if (now > user.reset_token_expires) return res.render('admin/session/reset-password', {
        user: req.body,
        token,
        error: 'Token expirado! Por favor, solicite uma nova recuperação de senha.'
    })

    req.user = user

    next()

}

module.exports = {
    login,
    forgot,
    reset
}