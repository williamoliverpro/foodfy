const { date, listRemove } = require("../../lib/utils")
const db = require("../../config/db")

module.exports = {
    async all() {
        let results = await db.query(`SELECT recipes.*, chefs.name as chef_name
        FROM recipes LEFT JOIN chefs ON (chefs.id = recipes.chef_id) 
        ORDER BY title ASC`)

        return results.rows
    },
    async create(data) {
        const query = `
        INSERT INTO recipes(
            chef_id,
            title,
            ingredients,
            preparation,
            information,
            created_at
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
        `

        const values = [
            data.chef_id,
            data.title,
            listRemove(data.ingredients),
            listRemove(data.preparation),
            data.information,
            date(Date.now()).iso
        ]

        let results = await db.query(query, values)

        return results.rows[0]
    },
    async find(id) {
        let results = await db.query(`SELECT recipes.*, chefs.name as chef_name
        FROM recipes LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
        WHERE recipes.id = $1`, [id])

        return results.rows[0]
    },
    async update(data) {
        const query = `
        UPDATE recipes set
        chef_id	 = $1,
        title = $2,
        ingredients = $3,
        preparation = $4,
        information = $5
        WHERE id = $6
        `

        const values = [
            data.chef_id,
            data.title,
            listRemove(data.ingredients),
            listRemove(data.preparation),
            data.information,
            data.id
        ]

        db.query(query, values)
    },
    delete(id, callback) {
        db.query(`DELETE FROM recipes WHERE id = $1`, [id])
    },
    async chefsOptions() {
        let results = await db.query(`SELECT id, name FROM chefs`)

        return results.rows
    },
    paginate(params) {
        const { filter, limit, offset, callback } = params

        let query = "",
            filterQuery = ""

        if (filter) {
            filterQuery = `
                WHERE recipes.title ILIKE '%${filter}%'`
        }

        query = `
            SELECT recipes.*, chefs.name as chef_name
            FROM recipes
            LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
            ${filterQuery}
            LIMIT $1 OFFSET $2
        `

        db.query(query, [limit, offset], function (err, results) {
            if (err) throw `Database error ${err}`

            callback(results.rows)
        })
    },
    async recipe_files(recipe_id, file_id) {
        const query = `
        INSERT INTO recipe_files(
            recipe_id,
            file_id
        ) VALUES ($1, $2)
        RETURNING id
        `

        const values = [
            recipe_id,
            file_id
        ]

        let results = await db.query(query, values)

        return results.rows[0]
    },
    async files() {
        let results = await db.query(`SELECT recipe_files.*, files.path, files.name
        FROM recipe_files LEFT JOIN recipes on (recipes.id = recipe_files.recipe_id)
        LEFT JOIN files on (files.id = recipe_files.file_id)
        GROUP BY recipe_files.id, files.path, files.name`)

        return results.rows
    },
    FilesRecipesDelete(id) {
        db.query(`DELETE FROM recipe_files
            WHERE recipe_files.file_id = $1`, [id])
    },
    deleteFilesRecipes(id) {
        db.query(`DELETE FROM recipe_files
            WHERE recipe_files.id = $1`, [id])
    }
}