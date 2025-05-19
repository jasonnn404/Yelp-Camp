const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../../utils/catchAsync');
const User = require('../../models/user');

// POST /api/users/register - register a new user
router.post('/register', catchAsync(async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    
    req.login(registeredUser, err => {
      if (err) return next(err);
      res.json({ success: true, user: { id: registeredUser._id, username: registeredUser.username } });
    });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
}));

// POST /api/users/login - login a user
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ success: false, message: info.message });
    }
    req.login(user, err => {
      if (err) {
        return next(err);
      }
      return res.json({ success: true, user: { id: user._id, username: user.username } });
    });
  })(req, res, next);
});

// GET /api/users/logout - logout a user
router.get('/logout', (req, res) => {
  req.logout();
  res.json({ success: true });
});

// GET /api/users/current - get current user
router.get('/current', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.json({ isAuthenticated: false, user: null });
  }
  res.json({ 
    isAuthenticated: true, 
    user: { 
      id: req.user._id, 
      username: req.user.username,
      email: req.user.email
    } 
  });
});

module.exports = router;
