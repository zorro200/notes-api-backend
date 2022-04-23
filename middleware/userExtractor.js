const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
  const authorization = req.get('authorization')
  let token = ''

  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    // Get the token from the HTTP authentication scheme (BEARER)
    token = authorization.substring(7)
  }

  // Verify the token is correct with the secret key
  const decodedToken = jwt.verify(token, process.env.SECRET)

  const { id: userId } = decodedToken

  // Can't create a note without token
  if (!token || !userId) {
    return res.status(401).json({ error: 'token missing or invalid' })
  }

  // Store the userId into the request
  req.userId = userId

  next()
}
