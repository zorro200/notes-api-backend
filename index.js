// Enables process.env
require('dotenv').config()
require('./mongo')

const express = require('express')
const cors = require('cors')
const app = express()
const logger = require('./loggerMiddleware')
const Note = require('./models/Note')
const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')

// Middlewares - The middlewares' order is always important
app.use(cors()) // public
// Parses the object that the request has received (req.body) to JSON
app.use(express.json())
app.use(logger)

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

// GET note by ID
app.get('/api/notes/:id', (req, res, next) => {
  const id = req.params.id

  Note.findById(id).then(note => {
    if (note) {
      res.status(302).json(note)
    } else {
      res.status(404).end()
    }
  }).catch(err => next(err))
})

// UPDATE note by ID
app.put('/api/notes/:id', (req, res, next) => {
  const { id } = req.params
  const note = req.body

  const newNoteInfo = {
    content: note.content,
    important: note.important
  }

  Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    .then(result => {
      res.json(result)
    }).catch(err => next(err))
})

// DELETE note by ID
app.delete('/api/notes/:id', (req, res, next) => {
  const { id } = req.params

  Note.findByIdAndDelete(id).then(() => {
    res.status(204).end()
  }).catch(err => next(err))
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

// Errors handler middlewares (always after the others main paths)
// Will be executed if none rute equals to the requested
app.use(notFound)
app.use(handleErrors)

// DEPLOYMENT PORT or BY DEFAULT
const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
