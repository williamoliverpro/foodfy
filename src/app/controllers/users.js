const crypto = require('crypto')
const { hash } = require('bcryptjs')
const mailer = require('../../lib/mailer')
const User = require('../models/User')

module.exports = {
    async create(req, res) {
        return res.render('admin/user/create')
    },
    async post(req, res) {

        if (!req.body.is_admin) {
            req.body.is_admin = false
        } else {
            req.body.is_admin = true
        }

        const passwordWithoutHash = crypto.randomBytes(3).toString("hex")

        req.body.password = await hash(passwordWithoutHash, 8)

        await User.create(req.body)

        await mailer.sendMail({
            to: req.body.email,
            from: 'no-reply@foodfy.com',
            subject: 'Access link to your account',
            html: `<h2>Seu guia de acesso a sua conta</h2>
        <p>Olá ${req.body.name}, clique no link abaixo para acessar a sua conta</p>
        <p>Email: ${req.body.email}</p>
        <p>Password: ${passwordWithoutHash}</p>
        <>
            <a href="http://localhost:3000/users/login" target="_blank">
                Acessar conta
            </a>
        </>
        `
        })

        return res.render('admin/user/create', {
            success: 'Usuário criado com sucesso'
        })
    },
    async edit(req, res) {
        let user = await User.find(req.params.id)

        if (!user) {
            return res.render('admin/user/index', {
                error: 'User not found'
            })
        }

        return res.render('admin/user/edit', { user })
    },
    async put(req, res) {
        if (!req.body.is_admin) {
            req.body.is_admin = false
        } else {
            req.body.is_admin = true
        }

        await User.update(req.params.id, req.body)

        req.body.id = req.params.id

        return res.render('admin/user/edit', {
            user: req.body,
            success: 'Usuário editado com sucesso'
        })
    },
    async delete(req, res) {
        await User.delete(req.params.id)

        const users = await User.findAll()

        return res.render('admin/user/index', {
            users,
            success: 'Usuário deletado com sucesso'
        })
    },
    async list(req, res) {
        let users = await User.findAll()

        return res.render('admin/user/index', { users })
    }
}