const User = require('../models/User')
const { hash } = require('bcryptjs')

module.exports = {
    async index(req, res) {
        const user = await User.findOne(req.session.userId)

        return res.render('admin/profile/index', { user })
    },
    async put(req, res) {
        if (req.body.password) {
            let newPassword = await hash(req.body.password, 8)

            req.body.password = newPassword
        }

        await User.profileUpdate(req.body)
        console.log(req.body)

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