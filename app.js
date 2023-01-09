const express = require('express');
const app = express();
const passport = require('passport');
const bodyParser = require('body-parser');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const flash = require('connect-flash');
const http = require('http');
const socketIO = require('socket.io');
const server = http.Server(app);
const connectDB = require('./config/db');
const userRoute = require('./routes/user');
const fileRoute = require('./routes/file');
const upload = require('./routes/upload');
const audio = require('./routes/audio');
const index = require('./routes/index');
const User = require('./models/user');
const Audio = require('./models/audio');
const Comment = require('./models/comment');
const Tag = require('./models/tag');
const methodOverride = require('method-override');

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
app.use(methodOverride('_method'));

// const { exists } = require('./models/user');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(flash());
const io = socketIO(server);

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    if (req.user) {
        CurrentUserID = req.user._id;
    }
    else {
        CurrentUserID = null;
    }
    next();
});

app.use(upload);
app.use(audio);
app.use(index);
app.use('/user', userRoute);
app.use('/files', fileRoute);

io.on('connection', socket => {
    let AUDIO_ID;
    socket.on('hello', async (value) => {
        socket.join(value);
        AUDIO_ID = value;
        let tempAudio = await Audio.findOne({ id: AUDIO_ID });
        let totalComments = [];

        for (let i = 0; i < tempAudio.comments.length; i++) {
            let tempcomment = await Comment.findOne({ _id: tempAudio.comments[i] });
            totalComments.push(tempcomment);
        }
        socket.emit('comments', totalComments);

    });
    socket.on('indexhello', async (value) => {
        console.log(value);
    })

    socket.on('tagvalue', async (value) => {
        console.log(value);

        let results = await Tag.find({ tag: value });
        if (!results) {
            socket.emit('tagresults', 'Found Nothing');
        }
        else {

            let finalresults = [];

            for (let i = 0; i < results.length; i++) {
                let comment = await Comment.findOne({ _id: results[i].comment });
                finalresults.push(comment);
            }
            socket.emit('tagresults', finalresults);
        }
    })
    socket.on('addcomment', async (comment) => {
        // console.log(comment);
        let currentAudio = await Audio.findOne({ id: AUDIO_ID });
        let currentComment = new Comment({ title: comment.title, timestampMinutes: comment.timestampMinutes, timestampSeconds: comment.timestampSeconds, content: comment.content, tags: [] });
        await currentComment.save();

        for (let i = 0; i < comment.tags.length; i++) {
            let tag = new Tag({ tag: comment.tags[i], comment: currentComment._id });
            await tag.save();
            currentComment.tags.push(tag._id);
        }
        await currentComment.save();
        currentAudio.comments.push(currentComment._id);
        await currentAudio.save();

        let commentsToBeSent = [];

        for (let i = 0; i < currentAudio.comments.length; i++) {
            let tempcomment = await Comment.findOne({ _id: currentAudio.comments[i] });
            commentsToBeSent.push(tempcomment);
        }
        socket.emit('comments', commentsToBeSent);
        await currentAudio.save();
    });
});

server.listen(3000, (err) => {

    if (err) {
        console.log(err);
    }
    else {
        console.log('App is listening in port 3000');
    }
});
