const blogRouter = require('express').Router()
const Blog = require('../models/Blog')

blogRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({})
  res.json(blogs.map( blog => blog.toJSON()))
})

blogRouter.post('/', async (req, res) => {
  const body = req.body
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })

  const savedBlog = await blog.save()
  res.json(savedBlog.toJSON())
})


module.exports = blogRouter