const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/User')

loginRouter.post('/', async (req, res) => {
  const { body } = req
  const { nick, password } = body

  const user = await User.findOne({ nick })
  // We check if the password is correct or not
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!passwordCorrect) {
    res.status(401).json({
      error: 'Invalid user or password'
    })
  }

  res.send({
    nick: user.nick,
    name: user.name
  })
})

module.exports = loginRouter
