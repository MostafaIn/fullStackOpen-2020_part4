const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')


const userSchema = new mongoose.Schema({
  blogs:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref:'Blog'
    }
  ],
  name:{
    type: String,
  },
  username:{
    type: String,
    unique: true,
    minlength: 3,
    required: true
  },
  passwordHash:{
    type: String,
    minlength: 3,
    required: true
  }
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
  transform: (doc, returnedObj) => {
    returnedObj.id = returnedObj._id.toString()
    delete returnedObj._id
    delete returnedObj.__v
    delete returnedObj.passwordHash
  }
})

const User = mongoose.model('User',userSchema)
module.exports = User