const express = require("express")
const routes = express.Router()

const chefs = require("../app/controllers/chefs")
const multer = require('../app/middlewares/multer')
const { onlyAdmin } = require('../app/middlewares/session')

routes.get("/", chefs.index)
routes.get("/create", onlyAdmin, chefs.create)
routes.get("/:id", chefs.show)
routes.get("/:id/edit", onlyAdmin, chefs.edit)
routes.post("/", multer.array("photos", 1), chefs.post)
routes.put("/", multer.array("photos", 1), chefs.put)
routes.delete("/", chefs.delete)

module.exports = routes