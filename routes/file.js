const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const File = require('../models/file');
const { exec, exec } = require('child_process');
const Audio = require('../models/audio');
const mv = require('mv');
const { join } = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, '.'),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 * 100 }
}).single('file');


router.post('/', (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.redirect('/error');
        }

        if (!req.file) {
            return res.redirect('/error');
        }

        const newAudio = new Audio({});
        console.log(newAudio);

        let command = `python3 vid.py ${req.file.filename}`;

        exec(command, async (error, stdout, stderr) => {
            if (error || stderr) {
                Audio.deleteOne({ _id: newAudio._id }, (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
                return res.redirect('/error');
            } 
            const oldFilename = req.file.filename;
            const oldPath = path.join(__dirname, );
        });
        const filename = `${req.user.username}_${newAudio._id}.mp3`;
        newAudio.name = req.body.name;

    });
});

module.exports = router;