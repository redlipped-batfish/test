const databaseMiddleware = {};
const pg = require('pg');
const uri = 'postgres://admin:password123@localhost/endpoint';

// Document all the information for tables and indexes
// ** create unique index unique_github on users (github_handle); **

databaseMiddleware.saveUserInfo = async (req, res, next) => {
  // Future improvement: to decrease
  console.log('We are saving');
  const client = new pg.Client(uri);
  await client.connect(error => {
    if (error) return console.error('could not connect to postgres', err);
  });
  const { login, accessToken, name, email, avatar_url, sessionId } = res.locals;
  console.log('This is res.locals', res.locals);
  query = `INSERT INTO users (email, session_id, access_token, user_avatar, name, github_handle) 
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
  const values = [email, sessionId, accessToken, avatar_url, name, login];
  try {
    await client.query(query, values);
  } catch (error) {
    console.log('User already exists.', error);
  }
  await client.end();
  next();
};

databaseMiddleware.getUserProjects = async (req, res, next) => {
  const client = new pg.Client(uri);
  await client.connect(error => {
    if (error) return console.error('could not connect to postgres', err);
  });
  res.body.email = await client.query(
    `SELECT github_handle FROM users WHERE sessionid=${req.cookie.secret}`,
  );
  res.body.result = await client.query(
    `SELECT projectname, id FROM projects WHERE email=${res.body.email}`,
  );
  await client.end();
  next();
};

module.exports = databaseMiddleware;
