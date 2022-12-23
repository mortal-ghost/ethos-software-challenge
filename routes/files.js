const { response } = require('express');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const File = require('../models/file');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const upload = multer({ 
    storage, 
    limits: { fileSize: 1000000 * 100 } 
}).single('myfile');

router.post('/', (req, res) => {
    upload((req, res, async(err) => {
        if (!req.file) {
            return res.send({ error: 'All fields are required.' });
        }

        if (err) {
            return res.send({ error: err.message });
        }

        const file = new File({
            filename: req.file.filename,
            path: req.file.path,
            size: req.file.size,
            uuid: uuidv4(),
        });

        const response = await file.save();

        return res.send({ file: `${process.env.APP_BASE_URL}/uploads/${response.uuid}` });
    }));
});