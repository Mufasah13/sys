import express from 'express';
import User from '../models/Users.js';
import bcrypt from 'bcrypt';
import passport from 'passport';

const router = express.Router()

//REGISTER
router.post("/register", async (req, res, next) => {
  try {
    const user = await User.findOne({email: req.body.email});

    if (user) {
      req.flash('error', 'Email is already registered');
      return res.redirect('/register');
    } else {
      const hashedPassword = bcrypt.hashSync(req.body.password, 10);
      const newUser = new User({
        name: req.body.name,
        name2: req.body.name2,
        regNo: req.body.reg,
        email: req.body.email,
        myList: ['item1', 'item2', 'item3'],
        passwordHash: hashedPassword,
      });
      await newUser.save();
      res.redirect('/login');
    }
  } catch (err) {
    res.redirect("/register");
  }
});


export function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }else{
    res.redirect('/')
  }
}

export function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/dashboard')
  }else{
    next()
  }
}

export default router;