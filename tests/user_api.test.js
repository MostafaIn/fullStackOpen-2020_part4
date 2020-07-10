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
      password:'1qaz1qaz'
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
})


afterAll(() => mongoose.connection.close())