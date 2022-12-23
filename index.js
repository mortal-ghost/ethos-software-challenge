const express = require('express');
const app = express();
const connectDB = require('./config/db');
const server = require('http').createServer(app);
connectDB();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/api/files', require('./routes/files'));

app.get('/', (req, res) => {
    res.render('index');
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});