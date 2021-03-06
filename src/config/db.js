const { Pool } = require("pg")

module.exports = new Pool({
    user: "postgres",
    password: "Iloveme20!",
    host: "localhost",
    port: 5432,
    database: "foodfy"
})