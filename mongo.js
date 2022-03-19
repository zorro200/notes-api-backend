const mongoose = require('mongoose')
const password = require('./password')

const connectionString = `mongodb+srv://adminL:${password}@cluster0.nuam7.mongodb.net/midudb?retryWrites=true&w=majority`

// Connection to Mongo
mongoose.connect(connectionString)
  .then(() => {
    console.log('Database connected')
  }).catch(err => {
    console.error(err)
  })
