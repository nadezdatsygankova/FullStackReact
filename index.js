import express from 'express';
//use for cryptography
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import {registerValidation} from './validations/auth.js';
import { validationResult } from 'express-validator';

mongoose
  .connect(
    'mongodb+srv://NadiaTsy:Volgograd2015@cluster0.genlcka.mongodb.net/?retryWrites=true&w=majority')
  .then(() => console.log('db connection'))
  .catch((err) => console.log('db error', err))


const app = express(); //create express app

//can read json file
app.use(express.json());

// app.get('/', (req, res) => {
//   res.send('hello world');
// })

app.post('/auth/register',registerValidation, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()){
    return res.status(400).json(errors.array())
  }

  res.json({
    success: true
  })

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
app.listen('4444', (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('Server OK');
})