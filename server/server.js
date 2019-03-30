const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

app.use(express.static(path.resolve(__dirname, '../build')));
app.use(express.json());

//replace this with actual OAUTH stuff
app.get('/login', (req, res) => {
  console.log('user attempted login');
  res.header('Access-Control-Allow-Origin', '*');
  res.json('login testing');
});

app.get('/test', (req, res) => {
  console.log('hit test');
  res.header('Access-Control-Allow-Origin', '*');
  res.json('catman');
});

app.get('/', (req, res) => {
  res.json('hi');
});

app.listen(port);
