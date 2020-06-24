const blogRouter = require('express').Router()
const Blog = require('../models/Blog')

blogRouter.get('/',(req, res) =>{
    Blog.find({}).then( blogs =>{
        res.json(blogs.map( blog => blog.toJSON()))
    })
});

blogRouter.post('/', (req, res, next) =>{
    const body = req.body
    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    });

    blog.save()
    .then( savedBlog => res.json(savedBlog.toJSON()))
    .catch( err => next(err))
});


module.exports = blogRouter