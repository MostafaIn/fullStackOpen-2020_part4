/* eslint-disable no-useless-escape */
/* eslint-disable no-undef */
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/Blog')

const initialBlogs = [
  {
    'title': 'My Exercise with Exercise During Lockdown',
    'author': 'Lizzie Speller',
    'url': 'https://https://www.studentmindsblog.co.uk/',
    'likes': 10
  },
  {
    'title': 'Alternative Activities to Look After Your Wellbeing in Lockdown',
    'author': 'Hannah Chow',
    'url': 'https://https://www.studentmindsblog.co.uk/',
    'likes': 5
  }

]

beforeEach( async () => {
  await Blog.deleteMany({})

  let blogObj = new Blog(initialBlogs[0])
  await blogObj.save()

  blogObj = new Blog(initialBlogs[1])
  await blogObj.save()
})

test('The blog list application returns the correct amount of blog posts in the JSON format.', async () => {
  const res = await api.get('/api/blogs')

  expect(res.body).toHaveLength(initialBlogs.length)
})

afterAll(() => mongoose.connection.close())