const mongoose = require('mongoose');
const bcrypt   = require('bcrypt-nodejs');

const Schema = mongoose.Schema;
const userSchema = new Schema({
  local: {
    email: String,
    password: String,
  },
  facebook: {
    id: String,
    token: String,
    email: String,
    name: String
  },
  google: {
    id: String,
    token: String,
    email: String,
    name: String
  },
  accountKit: {
    id: String,
    email: String,
    mobile: String,
  },
  name: String,
  photo: String,
});

userSchema.methods.generateHash = function (password) {return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);};

userSchema.methods.validPassword = function (password) {return bcrypt.compareSync(password, this.local.password);};

const model = mongoose.model('User', userSchema);
module.exports = model;