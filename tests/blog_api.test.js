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


describe('when there is initially some blogs saved', () => {
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
})


describe('viewing a specific blog', () => {
  test('succeeds with a valid id', async () => {
    const blogs = await helper.blogsInDB()
    const targetBlog = blogs[0]

    const res = await api.get(`/api/blogs/${targetBlog.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(res.body).toEqual(targetBlog)
  })

  test('fails with statuscode 404 if blog does not exist', async () => {
    const id = await helper.nonExistingId()
    await api.get(`/api/blogs/${id}`)
      .expect(404)
  })

  test('fails with statuscode 400 id is invalid', async () => {
    const invalidId = '12345qaz'
    await api.get(`/api/blogs/${invalidId}`)
      .expect(400)
  })
})


describe('addition of a new blog', () => {

  test('Blog without title, author or url is not added', async () => {
    const newBlog = {
      likes: 10
    }

    const res = await api.post('/api/login').send({
      username:'root',
      password:'secureKEY'
    })
    const token = res.body.token

    await api.post('/api/blogs')
      .send(newBlog)
      .set({ 'Authorization': `bearer ${token}` })
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

    const res = await api.post('/api/login').send({
      username:'root',
      password:'secureKEY'
    })
    const token = res.body.token

    await api.post('/api/blogs')
      .send(newBlog)
      .set({ 'Authorization': `bearer ${token}` })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDB()
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(blog => blog.title)
    expect(titles).toContain('Adjusting to Increased Digital Communication Since the Pandemic')
  })

  test('fails with status code 400 if data invaild', async () => {

  })

  test('The likes property is missing from the request, it will default to the value 0.', async () => {
    const newBlog = {
      title: 'How Managing My Mental Illness Changed My Life After Graduation',
      author: 'Amanda Jerelyn',
      url: 'https://www.studentmindsblog.co.uk/search?updated-max=2020-07-06T12:30:00%2B01:00&max-results=2',
    }

    const response = await api.post('/api/login').send({
      username:'root',
      password:'secureKEY'
    })
    const token = response.body.token

    const res = await api.post('/api/blogs')
      .send(newBlog)
      .set({ 'Authorization': `bearer ${token}` })
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

    const res = await api.post('/api/login').send({
      username:'root',
      password:'secureKEY'
    })
    const token = res.body.token

    await api.post('/api/blogs')
      .set({ 'Authorization': `bearer ${token}` })
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })
})


describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const newBlog = {
      title: 'How Managing My Mental Illness Changed My Life After Graduation',
      author: 'Amanda Jerelyn',
      url: 'https://www.studentmindsblog.co.uk/search?updated-max=2020-07-06T12:30:00%2B01:00&max-results=2',
    }

    const res = await api.post('/api/login').send({
      username:'root',
      password:'secureKEY'
    })
    const token = res.body.token

    const response = await api.post('/api/blogs')
      .set({ 'Authorization': `bearer ${token}` })
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const targetBlog = response.body


    await api.delete(`/api/blogs/${targetBlog.id}`)
      .set({ 'Authorization': `bearer ${token}` })
      .expect(204)

    const blogsAtEnd = await helper.blogsInDB()
    expect(blogsAtEnd).toHaveLength( helper.initialBlogs.length)
  })
})


describe('updating a blog', () => {
  test('update the amount of likes for a blog post', async () => {
    const blogs = await helper.blogsInDB()
    const targetBlog = blogs[0]
    targetBlog.likes += 1

    await api.put(`/api/blogs/${targetBlog.id}`)
      .send(targetBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const updatedBlog = await helper.blogsInDB()
    expect(updatedBlog[0].likes).toBe(helper.initialBlogs[0].likes + 1)

  })
})


afterAll(() => mongoose.connection.close())