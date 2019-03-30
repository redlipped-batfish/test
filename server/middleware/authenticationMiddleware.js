const authenticationMiddleware = {};
const queryString = require('querystring');

authenticationMiddleware.checkSession = (req, res, next) => {
  next();
};

authenticationMiddleware.getAccessToken = (req, res, next) => {
  console.log('request sent by Github:');
  console.log('req.query');
  const { code, state } = req.query;
  const csrfString = randomstring.generate({
    length: 12,
    charset: 'alphanumeric',
  });
  if (state === testState) {
    fetch(
      'https://github.com/login/oauth/access_token?' +
        queryString.stringify({
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          code: code,
          redirect_uri: process.env.HOST + '/authorize',
          state: csrfString,
        }),
      {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      },
    ).then(reseponse => {
      console.log(response);
      console.log(queryString.parse(response));
      res.body.accessToken = queryString.parse(response).access_token;
      next();
      // response should have the access token
      // save access token
      // create session for user and save on database
    });
  } else return res.status(404).send();
};

authenticationMiddleware.getUserInfo = (req, res, next) => {
  fetch('https://api.github.com/user', {
    headers: {
      Authorization: 'token' + req.body.accessToken,
      'User-Agent': 'Login-App',
    },
  }).then(response => {
    console.log(response);
    next();
  });
};

module.exports = sessionMiddleware;
