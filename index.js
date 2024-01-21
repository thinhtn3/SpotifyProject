const express = require('express');
const randomstring = require('randomstring');
const app = express();
const port = 8080;
const querystring = require('querystring');
const axios = require('axios')
const fetch = require('node-fetch')
const my_client_id = '102fca1d546c40c99647f9ce7c69a203';
const my_client_secret = '43a405a9bb9148e7a5985fc234b266ed'
let accessToken = undefined;
let refreshToken = undefined;

app.listen(port, () => {
    console.log('Listening on port 8080');
})

app.get('/login', (req, res) => {
    const state = randomstring.generate(16);
    const scope = 'user-read-private%20user-read-email%20user-top-read%20user-read-playback-state%20user-read-currently-playing';
    res.redirect(`https://accounts.spotify.com/authorize?client_id=102fca1d546c40c99647f9ce7c69a203&response_type=code&redirect_uri=http://localhost:8080/callback&scope=${scope}&state=${state}`);
});

app.get('/callback', (req, res) => {
    var params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', req.query.code);
    params.append('redirect_uri', 'http://localhost:8080/callback');
    // let params = {
    //     'grant_type': 'authorization_code',
    //     'code': req.query.code,
    //     'redirect_uri': 'http://localhost:8080/callback'
    // };
    const header = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + (new Buffer.from(my_client_id + ':' + my_client_secret).toString('base64'))
    }
    fetch('https://accounts.spotify.com/api/token', { method: 'POST', body: params, headers: header })
        .then(response => response.json())
        .then(data => {
            accessToken = data.access_token;
            refreshToken = data.refresh_token;
            res.redirect('http://localhost:8080/getTopTracks')
        })
})

app.get('/getTopTracks', (req, res) => {
    const accessHeader = {
        Authorization: 'Bearer ' + accessToken
    }
    fetch('https://api.spotify.com/v1/me/top/tracks', { method: 'GET', headers: accessHeader })
        .then(response => response.json())
        .then(data => {
            let topTrackArray = [];
            let trackRes = []
            for (tracks of data.items) {
                let topTrackArtistArr = [];
                let trackObject = {};
                trackObject.trackName = tracks.name;

                for (let i = 0; i < tracks.artists.length; i++) {
                    topTrackArtistArr.push(tracks.artists[i].name);
                }
                trackObject.artistNames = topTrackArtistArr;
                topTrackArray.push(trackObject);
            }
            
            for (tracks of topTrackArray) {
                console.log(tracks);
            }
            res.send(topTrackArray)
        })
})