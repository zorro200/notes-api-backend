const mongoose = require('mongoose')

const connectionString = 'mongodb+srv://adminL:YgzNYZD1aTtOJedT@cluster0.nuam7.mongodb.net/midudb?retryWrites=true&w=majority'

// Connection to Mongo
mongoose.connect(connectionString)
  .then(() => {
    console.log('Database connected')
  }).catch(err => {
    console.error(err)
  })
