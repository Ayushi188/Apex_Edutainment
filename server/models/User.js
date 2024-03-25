const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  reEmail: String,
  password: String,
  age: Number,
  parentEmail: String,
  school: String,
  role:String,
  approved: Boolean
})

UserSchema.pre('save', async function(next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Define a method to validate user's password
UserSchema.methods.isValidPassword = async function(password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    console.error(error);
    throw new Error('Password validation failed');
  }
};


const UserModel = mongoose.model("user",UserSchema);
module.exports = UserModel;