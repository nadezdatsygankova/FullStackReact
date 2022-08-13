import express, { request } from 'express';
//use for cryptography
import fs from 'fs';
import multer from 'multer';
import mongoose from 'mongoose';
import { registerValidation, loginValidation, postCreateValidation } from './validations.js';
import {checkAuth, handleValidationErrors} from './utils/index.js';
import {UserController, PostController} from './controllers/index.js'
import cors from 'cors'
const MONGODB_URI = 'mongodb+srv://NadiaTsy:Volgograd2015@cluster0.genlcka.mongodb.net/blog?retryWrites=true&w=majority'

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('db connection'))
  .catch((err) => console.log('db error', err))


const app = express(); //create express app
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });


//can read json file
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'))


app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'),
  (req, res) => {
    res.json({
      url: `/uploads/${req.file.originalname}`
    })
  })

  app.get('/tags', PostController.getLastTags)

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.get('/posts/tags', PostController.getLastTags)
app.post('/posts', checkAuth, handleValidationErrors, postCreateValidation, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, handleValidationErrors, postCreateValidation, PostController.update);

app.listen(process.env.PORT || 4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('Server OK');
})