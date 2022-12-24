const { response } = require('express');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const File = require('../models/file');
const { spawn } = require('child_process');
const base = require('../cwd');
const videoToAudioScript = `${base}/files/videoToAudio.py`;

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'files/'),
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
            return res.send({ error: err.message });
        }

        if (!req.file) {
            return res.send({ error: 'All fields are required.' });
        }
        console.log(req.file);
        const script = spawn('python3', [videoToAudioScript, req.file.filename, '.wav']);

        script.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });

        script.on('close', async (code) => {
            console.log(`Script executed successfully with code: ${code}`);
            const audioFilename = req.file.filename.split('.')[0] + '.wav';
        
            const file = new File({
                filename: audioFilename,
                path: `${base}/files/${audioFilename}`,
                uuid: uuidv4()
            });

            const response = await file.save();
            return res.send("Hello");
        });

        script.on('error', (err) => {
            console.log(err);

            return res.send({ error: 'Error while executing script.' });
        });
    });
});

module.exports = router;
