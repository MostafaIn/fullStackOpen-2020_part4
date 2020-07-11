const blogRouter = require('express').Router()
const Blog = require('../models/Blog')
const User = require('../models/User')


blogRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user',{ name: 1, username: 1 })
  res.json(blogs.map( blog => blog.toJSON()))
})

blogRouter.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  blog ? res.json(blog.toJSON()) : res.status(404).end()
})

blogRouter.post('/', async (req, res) => {
  const body = req.body
  const user = await User.findById(body.userId)
  console.log(body)
  const blog = new Blog({
    user: user._id,
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  res.json(savedBlog.toJSON())
})

blogRouter.delete('/:id', async (req, res) => {
  await Blog.findByIdAndRemove(req.params.id)
  res.status(204).end()
})

blogRouter.put('/:id', async (req, res) => {
  const body = req.body
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true })
  res.json(updatedBlog.toJSON())
})

module.exports = blogRouter