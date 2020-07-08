/* eslint-disable no-useless-escape */
/* eslint-disable no-undef */
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/Blog')


beforeEach( async () => {
  await Blog.deleteMany({})

  for(let blogObj of helper.initialBlogs){
    await new Blog(blogObj).save()
  }
})

describe('BLOG API', () => {
  test('The blog list application returns the correct amount of blog posts in the JSON format.', async () => {
    const res = await api.get('/api/blogs')

    expect(res.body).toHaveLength(helper.initialBlogs.length)
  })

  test('the unique identifier property of the blog posts is named id, by default the database names the property _id.', async () => {
    const res = await api.get('/api/blogs')
    res.body.forEach( blog => {
      expect(blog.id).toBeDefined()
      expect(blog._id).not.toBeDefined()
    })
  })

  test('Blog without title, author or url is not added', async () => {
    const newBlog = {
      likes: 10
    }
    await api.post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDB()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })

  test('successfully creates a new blog post & the total number of blogs in the system is increased by one', async () => {
    const newBlog = {
      title: 'Adjusting to Increased Digital Communication Since the Pandemic',
      author: 'Michael Priestley',
      url: 'https://www.studentmindsblog.co.uk/search?updated-max=2020-07-06T12:30:00%2B01:00&max-results=2',
      likes: 12
    }

    await api.post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDB()
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(blog => blog.title)
    expect(titles).toContain('Adjusting to Increased Digital Communication Since the Pandemic')
  })

  test('The likes property is missing from the request, it will default to the value 0.', async () => {
    const newBlog = {
      title: 'How Managing My Mental Illness Changed My Life After Graduation',
      author: 'Amanda Jerelyn',
      url: 'https://www.studentmindsblog.co.uk/search?updated-max=2020-07-06T12:30:00%2B01:00&max-results=2',
    }

    const res = await api.post('/api/blogs')
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const likes = res.body.likes
    expect(likes).toBe(0)

  })

  test('The title and url properties are missing from the request data', async () => {
    const newBlog = {
      author:'mostafa',
      likes: 1
    }

    await api.post('/api/blogs')
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })
})

afterAll(() => mongoose.connection.close())