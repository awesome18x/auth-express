const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');


const userSchema = new Schema({
    email: {
        type: 'string',
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: 'string',
        required: true,
    }
});

userSchema.pre('save', async function (next) {
    try {
        console.log('Called before save a user');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword  = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
    } catch(error) {
        next(error);
    }
});

userSchema.methods.isValidPassword = async function (password) {
    try {
      return await bcrypt.compare(password, this.password)
    } catch (error) {
      throw error
    }
  }

userSchema.post('save', async function (next) {
    try {
        console.log('Called after save a user');
    } catch(error) {
        next(error);
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User; 