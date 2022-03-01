/**
 * Will log all the requests received
 * @param {*} req request
 * @param {*} res response
 * @param {*} next method that will go to the next route that match with the request
 */
const logger = (req, res, next) => {
  // Like GET or POST
  console.log(req.method)
  console.log(req.path)
  // Content that is handling the request's initializing
  console.log(req.body)
  console.log('----------')
  next()
}

module.exports = logger
