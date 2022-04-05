import { appDatabase, bcrypt } from '../start.js';
import { bcryptjs } from 'bcryptjs';


const login = async (req, res) => {
  const user = await appDatabase.collection('users')
    .findOne({ email: req.body.email });

  if(!user) {
    res.render('login', { title: 'Login', body: req.body, flashes: ['User does not exist.'] });
    return;
  };

  if(user) {
    // const isValid = await bcrypt.compare(req.body.password, user.password);
    const isValid = await bcryptjs.compare(req.body.password, user.password);
    console.log(isValid);

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