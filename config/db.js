const mongoose = require('mongoose');
require('dotenv').config();

function connectDB() {
    mongoose.set('strictQuery', false);
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
    });

    const db = mongoose.connection;

    db.on('error', (error) => console.error(error));

    db.once('open', () => console.log('Connected to MongoDB'));
}

module.exports = connectDB;