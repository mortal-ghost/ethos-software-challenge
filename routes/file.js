const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { exec } = require('child_process');
const Audio = require('../models/audio');
const mv = require('mv');
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
const mongoose = require('mongoose');
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
    upload(req, res, async (err) => {
        if (err) {
            console.log(err);
            return res.redirect('/error');
        }

        if (!req.file) {
            console.log('No file received');
            return res.redirect('/error');
        }

        const newAudio = new Audio({});
        await newAudio.save();
        console.log(newAudio);
        const filename = `${req.user.username}_${newAudio._id}.mp3`;
        newAudio.path = path.join(__dirname, 'public/audio', filename);
        newAudio.id = String(newAudio._id);
        newAudio.userid = String(req.user._id);
        newAudio.comments = [];
        await newAudio.save();
        console.log(newAudio);
        let command = `python3 vid.py ${req.file.filename}`;
        let error = false;

        await exec(command, async (error, stdout, stderr) => {
            if (error || stderr) {
                
                error = true;
            }
        }).on('exit', (code) => {
            console.log(`Child exited with code ${code}`);
            if (code !== 0) {                
                error = true;
            }

            if (!error) {
                const oldFilename = req.file.filename.split('.')[0] + '.mp3';
                const oldPath = path.join(__dirname, '..',oldFilename);
                const newPath = path.join(__dirname,'..' , 'public/audio', `${req.user.username}_${newAudio._id}.mp3`);
    
                mv(oldPath, newPath, (err) => {
                    if (err) {
                        console.log(err);
                        error = true;
                    }
                });
            }
            
            if (!error) {
                return res.redirect(`/play_music/${newAudio.id}`);
            } else {
                return res.redirect('/error');
            }
        });
    });
});

module.exports = router;