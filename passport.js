import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { appDatabase } from './start.js';

const customFields = {
  usernameField: 'email',
  passwordField: 'password'
};

const verify = async (username, password, authResult) => {
  const user = await appDatabase.collection('users').findOne({ username }).catch(err => console.error(err));

  if (!user) return authResult(null, false).catch(err => authResult(err)); // error = null, let user in = false
  const isValid = validatePass(password, user.password);

  isValid ? authResult(null, user).catch(err => authResult(err)) : authResult(null, false).catch(err => authResult(err));

};

const strategy = new LocalStrategy(customFields, verify);
passport.use(strategy);

