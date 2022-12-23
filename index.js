const express = require('express');
const app = express();
const connectDB = require('./config/db');

connectDB();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

