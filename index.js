const express = require('express');
const app = express();
require('dotenv').config();
const path = require('path');

const PORT = process.env.PORT || 3000;
const fs = require('fs');

const ejs = require('ejs');

app.set('view engine', 'ejs');

app.use(express.static('views'));








app.get('/listPlayers', (request, response) => {
    response.render('playerList');
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });