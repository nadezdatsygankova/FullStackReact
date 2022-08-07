import { body } from 'express-validator'

export const registerValidation =[
  body('email', 'invalid email format').isEmail(),
  body('password', 'invalid password format, length must be a main 5 characters').isLength({min: 5}),
  body('fullName', 'invalid full name format, length must be a main 3 characters').isLength({min: 3}),
  body('avatarUrl', 'invalid Url format').optional().isURL(),
];

export const loginValidation =[
  body('email', 'invalid email format').isEmail(),
  body('password', 'invalid password format, length must be a main 5 characters').isLength({min: 5}),
];

export const postCreateValidation =[
  body('title', 'Enter title post').isLength({min: 3}).isString(),
  body('text', 'Enter text post').isLength({min: 3}).isString(),
  body('tags', 'Invalid tags post').optional().isArray(),
  body('imageUrl', 'Invalid Url format').optional().isString(),
];