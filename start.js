import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import crypto from 'crypto';
import flash from 'connect-flash';
import helpers from './helpers.js';
import routes from './routes.js';
import bcrypt from 'bcrypt'
import dotenv from 'dotenv';
dotenv.config({ path: 'variables.env' });


/*========================
EXPRESS
========================*/
const app = express();

// for ES6 purposes
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Session config
const sess = {
  secret: process.env.SECRET,
  key: process.env.KEY,
  sameSite: true,
  resave: false,
  saveUninitialized: false,
  genid: (req) => crypto.randomBytes(16).toString("hex"),
  cookie: { maxAge: 1000 * 60 * 60 * 24 },
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions'
  })
};

if(app.get('env') === 'production') { 
  app.set('trust proxy', 1); 
  sess.cookie.secure = true;
};

app.use(session(sess));

/*========================
MONGO DATABASE
========================*/
import mongodb from 'mongodb';
const ObjectId = mongodb.ObjectId; // unique ids for DB documents

// Connect to Database database
let appDatabase;

mongodb.connect(
  process.env.MONGO_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (err, client) {
    appDatabase = client.db();
    console.log(`Connected to: ${appDatabase.namespace}`);
  }
);


// Flash messages middleware
app.use(flash());

//Locals
app.use((req, res, next) => {
  res.locals.flashes = req.flash();
  res.locals.h = helpers;
  res.locals.user = req.session.user || null; 
  next(); // Calls next line of code --> app.use('/', routes);
});

// Handle routes
app.use('/', routes);


//START THE APP!
app.set('port', process.env.PORT || 8080);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running ->  PORT ${server.address().port}`);
});

export { appDatabase, ObjectId, bcrypt };


