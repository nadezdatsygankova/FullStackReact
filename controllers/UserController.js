
import userModel from '../modules/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new userModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      {
        expiresIn: '30d',
      },
    );
    const { passwordHash, ...userData } = user._doc;
    res.json({
      ...userData,
      token
    })


  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "failed to register"
    })
  }
};

export const login = async (req, res) => {
  try {
    const user = await userModel.findOne({
      email: req.body.email
    })
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }
    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
    if (!isValidPass) {
      return res.status(400).json({
        message: 'Invalid login or password'
      })
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      {
        expiresIn: '30d',
      },
    );
    const { passwordHash, ...userData } = user._doc;
    res.json({
      ...userData,
      token
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "failed to login"
    })
  }
}

export const getMe = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { passwordHash, ...userData } = user._doc;
    res.json({
      ...userData
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Access denied",
    })
  }
}