const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/User')


usersRouter.get('/', async (req, res) => {
  const users = await User.find({})
  res.json(users)
})

usersRouter.post('/', async (req, res) => {
  const body = req.body

  if(!body.password || body.password.length < 3){
    return res.status(400)
      .json({ error: 'password is required & must be more than 3 characters!' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    name: body.name,
    username: body.username,
    passwordHash
  })

  const savedUser = await user.save()
  res.json(savedUser)
})


module.exports = usersRouter