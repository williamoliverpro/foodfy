const faker = require('faker')
const { hash } = require('bcryptjs')

const User = require('./src/app/models/User')
const Recipe = require('./src/app/models/Recipe')
const File = require('./src/app/models/File')

let usersIds = []
let totalRecipes = 10
let totalUsers = 3

async function createUsers() {
    const users = []
    const password = await hash('1111', 8)

    while (users.length < totalUsers) {
        users.push({
            name: faker.name.firstName(),
            email: faker.internet.email(),
            password
        })
    }

    const usersPromise = users.map(user => User.create(user))

    usersIds = await Promise.all(usersPromise)

    let files = []
    
        while(files.length < 50) {
        files.push({
            name: faker.image.image(),
            path: `public/images/placeholder.png`,
        })
    }

    const filesPromise = files.map(file => File.create(file))

    await Promise.all(filesPromise)
}

async function createProducts() {

    let recipes = []

    while(recipes.length < totalRecipes) {
        recipes.push({
            chef_id: Math.ceil(Math.random() * 3),
            user_id: usersIds[Math.floor(Math.random() * totalUsers)],
            title: faker.name.title(),
            ingredients: faker.lorem.paragraph(Math.ceil(Math.random() * 10)),
            preparation: faker.lorem.paragraph(Math.ceil(Math.random() * 10)),
            information: faker.lorem.paragraph(Math.ceil(Math.random() * 10)),
            created_at: '{2011}-${12}-${12}',
        })
    }

    const recipesPromise = recipes.map(recipe => Recipe.create(recipe))
    recipesIds = await Promise.all(recipesPromise)

    let files = []

    while(files.length < 50) {
        files.push({
            name: faker.image.image(),
            path: `public/images/placeholder.png`,
            product_id: productsIds[Math.floor(Math.random() * totalProducts)]
        })
    }
    const filesPromise = files.map(file => File.create(file))

    await Promise.all(filesPromise)

}

async function init() {
    await createUsers()
    await createProducts()
}

init()