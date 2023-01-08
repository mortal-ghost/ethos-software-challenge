const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { exec } = require('child_process');
const Audio = require('../models/audio');
const mv = require('mv');

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


router.post('/', async (req, res) => {
    // console.log(req.body
    upload(req, res, async (err) => {
        console.log(req.file);
        if (!req.file) {
            console.log('No file received');
            return res.redirect('/error');
        }
        
        if (err) {
            console.log(err);
            return res.redirect('/error');
        }

        const newAudio = new Audio({});
        console.log(newAudio);
        const filename = `${req.user.username}_${newAudio._id}.mp3`;
        newAudio.name = req.body.name;
        newAudio.path = path.join(__dirname, 'public/audio', filename);
        newAudio.id = String(newAudio._id);
        newAudio.userid = String(req.user._id);
        newAudio.comments = [];
        await newAudio.save();
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
        }).on('exit', (code) => {
            console.log(`Child exited with code ${code}`);

            if (code !== 0) {
                Audio.deleteOne({ _id: newAudio._id }, (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
                return res.redirect('/error');
            }
            const oldFilename = req.file.filename.split('.')[0] + '.mp3';
            const oldPath = path.join(__dirname, oldFilename);
            const newPath = path.join(__dirname, 'public/audio', `${req.user.username}_${newAudio._id}.mp3`);

            mv(oldPath, newPath, (err) => {
                if (err) {
                    Audio.deleteOne({ _id: newAudio._id }, (err) => {
                        if (err) {
                            console.log(err);
                        }
                    });
                    console.log(err);
                }
                return res.redirect('/error');
            });
            res.redirect(`/play_music/${newAudio._id}`);
        });
    });
});

module.exports = router;