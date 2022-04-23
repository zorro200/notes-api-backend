const notesRouter = require('express').Router()
const Note = require('../models/Note')
const User = require('../models/User')
const userExtractor = require('../middleware/userExtractor')

// GET all notes
notesRouter.get('/', async (req, res) => {
  const notes = await Note.find({}).populate('user', {
    nick: 1,
    name: 1
  })
  res.json(notes)
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
notesRouter.put('/:id', userExtractor, (req, res, next) => {
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
notesRouter.delete('/:id', userExtractor, (req, res, next) => {
  const { id } = req.params

  Note.findByIdAndDelete(id).then(() => {
    res.status(204).end()
  }).catch(err => next(err))
})

// POST a note
notesRouter.post('/', userExtractor, async (req, res) => {
  const { content, important } = req.body

  const { userId } = req

  if (!content) {
    return res.status(400).json({
      error: 'note.content is missing'
    })
  }

  // Find the user through the login token
  const user = await User.findById(userId)

  const newNote = new Note({
    content: content,
    date: new Date().toISOString(),
    important: typeof important === 'undefined' ? false : important,
    user: user._id
  })

  // Save into the DB
  const savedNote = await newNote.save()

  user.notes = user.notes.concat(savedNote)
  user.save()

  res.status(201).json(savedNote)
})

module.exports = notesRouter
