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
app.get('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id)
  const note = notes.find(note => note.id === id)

  if (note) {
    res.json(note)
  } else {
    res.status(404).end()
  }
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

  const ids = notes.map(note => note.id)
  const maxId = Math.max(...ids)

  const newNote = {
    id: maxId + 1,
    content: note.content,
    important: typeof note.important !== 'undefined' ? note.important : false,
    date: new Date().toISOString()
  }

  notes = [...notes, newNote]

  res.status(201).json(newNote)
})

// Will be executed if none rute equals to the requested
app.use((req, res) => {
  console.log(req.path)
  res.status(404).json({
    error: 'Not found'
  })
})

// DEPLOYMENT PORT or BY DEFAULT
const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
