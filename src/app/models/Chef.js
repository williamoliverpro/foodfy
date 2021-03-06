const { date } = require("../../lib/utils")
const db = require("../../config/db")

module.exports = {
    async index() {
        let results = await db.query(`SELECT chefs.*, files.name as file_name, files.path as file_path
        FROM chefs LEFT JOIN files on (chefs.file_id = files.id)
        GROUP BY chefs.id, file_name, file_path`)

        return results.rows
    },
    async all() {
        let results = await db.query(`SELECT chefs.*, COUNT (recipes) AS total_recipes 
        FROM chefs LEFT JOIN recipes on (chefs.id = recipes.chef_id)
        GROUP BY chefs.id`)

        return results.rows
    },
    create(data, file_id, callback) {
        const query = `
        INSERT INTO chefs(
          name,
          created_at,
          file_id
        ) VALUES ($1, $2, $3)
        RETURNING id
        `
        const values = [
            data.name,
            date(Date.now()).iso,
            file_id,
        ]

        db.query(query, values, function (err, results) {
            if (err) throw `Database error ${err}`

            callback(results.rows[0])
        })
    },
    async find(id) {
        let results = await db.query(`SELECT * FROM chefs WHERE id = $1`, [id])

        return results.rows[0]
    },
    findBy(filter, callback) {
        db.query(`SELECT teachers.*, COUNT(students) AS total_students
        FROM teachers LEFT JOIN students ON (teachers.id = students.teacher_id)
        WHERE teachers.name ILIKE '%${filter}%' OR
        teachers.subjects_taught ILIKE '%${filter}%'
        GROUP BY teachers.id
        ORDER BY total_students DESC
        `, function (err, results) {
            if (err) throw `Database error ${err}`

            callback(results.rows)
        })
    },
    update(data, file_id) {
        const query = `
        UPDATE chefs set
        name = $1,
        file_id = $2
        WHERE id = $3
        `

        const values = [
            data.name,
            file_id,
            data.id
        ]

        db.query(query, values)
    },
    delete(id, callback) {
        db.query(`DELETE FROM chefs WHERE id = $1`, [id])
    },
    paginate(params) {
        const { filter, limit, offset, callback } = params

        let query = "",
            filterQuery = "",
            totalQuery = `(
                SELECT count (*) FROM teachers
            ) AS total
            `

        if (filter) {
            filterQuery = `
                WHERE teachers.name ILIKE '%${filter}%'
                OR teachers.subjects_taught ILIKE '%${filter}%'
                `

            totalQuery = `(
                    SELECT count(*) FROM teachers
                    ${filterQuery})
                    AS total
                    `
        }

        query = `
            SELECT teachers.*, ${totalQuery}, count(students) AS total_students
            FROM teachers
            LEFT JOIN students ON (teachers.id = students.teacher_id)
            ${filterQuery}
            GROUP BY teachers.id LIMIT $1 OFFSET $2
        `

        db.query(query, [limit, offset], function (err, results) {
            if (err) throw `Database error ${err}`

            callback(results.rows)
        })
    },
    chefRecipes(id, callback) {
        db.query(`SELECT recipes.*, chefs.name as chef_name
        FROM recipes LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
        WHERE recipes.chef_id = $1`, [id], function (err, results) {
            if (err) throw `Database error ${err}`

            callback(results.rows)
        })
    },
    async files(id) {
        const results = await db.query(`
            SELECT * FROM files WHERE id = $1
        `, [id])

        return results.rows[0]
    }
}