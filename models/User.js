const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  }
})




//By default when mongo creates this model, will set the mongoose.model('User') to lowercase and plural so it will look for an 'users' collection in mongodb
module.exports = mongoose.model('User',userSchema)

