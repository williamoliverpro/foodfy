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

async function update(req, res, next) {
    console.log(req.body)

    if (req.body.password == '') {
        req.body.password = undefined
    }

    const isFillAllFields = checkAllFields(req.body)

    if(isFillAllFields){
        return res.render("admin/profile/index", isFillAllFields)
    }

    const user = await User.findOne(req.body.id)
    const toCompareEmail = await User.findOneEmail(req.body.email)

    if (user.email != req.body.email && toCompareEmail) {
        return res.render('admin/profile/index', {
            user: req.body,
            error: 'Email já cadastrado.'
        })
    }

    req.user = user

    next()
}

module.exports = {
    update
}