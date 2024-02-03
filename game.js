const words = require('./words');

const sessions = {};
const users = {};
const usernamePattern = /^[a-zA-Z0-9]+$/;

const isValidSession = (sid) => {
    if (!isEmpty(sessions) && sid) {
        if (sessions[sid]) {
            return true;
        }
    }
    return false;
};

const isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
};

const addSid = (sid, username) => {
    sessions[sid] = { username };
};

const validateUsername = (username) => {
    if (!username) {
        return 'Please enter unsername.';
    }
    if (username.toLowerCase() === 'dog') {
        return 'Username can not be dog';

    }
    if (!usernamePattern.test(username)) {
        return 'Username should contain only letters or numbers';
    }
    return '';
};

const deleteSid = (sid) => {
    if (isValidSession(sid)) {
        delete sessions[sid];
    }
};

const startGame = (sid) => {
    const username = sessions[sid].username;
    if (username) {
        users[username] = {
            turn: 0,
            secretWord: pickSecretdWord(),
            validGuessCount: 0,
            previouslyGussedWords: [],
            statusMessage: '',
            status: 'STARTED',
        };
    }
};
const pickSecretdWord = () => {
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
};

const validateGuess = (selectedWord, sid) => {
    const user = sessions[sid].username;
    const guessedWord = selectedWord.toLowerCase();
    const secretWord = users[user].secretWord.toLowerCase();
    users[user].turn++;
    if (!guessedWord) {
        users[user].statusMessage = 'invalid guess';
        return;
    }

    if (exactMatch(secretWord, guessedWord)) {
        users[user].status = 'FINISHED';
        users[user].validGuessCount++;
        users[user].statusMessage = `Congratulations! ${guessedWord} is correct word. You have won, start a new game to continue`;
        return;
    }
    if (!checkGuessWord(guessedWord)) {
        users[user].statusMessage = `${guessedWord} is an invalid guess try again!`;
        return;
    }
    if (checkGuessWord(guessedWord)) {
        const previouslyGussedWords = users[user].previouslyGussedWords;
        if (previouslyGussedWords && previouslyGussedWords.length > 0) {
            if (
                previouslyGussedWords.some(
                    (wordDetail) => wordDetail.word.toLowerCase() === guessedWord
                )
            ) {
                users[user].statusMessage = `${guessedWord} is an invalid guess try again!`;
                return;
            }
        }
        users[user].validGuessCount++;
        users[user].statusMessage = `${guessedWord} is a valid gues but incorrect. You are doing good keep playing!`;
        previouslyGussedWords.push({
            word: guessedWord,
            count: getMatchedLetters(secretWord, guessedWord),
        });
    }
};

const checkGuessWord = (guessWord) => {
    return words.some((word) => word.toLowerCase() === guessWord);
};

const getMatchedLetters = (secretWord, guessedWord) => {
    let count = 0;
    const charFrequency = {};
    for (const char of secretWord) {
        charFrequency[char] = (charFrequency[char] || 0) + 1;
    }
    for (const char of guessedWord) {
        if (charFrequency[char] > 0) {
            count++;
            charFrequency[char] = charFrequency[char] - 1;
        }
    }
    return count;
};

const getUserDetails = (sid) => {
    if (!isEmpty(users)) {
        const username = sessions[sid].username;
        if (username) {
            const userDetails = users?.[username];
            return userDetails || {};
        }
    }
    return {};
};

const exactMatch = (secretWord, guessedWord) => {
    return secretWord === guessedWord;
};

const game = {
    sessions,
    users,
    isValidSession,
    addSid,
    validateUsername,
    deleteSid,
    startGame,
    validateGuess,
    getUserDetails,
};

module.exports = game;
