# IN TERMINAL, WITH POSTGRES INSTALLED GLOBALLY:
createdb endpoint
psql endpoint

# IN PSQL CLI
create role admin with login password 'password123';
grant all privileges on database endpoint to admin;
alter role admin superuser createrole createdb replication;

# THE FOLLOWING COMMANDS SHOULD BE RUN IN psql cli IN ORDER
# THIS ASSUMES YOU HAVE PSQL INSTALLED AND A USER CALLED 'admin' WITH A PASSWORD OF 'password123'
drop table users;
drop table projects;
drop table tests;


create table users (user_id SERIAL PRIMARY KEY, name VARCHAR, email VARCHAR, github_Handle VARCHAR, session_ID VARCHAR, access_token VARCHAR, user_avatar VARCHAR);

create table projects (project_id SERIAL PRIMARY KEY, project_name VARCHAR, user_id INTEGER REFERENCES users(user_id));

create table tests (test_id SERIAL PRIMARY KEY, url VARCHAR, endpoint VARCHAR, contentType VARCHAR, requestType VARCHAR, requestBody VARCHAR, expectedResStatusCode VARCHAR, expectedResBody VARCHAR, project_id INTEGER REFERENCES projects(project_id));


insert into projects (project_name, user_id) values ('first_project', 1);

insert into tests (url, endpoint, contenttype, requesttype, requestbody, expectedresstatuscode, expectedresbody, project_id) values ('http://localhost:3000', '/test', 'application/json', 'GET', 'testing request body', '200: OK', 'success', 1);

insert into tests (url,endpoint,contenttype,requesttype,requestbody,expectedresstatuscode,expectedresbody,project_id) values ('http://localhost:3000', '/test', 'application/json', 'POST', 'testing request body', '200: OK', 'success', 1);

insert into tests (url,endpoint,contenttype,requesttype,requestbody,expectedresstatuscode,expectedresbody,project_id) values ('http://localhost:3000', '/test404', 'application/json', 'POST', 'testing request body', '404: Not Found', '', 1);

# TEST THE DB WITH THESE COMMANDS, SHOULD HAVE ZERO OR ONE USERS (DEPENDING IF AUTHENTICATION BUTTON HAS BEEN PRESSED SINCE DROPPING TABLES)
# SHOULD HAVE 1 PROJECT, 3 TESTS
select * from users;
select * from projects;
select * from tests;
