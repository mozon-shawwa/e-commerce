const User = require('../models/User');
const createError = require('http-errors');
const JWT = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { returnJson } = require('../my-modules/json-response');

const register = async (req, res, next) => {
  try {
    const { userName, email, password, phone } = req.body;
    if (!userName || !email || !password || !phone) {
      return next(createError(400, 'please,provide all fields'));
    }

    const exisiting = await User.findOne({ email });
    if (exisiting) {
      return next(createError(400, 'Email is already Registered,please login'));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      userName,
      email,
      password: hashedPassword,
      phone
    });

    returnJson(res, 201, true, user, 'Successfully Registered');

  } catch (error) {
    console.log(error);
    return next(createError(500, 'Error In Register API'));
  }

};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(createError(400, 'please,provide all fields'));
    }

    const user = await User.findOne({email:email});
    if(!user){
      return next(createError(404, 'User Not Found'));
    }

    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
      return next(createError(400, 'Invalid Password'));
    }

    const token = JWT.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"1d"});
    user.password = undefined;

    returnJson(res,200,true,{user,token},"Login Successfully");

  } catch (error) {
    console.log(error);
    return next(createError(500, 'Error In LOgin API'))
  }

};

module.exports = { register, login };