const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const DataManager = require("./managers/DataManager");
const APIManager = require("./managers/APIManager");

const V1 = "/api/v1";
const PLAYERS = V1 + "/players";
const GAMES = V1 + "/games";
const STATS = V1 + "/stats";
const MATCHUP = V1 + "/matchup/:player1ID/:player2ID";

app.use(bodyParser.json());

// PLAYERS API
app.get(PLAYERS, APIManager.getPlayers);
app.get(PLAYERS + "/:playerID", APIManager.getPlayer);
app.post(PLAYERS, APIManager.createPlayer);
app.delete(PLAYERS, APIManager.deleteAllPlayers);
app.delete(PLAYERS + "/:playerID", APIManager.deletePlayer);

// GAMES API
app.get(GAMES, APIManager.getGames);
app.get(GAMES + "/:playerID", APIManager.getGames);
app.post(GAMES, APIManager.createGame);
app.delete(GAMES, APIManager.deleteAllGames);

// STATS API
app.get(STATS, APIManager.getStats);

// MATCHUP API
app.get(MATCHUP, APIManager.getMatchup);


app.listen(8080);
