const express = require('express');
const app = express();
const { v4: uuidV4 } = require('uuid');
const passport = require('passport');
const bodyParser = require('body-parser');
const LocalStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
const session = require('express-session');
const userRoute = require('./routes/user');
const flash = require('connect-flash');
const { exec } = require('child_process');
const fs = require('fs');
const http = require('http');
const socketIO = require('socket.io');
const fileupload = require("express-fileupload");
const server = http.Server(app);
var multer = require('multer');
var upload = multer({ dest: 'public/videos' });
const connectDB = require('./config/db');
const isLoggedIn = require('./utils/middleware');

app.use(session({
    secret: 'whatever you want',
    resave: false,
    saveUninitialized: false
}));

connectDB();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());


app.use(fileupload());
var User = require('./models/user');
var Audio = require('./models/audio');
var Comment = require('./models/comment')
var Tag = require('./models/tag')

const { exists } = require('./models/user');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(flash());
const io = socketIO(server);


io.on('connection', socket => {
    console.log('Someone connected');
    let AUDIO_ID;
    socket.on('hello', async (value) => {
        socket.join(value);
        AUDIO_ID = value;
        console.log(value);
        let tempAudio = await Audio.findOne({ id: AUDIO_ID });
        socket.emit('comments', tempAudio.comments);

    });
    socket.on('indexhello', async (value) => {
        console.log(value);
    })

    socket.on('tagvalue', async (value) => {
        console.log(value);

        let results = await Tag.find({ tag: value });
        console.log(results);
        if (!results) {
            socket.emit('tagresults', 'Found Nothing');
        }
        else {

            let finalresults = [];

            for (let i = 0; i < results.length; i++) {
                let comment = await Comment.findOne({_id: results[i].comment});
                console.log(comment);
                finalresults.push(comment);
            }
            socket.emit('tagresults',finalresults);
        }
    })
    socket.on('addcomment', async (comment) => {
        // console.log(comment);
        console.log('I am from the server and from the function add comment,and below is comment content');
        console.log(comment);
        let currentComment = new Comment({ title: comment.title, timestampMinutes: comment.timestampMinutes, timestampSeconds: comment.timestampSeconds, content: comment.content, tags: [] });
        await currentComment.save();
        console.log('I am from the server and from the function add comment,and below is Saved comment content');
        console.log(currentComment);

        let currentAudio = await Audio.findOne({ id: AUDIO_ID });
        for (let i = 0; i < comment.tags.length; i++) {
            let tag = new Tag({ tag: comment.tags[i], comment: currentComment._id });
            await tag.save();
            currentComment.tags.push(tag._id);
        }
        await currentComment.save();
        currentAudio.comments.push(currentComment._id);
        await currentAudio.save();
        console.log('I am from the server and from the function add comment,and below is current audio comments');
        console.log(currentAudio.comments);

        let commentsToBeSent = [];

        for (let i = 0; i < currentAudio.comments.length; i++) {
            let tempcomment = await Comment.findOne({ _id: currentAudio.comments[i] });
            console.log('This is temp comment');
            console.log(tempcomment);
            commentsToBeSent.push(tempcomment);
        }
        socket.emit('comments', commentsToBeSent);
        await currentAudio.save();
    });
});

//When you even redirect from any route, it will come below first, I mean the request will re propagate.
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    if (req.user) {
        CurrentUserID = req.user._id;
    }
    else {
        CurrentUserID = null;
    }
    next();
})

app.use('/user', userRoute);

app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.post('/url', async (req, res) => {
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
})
app.post('/files', upload.single('file'), (req, res) => {
    console.log(req.files);
    if (req.files) {
        console.log(req.files);
        var file = req.files.file;
        var filename = file.name
        console.log(filename);
        file.mv('./public/videos/' + filename, function (err) {
            if (err) {
                res.send(err);
            }
            else {
                res.send("file uploaded");
            }
        })
    }
})
app.get('/play_music/:id', async (req, res) => {
    console.log('I am called');
    if (req.user) {
        console.log(req.params.id);
        const newAudio = await Audio.findOne({ id: req.params.id });
        console.log('Audio output below!');
        console.log(newAudio);
        let filename = req.user.username + '_' + req.params.id + '.mp3';
        res.render('play.ejs', { filename: filename, comments: newAudio.comments, audio_id: req.params.id, Audio: Audio });
    }
    else {
        res.render('index.ejs');
    }

});
app.get('/error', (req,res)=>{

    res.render('error');
    
});

app.get('/upload_file', isLoggedIn, (req, res) => {
    res.render('input');
});

app.get('/all_projects', isLoggedIn, async (req, res) => {

    const allAudios = await Audio.find({ userid: String(req.user._id) });

    res.render('allprojects.ejs', { allAudios: allAudios });
});

server.listen(3000, (err) => {

    if (err) {
        console.log(err);
    }
    else {
        console.log('App is listening in port 3000');
    }
});
