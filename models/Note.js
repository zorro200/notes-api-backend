const { Schema, model } = require('mongoose')

// Schema for our notes => This schema doesn't apply to the DB, it's only for this backend
const noteSchema = new Schema({
  content: String,
  date: Date,
  important: Boolean
})

// Configuring how the Schema needs to parse to JSON
// In this case we add an id without '_' and delete by default features
noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// model's name => Connect to the collection 'name+s' in the db (or create it).
// The model's name initial letter must always be capitalized
const Note = model('Note', noteSchema)

module.exports = Note

// Note.find({}).then(result => {
//   console.log(result)
//   mongoose.connection.close()
// })

// const note = new Note({
//   content: 'MongoDB es increíble, Midu',
//   date: new Date(),
//   important: true
// })

// // Save new note into the DB
// note.save()
//   .then(result => {
//     console.log(result)
//     mongoose.connection.close()
//   })
//   .catch(err => {
//     console.log(err)
//   })
