// Enables process.env
require('dotenv').config()
require('./mongo')

const express = require('express')
const cors = require('cors')
const app = express()
const logger = require('./loggerMiddleware')
const Note = require('./models/Note')

// Middleware
app.use(cors()) // public
// Parses the object that the request has received (req.body) to JSON
app.use(express.json())
app.use(logger)

let notes = []

// GET root
app.get('/', (req, res) => {
  res.send('<h1> Hello! (☞ﾟヮﾟ)☞ </h1>')
})

// GET all notes
app.get('/api/notes', (req, res) => {
  Note.find({}).then(notes => {
    res.json(notes)
  })
})

// GET one note by ID
app.get('/api/notes/:id', (req, res, next) => {
  const id = req.params.id

  Note.findById(id).then(note => {
    if (note) {
      res.status(302).json(note)
    } else {
      res.status(404).end()
    }
  }).catch(err => {
    next(err)
  })
})

// DELETE one note by ID
app.delete('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  // We store all the notes that does not match with that one we're searching for deleting
  notes = notes.filter(note => note.id !== id)
  res.status(204).end()
})

// POST a note
app.post('/api/notes', (req, res) => {
  const note = req.body

  if (!note || !note.content) {
    return res.status(400).json({
      error: 'note.content is missing'
    })
  }

  const newNote = new Note({
    content: note.content,
    date: new Date().toISOString(),
    important: typeof note.important === 'undefined' ? false : note.important
  })

  // Save into the DB
  newNote.save().then(savedNote => {
    res.status(201).json(savedNote)
  })
})

// Will be executed if none rute equals to the requested
app.use((err, req, res, next) => {
  console.error(err)
  console.log(req.path)
  if (err.name === 'CastError') {
    res.status(400).send({ error: 'id used is malformed' })
  } else {
    res.status(500).end()
  }
})

// DEPLOYMENT PORT or BY DEFAULT
const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
