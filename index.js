const express = require('express');
const randomstring = require('randomstring');
const app = express();
const port = 8080;
const querystring = require('querystring');
const axios = require('axios')

app.listen(port, () => {
    console.log('Listening on port 8080');
})

app.get('/login', (req, res) => {
    const state = randomstring.generate(16);
    const scope = 'user-read-private%20user-read-email%20user-top-read';
    res.redirect(`https://accounts.spotify.com/authorize?client_id=102fca1d546c40c99647f9ce7c69a203&response_type=code&redirect_uri=http://localhost:8080&scope=${scope}&state=${state}`);
})

app.get('/callback', (req, res) => {
    var code = req.query.code || null;
    var state = req.query.state || null;
    var client_id = '102fca1d546c40c99647f9ce7c69a203';
    var client_secret = '43a405a9bb9148e7a5985fc234b266ed';
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: code,
            redirect_uri: 'http://localhost:8080',
            grant_type: 'authorization_code'
        },
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
        },
        json: true
    };
})

