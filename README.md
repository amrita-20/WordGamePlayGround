# Server-side Dynamic Site

## Goals

- Build a web-based word guessing game
  - this site use only backend-generated HTML
  - this site use no front-end JS
## Functional Requirements

For all the below:

- A "game" means one specific secret word is chosen and the user takes multiple turns making guesses
  - A "new game" means a new secret word is selected, the number of guesses made is reset to 0, and the list of possible words is reset to the full list
    - Statistics about previous games may be preserved
- "valid guess" means a guess that is one of the possible words that has not already been guessed this game
  - guess are not case-sensitive, so "these" is a valid guess if one of the possible words is "THESE"
- "invalid guess" means a guess that is not one of remaining possible words
  - This includes words that would never be valid (are not on the full list of possible words) and words that are on the list of possible words that have been previously guessed this game.
- "incorrect guess" means a valid guess that is not the secret word
- "correct guess" means a valid guess that IS the secret word (case-insensitive)
  - A guess that shares all of the letters of the secret word but is NOT the secret word (such as EAT vs TEA), is NOT a correct guess and does not win the game

### Home Page

When the User loads the page (path: `/`)

- the site will determine if the user is logged in (based on `sid` session cookie)

- If the user is not logged in:

  - the page will display a login form instead of the below content
  - the login form will ask for a username but will NOT ask for a password
  - the login form will POST to `/login` (see "The Login Flow")

- A logged in user will see:

  - A list of words the secret word could be
  - A list of any previously guessed words and how many letters each matched (see "Making a Guess")
  - A count of how many valid guesses they have made so far this game (essentially, a score a player wants to keep low)
  - What their most recent valid guess was, and how many letters it matched
    - or, if their previous guess was invalid they will be told that guess and that it was invalid
  - If their previous guess was correct: a message saying they have won
  - If their previous guess was incorrect: an option to make another guess (see "Making a Guess")
  - An option to logout
  - An option to start a new game
  - Notice: All of the above is true even if they reload the page. The user stays logged in and the displayed information does not change
  - You can choose how to display the above information. You might combine the list of available words and the list of guessed words and matches, or you might have them as separate lists, for example. What matters is:
    - The information is all present
    - The information is understandable to an average user

- A different user will see the above information for themselves, not the information of a different user, and their game is not altered if another player is playing a separate game at the same time
  - Use different browsers or browser-profiles to test this - each profile can log in separately as different users

### Making a Guess

A guess will be sent as a POST to the path `/guess`

- The server will check for a valid session id
  - If there is not a valid session id, the page will display a message and a login form
    - Hint: an invalid session id could come from manually changing your cookie or restarting the server (the server will forget all session ids, but the browser will still have the sid cookie)
- The server will check for a valid guess
  - If the guess is not valid, the server will update the server state for that player and respond with a redirect to the Home Page
  - If the guess is valid, the server will update the server state for that player and respond with a redirect to the Home Page
  - Hint: See "Home Page" for ideas on what details the server state will have to know. If we had a database much of that information would be there, but because we do not we will simply hold the state data in different objects. Remember to keep information for different players separate.

The guess is evaluated for how many letters match between the guess and secret word (see "Starting a New Game"), regardless of position of the letters in the word and regardless of the upper/lower case of the letters.

- Hint: This should sound like an earlier assignment

### Starting a New Game

A new game begins when a user starts a new game or logs in for the first time.

- A secret word is picked at random from the list of available words
  - Hint: see Math.random() at https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
  - The list of available words is exported by the provided `words.js` file
    - `require()` this file in your JS to get the array of words.
    - You may change the words in words.js, but you should not otherwise alter the file.
      - Your game code must still work if we replace words.js with a different list of words that are exported the same way

If the user is starting a new game by virtue of logging in for the first time, it is done as part of login and does not require extra navigation in the browser

If the user is manually starting a new game, it is done as a POST to `/new-game`

- The server will check for a valid session id
  - If there is not a valid session id, the page will display a message and a login form
    - Hint: an invalid session id could come from manually changing your cookie or restarting the server (the server will forget all session ids, but the browser will still have the sid cookie)
- If there is a valid session, after updating the state, the response will redirect to the Home Page.

To help with grading, the server will `console.log()` the username and the chosen secret word whenever a new game is started for a player.

- This is not a debugging console.log(). Be careful to make sure all debugging console.log() statements are removed before turning in your project

Important: No information is sent to the browser that allows someone to learn the secret word without playing the game

### The Login Flow

Login is performed as a POST to `/login`

- It will send only the username, no password
- If the username is valid the server will respond with a `sid` cookie using a uuid.
  - a "valid username" is one composed only of allowed characters
    - You select the list of valid characters
  - Enforce the validity of the username by having an allowlist of valid characters
  - explicitly disallow username "dog"
    - This simulates a user with a bad password, since we aren't using passwords
  - after setting the cookie header, respond with a redirect to the Home Page
  - a user with a valid username will always be treated as if the are an existing user
    - There is no user registration
- If the username is invalid (including "dog"), respond with a login form that contains a message about the username being invalid



