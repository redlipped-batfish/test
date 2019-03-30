const databaseMiddleware = {};
const { Client } = require('pg');

const client = new Client();

databaseMiddleware.saveUserInfo = (req, res, next) => {
  await client.connect();
  const {email, token} = req.body;
  const result = await client.query(`INSERT INTO (email, accessToken) VALUES (${email}, ${token});`);
  await client.end();
  next();
};

databaseMiddleware.getUserProjects = (req, res, next) => {
  await client.connect();
  let cookie = req.cookie;
  res.body.email = await client.query(`SELECT email FROM users WHERE sessionid=${res.cookie}`)
  res.body.result = await client.querry(`SELECT projectname, id FROM users WHERE email=${res.body.email}`);
  await client.end();
  next();
};
cer
module.exports = databaseMiddleware;