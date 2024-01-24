const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Connect to MongoDB (make sure MongoDB is running)
mongoose.connect('mongodb://localhost/code_sharing_db', { useNewUrlParser: true, useUnifiedTopology: true });

// Create a MongoDB model for storing codes
const CodeModel = mongoose.model('Code', { code: String });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve HTML page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// API endpoint for submitting code
app.post('/submit', (req, res) => {
    const code = req.body.code;

    // Save the code to MongoDB
    const newCode = new CodeModel({ code });
    newCode.save()
        .then(() => {
            res.send('Code submitted successfully!');
        })
        .catch((err) => {
            res.status(500).send('Error submitting code');
        });
});

// API endpoint for retrieving latest code
app.get('/latest', (req, res) => {
    CodeModel.findOne().sort({ _id: -1 })
        .then((latestCode) => {
            if (latestCode) {
                res.send(latestCode.code);
            } else {
                res.send('No code available');
            }
        })
        .catch((err) => {
            res.status(500).send('Error retrieving code');
        });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
