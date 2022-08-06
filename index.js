import express, { request } from 'express';
//use for cryptography
import jwt from 'jsonwebtoken';

import mongoose from 'mongoose';
import {registerValidation} from './validations/auth.js';
import { validationResult } from 'express-validator';
import userModel from './modules/User.js';
import bcrypt from 'bcrypt';

import checkAuth from './utils/checkAuth.js';

mongoose
  .connect(
    'mongodb+srv://NadiaTsy:Volgograd2015@cluster0.genlcka.mongodb.net/blog?retryWrites=true&w=majority')
  .then(() => console.log('db connection'))
  .catch((err) => console.log('db error', err))


const app = express(); //create express app

//can read json file
app.use(express.json());


app.post('/auth/login', async (req, res) => {
  try {
    const user = await userModel.findOne({
      email: req.body.email
    })
    if(!user){
      return res.status(404).json({
        message: 'User not found'
      });
    }
    const isValidPass = await bcrypt.compare(req.body.password,user._doc.passwordHash);
    if(!isValidPass){
      return res.status(400).json({
        message: 'Invalid login or password'
      })
    }

    const token = jwt.sign(
      {
      _id:user._id,
    },
    'secret123',
    {
      expiresIn: '30d',
    },
    );
    const {passwordHash, ...userData} = user._doc;
    res.json({
      ...userData,
      token})
  } catch (error) {
    console.log(error)
    res.status(500).json({
    message: "failed to login"
  })
  }
})

app.post('/auth/register',registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
  if (!errors.isEmpty()){
    return res.status(400).json(errors.array())
  }

  const password = req.body.password;
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const doc = new userModel({
    email: req.body.email,
    fullName: req.body.fullName,
    avatarUrl: req.body.avatarUrl,
    passwordHash:hash ,
  });

  const user = await doc.save();

  const token = jwt.sign(
    {
    _id:user._id,
  },
  'secret123',
  {
    expiresIn: '30d',
  },
  );
  const {passwordHash, ...userData} = user._doc;
  res.json({
    ...userData,
    token})


  } catch (error) {
  console.log(error)
  res.status(500).json({
  message: "failed to register"
})
  }

});

app.post('/auth/login', (req, res) => {
  console.log(req.body)


  const token = jwt.sign(
    {
      email: req.body.email,
      fullName: 'Nadia Tsygankova',
    }, 'secret123',
  );

  res.json({
    success: true,
    token,
  });
})
app.get('/auth/me',checkAuth, async (req, res) => {
  try {

  } catch (error) {

  }
})
app.listen('4444', (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('Server OK');
})