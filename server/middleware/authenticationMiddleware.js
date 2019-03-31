const authenticationMiddleware = {};
const queryString = require('querystring');
const randomstring = require('randomstring');
const fetch = require('node-fetch');

require('dotenv').config();

const csrfString = randomstring.generate({
  length: 12,
  charset: 'alphanumeric',
});

authenticationMiddleware.generateRedirectURI = (req, res, next) => {
  const githubURI =
    'https://github.com/login/oauth/authorize?' +
    queryString.stringify({
      client_id: process.env.CLIENT_ID,
      redirect_uri: process.env.HOST + '/authorize',
      state: 'hello',
      scope: 'read:user',
    });
  console.log('res github URI');
  res.githubURI = githubURI;
  console.log('git hub:....................', res.githubURI);
  // return;
  next();
};

authenticationMiddleware.checkSession = (req, res, next) => {
  next();
};

authenticationMiddleware.createSession = (req, res, next) => {
  res.cookie('secret', csrfString);
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
        res.accessToken = data.access_token;
        console.log('access toke is: ', res.accessToken);
        return next();
      });
  } else return res.status(404).send();
};

authenticationMiddleware.getUserInfo = (req, res, next) => {
  fetch('https://api.github.com/user', {
    headers: {
      Authorization: 'token ' + res.accessToken,
      'User-Agent': 'Login-App',
    },
  })
    .then(response => {
      return response.json();
      // save user info res
    })
    .then(data => {
      console.log(data);
    });
};

module.exports = authenticationMiddleware;
