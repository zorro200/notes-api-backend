const logger = (req, res, next) => {
  console.log(req.method)
  console.log(req.path)
  console.log(req.body)
  console.log('----------')
  // Go to the next route that match with the request
  next()
}

module.exports = logger
