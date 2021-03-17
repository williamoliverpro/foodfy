const db = require("../../config/db")

module.exports = {
    async all() {
        const results = await db.query(`SELECT * FROM users`)

        return results.rows
    },
    async create(data) {
        const query = `
        INSERT INTO users(
            name,
            email,
            password
        ) VALUES ($1, $2, $3)
        RETURNING id
        `

        const values = [
            data.name,
            data.email,
            data.password
        ]

        db.query(query, values)
    },
    async findOne(id) {
        const results = await db.query(`SELECT * FROM users WHERE id = $1`, [id])

        return results.rows[0]
    },
    async update(data, id) {
        let query
        let values

        if (data.reset_token && data.reset_token_expires) {
            query = `
            UPDATE users set
            reset_token = $1,
            reset_token_expires = $2
            WHERE id = $3
            `

            values = [
                data.reset_token,
                data.reset_token_expires,
                id
            ]

        } else {
            query = `
            UPDATE users set
            name = $1,
            email = $2,
            is_admin = $3
            WHERE id = $4
            `

            values = [
                data.name,
                data.email,
                data.is_admin,
                id
            ]
        }

        db.query(query, values)
    },
    async delete(id) {
        db.query(`DELETE FROM users WHERE id = $1`, [id])
    },
    async findOneEmail(email) {
        const results = await db.query(`SELECT * FROM users WHERE email = $1`, [email])

        return results.rows[0]
    },
    async profileUpdate(data) {
        let query
        let values

        if (data.password) {
            query = `
            UPDATE users set
            name = $1,
            email = $2,
            password = $3
            WHERE id = $4
            `

            values = [
                data.name,
                data.email,
                data.password,
                data.id
            ]
        } else {
            query = `
            UPDATE users set
            name = $1,
            email = $2
            WHERE id = $3
            `

            values = [
                data.name,
                data.email,
                data.id
            ]
        }


        db.query(query, values)
    },
    async updatePasswordReset(id, data) {
        let query = `
        UPDATE users set
        password = $1,
        reset_token = $2,
        reset_token_expires = $3
        WHERE id = $4
        `

        let values = [
            data.password,
            data.reset_token,
            data.reset_token_expires,
            id
        ]

        db.query(query, values)
    }
}