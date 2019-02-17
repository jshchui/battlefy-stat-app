const express = require('express');
const axios = require('axios');
const path = require('path');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

const API_PORT = process.env.PORT || 3001;
const app = express();

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/api/cow', (req, res) => {
  res.json({
    test: 'hello'
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

app.listen(API_PORT, () => console.log(`listening on port ${API_PORT}`));
