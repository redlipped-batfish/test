![end.](https://i.imgur.com/ASSmsuI.png)

## Instructions for testing of Endpoint with localhost:3000 and a locally installed postgresql database

(An alternative to running a local instance of postgres db is to use the cloud db service ElephantSQL, skip next two sections if you prefer that route)

#### In terminal, with postgresql installed globally

createdb endpoint

psql endpoint

#### In psql command line interface:

create role admin with login password 'password123';

grant all privileges on database endpoint to admin;

alter role admin superuser createrole createdb replication;

#### (alternative ElephantSQL instructions start here) THE FOLLOWING COMMANDS SHOULD BE RUN IN psql cli (or elephantSQL 'browser' tab after registering and replacing your free elephantsql database url with the DATABASE_URL string in the project's .env file) IN ORDER, THIS ASSUMES YOU HAVE PSQL INSTALLED AND A USER CALLED 'admin' WITH A PASSWORD OF 'password123'

drop table tests;

drop table projects;

drop table users;

create table users (user_id SERIAL PRIMARY KEY, name VARCHAR, email VARCHAR, github_Handle VARCHAR, session_ID VARCHAR, access_token VARCHAR, user_avatar VARCHAR);

create table projects (project_id SERIAL PRIMARY KEY, project_name VARCHAR, user_id INTEGER REFERENCES users(user_id));

create table tests (test_id SERIAL PRIMARY KEY, url VARCHAR, endpoint VARCHAR, contentType VARCHAR, requestType VARCHAR, requestBody VARCHAR, expectedResStatusCode VARCHAR, expectedResBody VARCHAR, project_id INTEGER REFERENCES projects(project_id));

## Now, before continuing, run the project in the browser (npm run dev) and click on the github OAuth button, this will create a user in the db once you are redirected back to localhost:3000

insert into projects (project_name, user_id) values ('first_project', 1);

insert into tests (url, endpoint, contenttype, requesttype, requestbody, expectedresstatuscode, expectedresbody, project_id) values ('http://localhost:3000', '/test', 'application/json', 'GET', 'testing request body', '200: OK', 'success', 1);

insert into tests (url,endpoint,contenttype,requesttype,requestbody,expectedresstatuscode,expectedresbody,project_id) values ('http://localhost:3000', '/test', 'application/json', 'POST', 'testing request body', '200: OK', 'success', 1);

insert into tests (url,endpoint,contenttype,requesttype,requestbody,expectedresstatuscode,expectedresbody,project_id) values ('http://localhost:3000', '/test404', 'application/json', 'POST', 'testing request body', '404: Not Found', '', 1);

#### Test the db with these commands, should have one user, one project, and three tests

select \* from users;

select \* from projects;

select \* from tests;


## Running the project:


Once the database stuff above is done, in the project directory run:

npm install

npm run dev

(if 'npm run dev' doesn't work, try 'npm run build' followed by 'npm start' then navigate to localhost:3000)
