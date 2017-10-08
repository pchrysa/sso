'use strict';
const moment = require('moment');
const grvtr = require('grvtr');
const User = require('./../models/user');

const findAccountKitUser = async ({email, mobile}) => {
  try {
    const query = email ? {'accountKit.email': email} : {'accountKit.mobile': mobile};
    const user = await User.findOne(query);
    return user;
  } catch(e) {
    throw e;
  }
};

const registerAccountKitUser = async ({email, mobile, user_id}) => {
  try {
    const newUser = new User({
      accountKit: {
        email,
        mobile,
        id: user_id,
        created_at: moment().unix(),
      },
      photo: grvtr.create(email || mobile, {
        size: 200,
        defaultImage: 'identicon',
        secure: true
      }),
    });
    await newUser.save();
    if (!newUser) {
      throw new Error('Something went wrong registering user.');
    }
    return newUser;
  } catch (e) {
    throw e;
  }
};

module.exports = {
  findAccountKitUser,
  registerAccountKitUser,
};