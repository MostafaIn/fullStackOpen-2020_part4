const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
  blogs:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref:'Blog'
    }
  ],
  name:{
    type: String
  },
  username:{
    type: String,
    required: true
  },
  passwordHash:{
    type: String,
    required: true
  }
})

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