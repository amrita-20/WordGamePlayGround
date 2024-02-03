const gameWeb = {
  loginPage: function (errorMessage = "") {
    return `
    <!doctype html>
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link rel="stylesheet" href="/css/login.css" />
            <title>Login Page</title>
        </head>
        <body>
            <div id="login-container">
                <header class="header">
                    <div class="header-content">
                        <img src="/assets/game-logo.jpg" alt="letters written over cubes" />
                        <h1>MindWord Mysteries</h1>
                    </div> 
                </header>
                <main class="main">
                    <div class="wrapper">
                        <h2 class="main-title">Login Here</h2>
                        <p class="error">${errorMessage}</p>
                        <form class="login-form" action="/login" method="POST">
                            <div class="login-content">
                                <label class="login-label" for="username">Username</label>
                                <input class="login-input" id="username" name="username" type="text" />
                            </div>
                            <div class="button-container">
                                <button class="login-submit" type="submit">Login</button>
                            </div>
                        </form>
                    </div>
                </main>
                ${gameWeb.getFooter()}
            </div>
        </body>
    </html>
        `;
  },

  gamePage: function (
    username = '',
    words = [],
    previouslyGussedWords = [],
    validGuessCount = 0,
    statusMessage = '',
    status = ''
  ) {
    return `
        <!doctype html>
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="stylesheet" href="/css/game.css" />
                <title>Game Page</title>
            </head>
            <body>
                <div id="game-container">
                    <header class="header">
                        <div class="header-container">
                            <div class="header-content">
                                <img src="/assets/game-logo.jpg" alt="letters written over cubes" />
                                <h1>MindWord Mysteries</h1>
                            </div> 
                            <form class="new-game" action="/new-game" method="POST">
                                <button class="game-btn" type="submit">Start New Game</button>
                            </form>
                            <form class="logout-form" action="/logout" method="POST">
                                <button class="game-btn" type="submit">Logout</button>
                            </form>
                        </div>
                    </header>
                    <main class="main">
                        <div class="main-title">
                            <h2>Welcome ${username} ! Game is On</h2>
                            ${gameWeb.getStatusMessage(statusMessage, validGuessCount)}
                        </div>
                        <div class="word-list-container">
                            <div class="possible-word-container">
                                <h3>Possible Word List</h3>
                                ${gameWeb.getWords(words, previouslyGussedWords)}
                            </div>
                            <div class="guessed-word-conatiner">
                                <div class="form-container">
                                    ${gameWeb.getForm(status)}
                                </div>
                                <div>
                                    <div class="guessed-word-title"><span>Guessed Words </span> <span>Count of matched Letters</span></div>
                                    ${gameWeb.getPreviouslyGuessedword(previouslyGussedWords)}
                                </div>
                            </div>
                        </div>
                    </main>
                    ${gameWeb.getFooter()}
                </div>
            </body>
        </html>
        `;
  },

  getPreviouslyGuessedword: function (previouslyGussedWords) {
    return (
      `<ul class="guessed-words">` +
      previouslyGussedWords
        .map(
          (wordDetail) =>
            `<li class="guessed-words-item">
                <span class="word">${wordDetail.word}</span> 
                <span class="letters-count">${wordDetail.count}</span>
            </li>`
        )
        .join("") +
      `</ul>`
    );
  },

  getWords: function (words, previouslyGussedWords) {
    const strikeThrough = 'strike-through';
    return (
        `<ul class="word-list">` +
            words.map((word) => {
                if (previouslyGussedWords.some(wordDetail => wordDetail.word === word)) {
                    return `<li class="${strikeThrough}">${word}</li>`;
                } else {
                    return `<li>${word}</li>`;
                }
            }).join("") +
        `</ul>`
    );
  },

  getStatusMessage: function (statusMessage, validGuessCount){
    return (
        statusMessage && `<h3 class="status-msg">${statusMessage} <span class="count-status">!! your valid guess count is: ${validGuessCount}</span></h3>`
    )
  },

  getForm: function (status) {
    return (
        status.toUpperCase() !== 'FINISHED' ? 
        `<form class="guess-form" action="/guess" method="POST">
            <div class="guess-content">
                <label for="guess-word" class="guess-label">Guess Word</label>
                <input class="guess-input" id="guess-word" name="word" type="text"/>
            </div>
            <div class="button-container">
                <button class="guess-btn" type="submit">Guess</button>
            </div>
        </form>` : `<form class="new-game" action="/new-game" method="POST">
        <button class="game-btn" type="submit">Start New Game</button>
    </form>`
    )
  },

  getFooter: function () {
    return `<footer class="footer">
            <a href="privacy.html">Privacy Policy</p>
        </footer>`;
  },
};

module.exports = gameWeb;
