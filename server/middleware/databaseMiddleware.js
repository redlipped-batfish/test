const databaseMiddleware = {};
const pg = require('pg');
const uri = 'postgres://admin:password123@localhost/endpoint';

// Document all the information for tables and indexes
// ** create unique index unique_github on users (github_handle); **

databaseMiddleware.saveUserInfo = async (req, res, next) => {
  // Future improvement: to decrease
  const client = new pg.Client(uri);
  await client.connect(error => {
    if (error) return console.error('could not connect to postgres', err);
  });

  //THE LOGIN VARIABLE IS KNOWN AS github_handle IN THE DATABASE
  const { login, accessToken, name, email, avatar_url, sessionId } = res.locals;

  console.log('This is res.locals', res.locals);
  const findUserQuery = `SELECT * FROM users WHERE github_handle='${login}'`;
  const findUserQueryResult = await client.query(findUserQuery);

  console.log('findUserQueryResult: ', findUserQueryResult);
  if (findUserQueryResult.rows.length) {
    console.log('updating!!!!!!');
    const query = `UPDATE users SET session_id = '${sessionId}' WHERE github_handle = '${login}'`;

    try {
      await client.query(query);
    } catch (error) {
      console.log('Failed to update.', error);
    }
  } else {
    console.log('INSERTING!!!!!!');
    const query = `INSERT INTO users (email, session_id, access_token, user_avatar, name, github_handle) 
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
    const values = [email, sessionId, accessToken, avatar_url, name, login];

    try {
      await client.query(query, values);
    } catch (error) {
      console.log('Failed to insert.', error);
    }
  }

  await client.end();
  next();
};

databaseMiddleware.getUserProjects = async (req, res, next) => {
  //this function queries the db 3x in succession to get user -> projects -> tests as a result object
  //might want to refactor to use a sql join statement at some point
  const client = new pg.Client(uri);
  await client.connect(error => {
    if (error) {
      res.json({
        isAuthenticated: false,
        breakPoint: 'getUserProjects initial db connection',
      });
      return console.error('could not connect to postgres', err);
    }
    console.log('successfully connected to db, now fetching user row');
  });

  ///////////////////////////////////////
  /////////////////////////query for user
  const userQuery = `SELECT * FROM users WHERE session_id='${
    req.cookies.secret
  }'`;
  const userQueryResult = await client.query(userQuery);
  const user = userQueryResult.rows[0];
  console.log('USER FROM USER QUERY RESULTS: ', user);
  if (!user) {
    res.json({
      isAuthenticated: false,
      breakPoint:
        'userQuery failed within getUserProjects, could not find user with that session_id',
    });
    return console.log('error, failed to find user within getUserProjects');
  }

  ///////////////////////////////////////
  /////////////////////////query for projects of that user
  const projectsQuery = `SELECT * FROM projects WHERE user_id='${
    user.user_id
  }'`;
  const projectsQueryResult = await client.query(projectsQuery);
  const projects = projectsQueryResult.rows;
  console.log('PROJECTS FROM PROJECTS QUERY RESULTS: ', projects);
  if (!projects.length) {
    res.json({
      isAuthenticated: true,
      breakPoint: 'no problem, just no projects for this user ',
      projects: [],
      tests: [],
    });
    return console.log(
      'error, failed to find project within getUserProjects (maybe no projects yet for that user)',
    );
  }

  ///////////////////////////////////////
  /////////////////////////query for tests for each project of that user
  const tests = [];
  for (let project of projects) {
    const testsQuery = `SELECT * FROM tests WHERE project_id='${
      project.project_id
    }'`;
    const testsQueryResult = await client.query(testsQuery);
    const testsFromThisProject = testsQueryResult.rows;
    for (let test of testsFromThisProject) {
      tests.push(test);
    }
  }

  console.log(tests);

  await client.end();
  res.json({
    isAuthenticated: true,
    breakPoint: 'successfully fetched tests',
    tests: tests,
  });
};

module.exports = databaseMiddleware;
