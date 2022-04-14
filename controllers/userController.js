//Express-validator V6 docs: https://express-validator.github.io/docs/migration-v5-to-v6.html
import { body, validationResult } from 'express-validator';
import { appDatabase, bcrypt } from '../start.js';

///// REGISTRATION /////

const registerForm = (req, res) => {
  res.render('register', { title: 'Register', body: { username: '', email: '' } });
};

const validateRegister = async (req, res, next) => {
  await body('username', 'Username is required').notEmpty().run(req);
  await body('email', 'Email is not looking good')
    .isEmail()
    .trim()
    .normalizeEmail({ 
      all_lowercase: true,
      gmail_remove_dots: false
     })
    .custom(async (value, { req }) => {
      const count = await appDatabase.collection('users').countDocuments({ email: value });
      if (count > 0) throw new Error('This email already exists');
    })
    .run(req);
  await body('password', 'Password is less that 8 characters').isLength({ min: 8 }).run(req);
  await body('confirm-password', 'Passwords do not match')
    .exists()
    .custom((value, { req }) => value === req.body.password)
    .run(req);


  const validationResults = await validationResult(req);
  const errorMessages = validationResults.array().map(err => err.msg);
 
  if (errorMessages.length) {
    req.flash('errors', errorMessages);
  
    //reload with prefilled correct fields and error messages
    res.render('register', { title: 'Register', body: req.body, flashes: errorMessages });
    return;
  }
  next();
};

const register = async (req, res, next) => {
  // hash password
  const hash = await bcrypt.hash(req.body.password, 10);
  delete req.body['confirm-password'];

  const user = {
    username: req.body.username,
    password: hash,
    email: req.body.email,
    clients: []
  }


  // save user to database
  await appDatabase.collection('users')
    .insertOne(user)
    .then(result => console.log('User added'))
    .catch(err => console.error(err));

  next();
};


///// LOGIN /////
const loginForm = (req, res) => {
  res.render('login', { title: "Login" });
};

const logout = (req, res) => {
  delete req.session.user;
  console.log('Logged out.');
  res.redirect('login');
};



export { registerForm, register, validateRegister, loginForm, logout };