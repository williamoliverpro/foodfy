const db = require("../../config/db")
const { unlinkSync } = require('fs')
const Base = require("./Base")

Base.init({ table: 'files' })

module.exports = {
    ...Base,
    async allAndUnlink(id) {
        try {
            let results = await db.query(`SELECT * FROM files WHERE id = $1`, [id])

            unlinkSync(results.rows[0].path)

            return results.rows
        } catch(err) {
            console.error(err)
        }
    }
}