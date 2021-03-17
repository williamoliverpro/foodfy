const User = require('../models/User')

const { hash } = require('bcryptjs')
const crypto = require('crypto')
const mailer = require('../../lib/mailer')

module.exports = {
    async loginForm(req, res) {
        return res.render('admin/session/login')
    },
    async login(req, res) {
        req.session.userId = req.user.id

        if (req.session.is_admin == false) {
            return res.redirect("/admin/profile")
        } else {
            return res.redirect("/admin/users")
        }

    },
    async forgotForm(req, res) {
        return res.render('admin/session/forgot-password')
    },
    async resetPasswordForm(req, res) {
        return res.render('admin/session/reset-password', { token: req.query.token })
    },
    async forgot(req, res) {
        const user = req.user
        console.log(user)

        try {
            // um token para esse usuário
            const token = crypto.randomBytes(20).toString("hex")

            // criar um expiração
            let now = new Date()
            now = now.setHours(now.getHours() + 1)

            user.reset_token = token
            user.reset_token_expires = now

            await User.update(user, user.id)

            // enviar um email com um link de recuperação de senha
            await mailer.sendMail({
                to: user.email,
                from: 'no-reply@launchstore.com.br',
                subject: 'Recuperação de senha',
                html: `<h2>Perdeu a chave?</h2>
            <p>Não se preocupe, clique no link abaixo para recuperar sua senha</p>
            <p>
                <a href="http://localhost:3000/password-reset?token=${token}" target="_blank">
                    RECUPERAR SENHA
                </a>
            </p>
            `,
            })

            // avisar o usuário que enviamos o email
            return res.render("admin/session/forgot-password", {
                success: "Verifique seu email para resetar sua senha!"
            })

        } catch (err) {
            console.error(err)
            return res.render("session/forgot-password", {
                error: "Erro inesperado, tente novamente!"
            })
        }


    },
    async reset(req, res) {
        const user = req.user

        const { password, token } = req.body

        try {
            // cria um novo hash de senha
            const newPassword = await hash(password, 8)

            // atualiza o usuário
            await User.updatePasswordReset(user.id, {
                password: newPassword,
                reset_token: "",
                reset_token_expires: "",
            })

            // avisa o usuário que ele tem uma nova senha
            return res.render("admin/session/login", {
                user: req.body,
                success: "Senha atualizada! Faça o seu login"
            })

        } catch (err) {
            console.error(err)
            return res.render("admin/session/reset-password", {
                user: req.body,
                token,
                error: "Erro inesperado, tente novamente!"
            })
        }
    },
    async logout(req, res) {
        req.session.destroy()

        return res.redirect("/login")
    }
}