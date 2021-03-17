const express = require("express")
const routes = express.Router()

const UserController = require('../app/controllers/users')
const SessionController = require('../app/controllers/session')
const ProfileController = require('../app/controllers/profile')
const { isLoggedRedirectToUsers, onlyUsers, onlyAdmin } = require('../app/middlewares/session')
const SessionValidator = require('../app/validators/session')
const UserValidator = require('../app/validators/user')
const ProfileValidator = require('../app/validators/profile')

routes.get('/login', isLoggedRedirectToUsers, SessionController.loginForm)
routes.post('/login', SessionValidator.login, SessionController.login)
routes.post('/logout', SessionController.logout)

routes.get('/forgot-password', SessionController.forgotForm)
routes.get('/password-reset', SessionController.resetPasswordForm)
routes.post('/forgot-password', SessionValidator.forgot, SessionController.forgot)
routes.post('/password-reset', SessionValidator.reset, SessionController.reset)


// Rotas de perfil de um usuário logado
routes.get('/admin/profile', onlyUsers, ProfileController.index) // Mostrar o formulário com dados do usuário logado
routes.put('/admin/profile', ProfileValidator.update, ProfileController.put)// Editar o usuário logado


// Rotas que o administrador irá acessar para gerenciar usuários
routes.get('/admin/users', onlyAdmin, UserController.list) // Mostrar a lista de usuários cadastrados
routes.post('/admin/users', UserValidator.post, UserController.post) // Cadastrar um usuário
routes.get('/admin/users/create', onlyAdmin, UserController.create) // Mostrar o formulário de criação de um usuário
routes.put('/admin/users/:id', UserValidator.update, UserController.put) // Editar um usuário
routes.get('/admin/users/:id/edit', onlyAdmin, UserController.edit) // Mostrar o formulário de edição de um usuário
routes.delete('/admin/users/:id', UserValidator.del, UserController.delete) // Deletar um usuário

module.exports = routes