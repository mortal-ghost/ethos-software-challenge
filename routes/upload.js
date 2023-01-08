const express = require('express');
const router = express.Router();
const Audio = require('../models/audio');
const { exec } = require('child_process');
const isLoggedIn = require('../utils/middleware');

router.get('/upload_file', isLoggedIn, (req, res) => {
    res.render('input');
});

router.post('/url', isLoggedIn, async (req, res) => {
    console.log(req.body);
    const newAudio = Audio({});
    newAudio.name = req.body.name;
    await newAudio.save();
    newAudio.path = __dirname + '/public/audio/' + req.user.username + '_' + newAudio._id + '.mp3';
    newAudio.comments = [];
    newAudio.id = String(newAudio._id);
    newAudio.userid = String(req.user._id);
    await newAudio.save();
    const filename = req.user.username + '_' + newAudio._id + '.mp3';
    let command = "python3 " + "getyoutubeaudio.py " + "'" + req.body.url + "'" + " " + (req.user.username + '_' + newAudio._id);
    console.log(command);

    let end = 0;
    exec(command, async (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }

        console.log(`stdout: ${stdout}`);
        executefunc();
    });

    let value = 0;

    const executefunc = () => {
        if (value == 0) {
            console.log('The below is value');
            console.log(value);
            res.redirect('/play_music/' + newAudio._id);
            value++;
        }
    }
});

module.exports = router;
