const { Schema, model } = require('mongoose')
const uniqueVal = require('mongoose-unique-validator')

const userSchema = new Schema({
  nick: { type: String, unique: true },
  name: String,
  passwordHash: String,
  notes: [{
    type: Schema.Types.ObjectId,
    ref: 'Note'
  }]
})

userSchema.plugin(uniqueVal)

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

const User = model('User', userSchema)

module.exports = User
