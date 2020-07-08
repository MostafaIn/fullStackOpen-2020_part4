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

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'Adjusting to Increased Digital Communication Since the Pandemic',
    author: 'Michael Priestley',
    url: 'https://www.studentmindsblog.co.uk/search?updated-max=2020-07-06T12:30:00%2B01:00&max-results=2',
    likes: 12
  })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDB = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDB
}