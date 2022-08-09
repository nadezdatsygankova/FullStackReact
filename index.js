import express, { request } from 'express';
//use for cryptography

import mongoose from 'mongoose';
import { registerValidation,loginValidation, postCreateValidation } from './validations.js';
import checkAuth from './utils/checkAuth.js';
import * as UserController from './controllers/UserController.js'
import * as PostController from './controllers/PostController.js'

mongoose
  .connect(
    'mongodb+srv://NadiaTsy:Volgograd2015@cluster0.genlcka.mongodb.net/blog?retryWrites=true&w=majority')
  .then(() => console.log('db connection'))
  .catch((err) => console.log('db error', err))


const app = express(); //create express app

//can read json file
app.use(express.json());


app.post('/auth/login',loginValidation,UserController.login )
app.post('/auth/register', registerValidation,UserController.register );
app.get('/auth/me', checkAuth,UserController.getMe );

app.get('/posts', PostController.getAll);
// app.get('/posts/:id', PostController.getOne);
app.post('/posts',checkAuth, postCreateValidation, PostController.create);
// app.delete('/posts', PostController.remove);
// app.patch('/posts', PostController.update);

app.listen('4444', (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('Server OK');
})