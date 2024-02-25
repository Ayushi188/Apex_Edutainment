const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  reEmail: String,
  password: String,
  age: Number,
  parentEmail: String,
  school: String,

})

// Define a method to validate user's password
UserSchema.methods.isValidPassword = function(password) {
  // Compare the provided password with the stored password
  return this.password === password;
};

const UserModel = mongoose.model("user",UserSchema);
module.exports = UserModel;