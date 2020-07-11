/* eslint-disable no-undef */
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')

const app = require('../app')
const api = supertest(app)

const User = require('../models/User')
const helper = require('./test_helper')


describe('when there is initially one user in DB', () => {
  beforeEach( async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('secureKEY', 10)
    const user = new User({
      username: 'root',
      passwordHash
    })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const users = await helper.usersInDB()

    const newUser = {
      name:'Mostafa Hazareh',
      username:'mostafa',
      password:'1qaz'
    }

    await api.post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDB()
    expect(usersAtEnd).toHaveLength(users.length + 1)

    const usernames = usersAtEnd.map( user => user.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const users = await helper.usersInDB()

    const newUser = {
      name:'mostafa',
      username:'root',
      password:'1qaz'
    }

    const result = await api.post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const userAtEnd = await helper.usersInDB()
    expect(userAtEnd).toHaveLength(users.length)
  })

  test('creation fails if username is shorter than 3 characters', async () => {
    const users = await helper.usersInDB()

    const newUser = {
      name:'mostafa',
      username:'me',
      password:'1qaz'
    }

    const result = await api.post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('(`me`) is shorter than the minimum allowed length (3)')

    const userAtEnd = await helper.usersInDB()
    expect(userAtEnd).toHaveLength(users.length)
  })

  test('creation fails if password is shorter than 3 characters', async () => {
    const users = await helper.usersInDB()

    const newUser = {
      name:'mostafa',
      username:'mos',
      password:'1q'
    }

    const result = await api.post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password is required & must be more than 3 characters!')

    const userAtEnd = await helper.usersInDB()
    expect(userAtEnd).toHaveLength(users.length)
  })
})


afterAll(() => mongoose.connection.close())