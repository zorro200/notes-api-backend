const usersRouter = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')

// The route is relative of which we used in index.js to use this router
usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('notes', {
    content: 1,
    date: 1
  })
  res.json(users)
})

usersRouter.post('/', async (req, res) => {
  const { body } = req
  const { nick, name, password } = body

  const passwordHash = await bcrypt.hash(password, 10)

  const user = new User({
    nick,
    name,
    passwordHash
  })

  const savedUser = await user.save()
  res.status(201).json(savedUser)
})

module.exports = usersRouter
