const User = require('../models/User')
const { hash } = require('bcryptjs')

module.exports = {
    async index(req, res) {
        const user = await User.find(req.session.userId)

        return res.render('admin/profile/index', { user })
    },
    async put(req, res) {
        if (req.body.password) {
            req.body.password = await hash(req.body.password, 8)
        }

        await User.update(req.body)

        let { name, email, id } = req.body
        let user = {
            id,
            name,
            email
        }

        return res.render('admin/profile/index', {
            user,
            success: 'Usuário editado com sucesso'
        })
    }
}