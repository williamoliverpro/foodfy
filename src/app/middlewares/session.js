const User = require('../models/User')

function onlyUsers(req, res, next) {
    if (!req.session.userId) {
        return res.redirect('/login')
    }

    next()
}

async function onlyAdmin(req, res, next) {
    if (!req.session.userId) {
        return res.redirect('/login')
    }

    let user = await User.findOne(req.session.userId)

    if (user.is_admin == false) {
        return res.redirect('/admin/profile')
    }

    next()
}

function isLoggedRedirectToUsers(req, res, next) {
    if (req.session.userId) {
        return res.redirect('/admin/profile')
    }

    next()
}

module.exports = {
    onlyUsers,
    isLoggedRedirectToUsers,
    onlyAdmin
}