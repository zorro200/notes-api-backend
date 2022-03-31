// Enables process.env
require('dotenv').config()
require('./mongo')

const express = require('express')
const cors = require('cors')
const app = express()
const logger = require('./loggerMiddleware')
const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')
const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users')

// Middlewares - The middlewares' order is always important
app.use(cors()) // public
// Parses the object that the request has received (req.body) to JSON
app.use(express.json())
app.use('/images', express.static('images'))
app.use(logger)

// GET root
app.get('/', (req, res) => {
  res.send('<h1> Hello! (☞ﾟヮﾟ)☞ </h1>')
})

app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)

// Errors handler middlewares (always after the others main paths)
// Will be executed if none rute equals to the requested
app.use(notFound)
app.use(handleErrors)

// DEPLOYMENT PORT or BY DEFAULT
const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
