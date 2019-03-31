const authenticationMiddleware = {};
const queryString = require('querystring');
const randomstring = require('randomstring');
const fetch = require('node-fetch');
const app = require('../server');

require('dotenv').config();

authenticationMiddleware.generateRedirectURI = (req, res, next) => {
  console.log(res.locals.csrfString);
  const githubURI =
    'https://github.com/login/oauth/authorize?' +
    queryString.stringify({
      client_id: process.env.CLIENT_ID,
      redirect_uri: process.env.HOST + '/authorize',
      state: 'hello',
      scope: 'read:user',
    });
  res.locals.githubURI = githubURI;
  console.log(res.locals.githubURI);
  return next();
};

authenticationMiddleware.checkSession = (req, res, next) => {
  next();
};

authenticationMiddleware.getAccessToken = (req, res, next) => {
  console.log('request sent by Github:');
  console.log(req.query);
  console.log('uri', process.env.HOST + '/authorize');
  const { code, state } = req.query;
  if (state === 'hello') {
    fetch(
      'https://github.com/login/oauth/access_token?' +
        queryString.stringify({
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          code: code,
          redirect_uri: process.env.HOST + '/authorize',
          state: state,
        }),
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
        },
      },
    )
      .then(data => {
        return data.json();
      })
      .then(data => {
        res.locals.accessToken = data.access_token;
        return next();
      });
  } else {
    console.log('state not equal');
    return res.status(404).send();
  }
};

authenticationMiddleware.getUserInfo = (req, res, next) => {
  fetch('https://api.github.com/user', {
    headers: {
      Authorization: 'token ' + res.locals.accessToken,
      'User-Agent': 'Login-App',
    },
  })
    .then(response => {
      return response.json();
    })
    .then(data => {
      let { login, avatar_url, name, email, id } = data;
      console.log('This is data from github user:', data);
      res.locals = { ...res.locals, login, avatar_url, name, email, id };
      return next();
    });
};

authenticationMiddleware.createSession = (req, res, next) => {
  res.locals.csrfString = randomstring.generate({
    length: 12,
    charset: 'alphanumeric',
  });
  res.cookie('secret', res.locals.csrfString, { maxAge: '3600000' });
  next();
};

module.exports = authenticationMiddleware;
