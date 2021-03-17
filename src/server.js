const express = require("express")
const app = express()
const nunjucks = require("nunjucks")
const routes = require("./routes")
const methodOverride = require("method-override")
const session = require('./config/session')


app.use(session)
app.use((req, res, next) => {
    res.locals.session = req.session
    next()
})

app.set("view engine", "njk")
app.use(express.static("public"))
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(routes)

nunjucks.configure("src/app/views", {
    express: app,
    autoescape: false
})

app.listen(5000)