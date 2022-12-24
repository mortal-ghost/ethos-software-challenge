const express = require('express');
const app = express();
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
connectDB();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/api/files', require('./routes/files'));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
    console.log(__dirname);
});