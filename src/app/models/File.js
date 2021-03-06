const db = require("../../config/db")
const { unlinkSync } = require('fs')

module.exports = {
    async create({name, path}) {

        const query = `INSERT INTO files(
            name,
            path
        ) VALUES ($1, $2)
        RETURNING id`

        const values = [
            name,
            path
        ]

        const results = await db.query(query, values)

        return results.rows[0].id
    },
    async allAndUnlink(id) {
        try {
            let results = await db.query(`SELECT * FROM files WHERE id = $1`, [id])

            unlinkSync(results.rows[0].path)

            return results.rows
        } catch(err) {
            console.error(err)
        }
    },
    delete(id) {
        db.query(`DELETE FROM files WHERE id = $1`, [id])
    }
}