module.exports = (err, req, res, next) => {
  console.error(err)
  console.log(req.path)
  if (err.name === 'CastError') {
    res.status(400).send({ error: 'id used is malformed' })
  } else {
    res.status(500).end()
  }
}
