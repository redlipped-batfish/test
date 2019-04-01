const authenticationMiddleware = {};
const queryString = require('querystring');
const randomstring = require('randomstring');
const fetch = require('node-fetch');
const pg = require('pg');
const uri = 'postgres://admin:password123@localhost/endpoint';
const app = require('../server');

require('dotenv').config();

authenticationMiddleware.generateRedirectURI = (req, res, next) => {
  const githubURI =
    'https://github.com/login/oauth/authorize?' +
    queryString.stringify({
      client_id: process.env.CLIENT_ID,
      redirect_uri: process.env.HOST + '/authorize',
      state: 'hello',
      scope: 'read:user',
    });
  res.locals.githubURI = githubURI;
  return next();
};

authenticationMiddleware.checkSession = async (req, res, next) => {
  //talk to Luis about the field namesto exactly send the request body
  console.log('checking session');
  let queryResult;
  const clientSecret = req.cookies.secret;
  const client = new pg.Client(uri);
  await client.connect(error => {
    if (error) {
      res.json({
        isAuthenticated: false,
        breakPoint: 'initial checksession db connection',
      });
      return console.error('could not connect to postgres', err);
    }
  });

  //WARNING: filter string must be wrapped in quotes, see below
  const query = `SELECT session_id FROM users WHERE session_id = '${clientSecret}'`;
  try {
    queryResult = await client.query(query);
  } catch (error) {
    console.log('sessionId lookup failed.', error);
    res.json({
      isAuthenticated: false,
      breakPoint: 'user session_id lookup db query',
    });
    return;
  }
  await client.end();

  //if the user sends us a legit cookie, we run the next middleware (serve them their tests)
  if (clientSecret === queryResult.rows[0].session_id) {
    next();
  } else {
    console.log('sessionID mismatch');
    res.json({
      isAuthenticated: false,
      breakPoint: 'client secret mismatched with database secret',
    });
  }
};

authenticationMiddleware.getAccessToken = (req, res, next) => {
  console.log('request sent by Github:');
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
      // console.log('This is data from github user:', data);
      res.locals = { ...res.locals, login, avatar_url, name, email, id };
      return next();
    });
};

authenticationMiddleware.createSession = (req, res, next) => {
  res.locals.sessionId = randomstring.generate({
    length: 12,
    charset: 'alphanumeric',
  });
  res.cookie('secret', res.locals.sessionId, { maxAge: '3600000' });
  next();
};

module.exports = authenticationMiddleware;
