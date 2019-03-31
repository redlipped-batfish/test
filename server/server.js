const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const {
  getAccessToken,
  checkSession,
  generateRedirectURI,
  getUserInfo,
  createSession,
} = require('./middleware/authenticationMiddleware');
const {
  saveUserInfo,
  getUserProjects,
} = require('./middleware/databaseMiddleware');
const port = 3000;

// global variables
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.resolve(__dirname, '../build')));

// end points

app.get('/', (req, res) => {
  return res.sendFile(path.join(__dirname, '../build/index.html'));
});

app.get('/login', generateRedirectURI, (req, res) => {
  console.log('uriii', res.githubURI);
  res.header('Access-Control-Allow-Origin', '*');
  res.redirect(res.githubURI);
});

app.get(
  '/authorize',
  getAccessToken,
  getUserInfo,
  createSession,
  saveUserInfo,
  (req, res) => {
    res.redirect(); // redirect to index.html
  },
);

app.get('/isAuthenticated', checkSession, getUserProjects, (req, res) => {
  res.json();
});

app.get('/userInfo', checkSession, getUserProjects, (req, res) => {
  next();
});

app.post('/userInfo', (req, res) => {
  next();
});

//ADDED BY CHRISTIAN FOR TESTING FRONT END
app.get('/test', (req, res) => {
  console.log('received test fetch get');
  res.json('success');
});

app.post('/test', (req, res) => {
  console.log('received test fetch POST');
  res.json('success');
});

app.listen(port);
