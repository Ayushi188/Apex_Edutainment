const mongoose = require('mongoose');

const RegisterSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  reEmail: String,
  password: String,
  age: Number,
  parentEmail: String,
  school: String,

})

const RegisterModel = mongoose.model("register",RegisterSchema);
module.exports = RegisterModel;