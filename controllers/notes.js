const notesRouter = require('express').Router()
const Note = require('../models/Note')

// GET all notes
notesRouter.get('/', (req, res) => {
  Note.find({}).then(notes => {
    res.json(notes)
  })
})

// GET note by ID
notesRouter.get('/:id', (req, res, next) => {
  const id = req.params.id

  Note.findById(id).then(note => {
    note
      ? res.status(302).json(note)
      : next()
    // Next path that handles "error" as its first argument
  }).catch(err => next(err))
})

// UPDATE note by ID
notesRouter.put('/:id', (req, res, next) => {
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
notesRouter.delete('/:id', (req, res, next) => {
  const { id } = req.params

  Note.findByIdAndDelete(id).then(() => {
    res.status(204).end()
  }).catch(err => next(err))
})

// POST a note
notesRouter.post('/api/notes', (req, res) => {
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

module.exports = notesRouter
