const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const DataManager = require("./managers/DataManager");
const APIManager = require("./managers/APIManager");

const V1 = "/api/v1";
const PLAYERS = V1 + "/players";

app.use(bodyParser.json());

// PLAYERS API
app.get(PLAYERS, APIManager.getPlayers);
app.post(PLAYERS, APIManager.createPlayer);
app.delete(PLAYERS, APIManager.deleteAllPlayers);
app.delete(PLAYERS + "/:playerId", APIManager.deletePlayer);


app.listen(8080);
