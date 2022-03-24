module.exports = (req, res) => {
  console.error(res.error)
  res.status(404).end()
}
