const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

app.use(express.static(path.resolve(__dirname, '../build')));
app.use(express.json());

app.get('/', (req, res) => {
  res.json('hi');
});

app.listen(port);
