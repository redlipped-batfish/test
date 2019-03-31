const databaseMiddleware = {};
const { Client } = require('pg');

const client = new Client();

databaseMiddleware.saveUserInfo = async (req, res, next) => {
  await client.connect();
  const { email, accessToken } = res;
  console.log('cooookkie', res.cookie);
  await client.query(
    `INSERT INTO (email, sessionid, accesstoken) VALUES (${email}, ${sessionid}, ${accessToken});`,
  );
  await client.end();
  next();
};

databaseMiddleware.getUserProjects = async (req, res, next) => {
  await client.connect();
  let cookie = req.cookie;
  res.body.email = await client.query(
    `SELECT email FROM users WHERE sessionid=${res.cookie}`,
  );
  res.body.result = await client.query(
    `SELECT projectname, id FROM projects WHERE email=${res.body.email}`,
  );
  await client.end();
  next();
};

module.exports = databaseMiddleware;
