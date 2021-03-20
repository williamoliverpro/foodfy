const User = require('../models/User')

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
    if (req.body.password == '') {
        req.body.password = undefined
    }

    const isFillAllFields = checkAllFields(req.body)

    if (isFillAllFields){
        return res.render("admin/profile/index", isFillAllFields)
    }

    const user = await User.find(req.body.id)
    const toCompareEmail = await User.findOne({where: { email: req.body.email }})

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