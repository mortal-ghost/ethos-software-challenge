const express = require('express');
const router = express.Router();
const isLoggedIn = require('../utils/middleware');
const Audio = require('../models/audio');
const fs = require('fs');

router.get('/all_projects', isLoggedIn, async (req, res) => {
    const allAudios = await Audio.find({ userid: String(req.user._id) });

    res.render('allprojects.ejs', { allAudios: allAudios });
});

router.get('/play_music/:id', isLoggedIn, async (req, res) => {
    const audio = await Audio.findOne({ id: req.params.id });
    let filename = req.user.username + '_' + req.params.id + '.mp3';
    res.render('play.ejs', { filename: filename, comments: audio.comments, audio_id: req.params.id, Audio: Audio });
});

router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const audio = await Audio.findOne({ id: req.params.id });
    res.render('delete.ejs', { id: req.params.id, title: audio.name });
});

router.delete('/delete/:id', isLoggedIn, async (req, res) => {
    const audio = await Audio.findOne({ id: req.params.id });
    let filename = req.user.username + '_' + req.params.id + '.mp3';
    fs.unlinkSync('./public/audio/' + filename);
    await Audio.deleteOne({ id: req.params.id });
    res.redirect('/all_projects');
});

router.put('/rename/:id', isLoggedIn, async(req, res) => {
    const audio = await Audio.findOne({ id: req.params.id });
    audio.name = req.body.name;
    await audio.save();
    res.redirect('/all_projects');
});

module.exports = router;