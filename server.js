const express = require('express');
const cookieParser = require('cookie-parser');
const uuidv4 = require('uuid').v4;
const game = require('./game');
const gameWeb = require('./game-web');
const words = require('./words');

const app = express();
const PORT = 3000;

app.use(express.static('./public'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    const sid = req.cookies.sid;
    if (game.isValidSession(sid)) {
        const { previouslyGussedWords, validGuessCount, statusMessage, status } = game.getUserDetails(sid);
        const username = game.sessions[sid].username;
        res.send(gameWeb.gamePage(username, words, previouslyGussedWords, validGuessCount, statusMessage, status));
    } else {
        res.send(gameWeb.loginPage());
    }
})

app.post('/login', (req, res) => {
    const username = req.body.username.trim();
    const errorMessage = game.validateUsername(username);
    if (errorMessage) {
        res.send(gameWeb.loginPage(errorMessage));
        return;
    }
    const sid = uuidv4();
    game.addSid(sid, username);
    res.cookie('sid', sid);
    if (!game.users[username]) {
        game.startGame(sid);
        console.log(`Username : ${username}, Secret Word: ${game.users[username].secretWord}`);
    }
    res.redirect('/');
})

app.post('/logout', (req, res) => {
    const sid = req.cookies.sid;
    res.clearCookie('sid');
    game.deleteSid(sid);
    res.redirect('/');
})

app.post('/new-game', (req, res) => {
    if (!game.isValidSession(req.cookies.sid)) {
        const errorMessage = 'Session is invalid, login to continue playing!'
        res.send(gameWeb.loginPage(errorMessage));
        return;
    }
    const username = game.sessions[req.cookies.sid].username;
    game.startGame(req.cookies.sid);
    console.log(`Username : ${username}, Secret Word: ${game.users[username].secretWord}`);
    res.redirect('/')

})

app.post('/guess', (req, res) => {
    const guessedWord = req.body.word.trim();
    if (!game.isValidSession(req.cookies.sid)) {
        const errorMessage = 'Session is invalid, login to continue playing!'
        res.send(gameWeb.loginPage(errorMessage));
        return;
    }
    game.validateGuess(guessedWord, req.cookies.sid);
    res.redirect('/');
})

app.listen(PORT);