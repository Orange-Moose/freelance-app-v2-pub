import bcrypt from 'bcrypt';
import { appDatabase } from '../start.js';

const login = async (req, res) => {
  const user = await appDatabase.collection('users')
    .findOne({ email: req.body.email });

  if(!user) {
    res.render('login', { title: 'Login', body: req.body, flashes: ['User does not exist.'] });
    return;
  };

  if(user) {
    const isValid = await bcrypt.compare(req.body.password, user.password);
    
    if(!isValid) {
      res.render('login', { title: 'Login', body: req.body, flashes: ['Incorrect password.'] });
      return;
    }

    // Add data to session about logged in user
    req.session.user = {
      id: user._id,
      username: user.username,
      email: user.email
    };
    
    res.redirect('/');
  };
  
};

export { login };