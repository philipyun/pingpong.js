const sqlite = require('sqlite3').verbose();
const fs = require('fs');

const Player = require('../models/player');


class DataManager {

    constructor() {
        this.db = new sqlite.Database("pingpong.db");
    }

    createTables() {
        let playersSchema = fs.readFileSync("sql_schemas/players.sql", {encoding: "utf8"});
        let gamesSchema = fs.readFileSync("sql_schemas/games.sql", {encoding: "utf8"});

        this.db.serialize(() => {
            this.db.exec(playersSchema, () => console.log("players table created"));
            this.db.exec(gamesSchema, () => console.log("games table created"));
        });
    }

    // Players

    createPlayer(playerName, nickname="") {
        return new Promise((res, rej) => {
            this.db.run("INSERT INTO players (name, nickname) VALUES (?, ?)", [playerName, nickname], (e) => {
                if (e === null)
                    res();
                else
                    rej(e);
            });
        });
    }

    updatePlayerELO(playerID, playerELO) {
        return new Promise((res, rej) => {
            this.db.run("UPDATE players SET elo = ? WHERE playerID = ?", [playerELO, playerID], (e) => {
                if (e === null)
                    res();
                else
                    rej(e);
            });
        });
    }

    deletePlayer(playerID) {
        return new Promise((res, rej) => {
           this.db.run("DELETE FROM players WHERE playerID = (?)", playerID, (err) => {
               if (err === null)
                   res();
               else
                   rej(err)
           })
        });
    }

    getPlayer(playerID) {
        return new Promise((res, rej) => {
            this.db.get("SELECT * FROM players WHERE playerID = (?)", playerID, (err, data) => {
                if (err === null)
                    res(new Player(data));
                else
                    rej(err);
            });
        });
    }

    getPlayers() {
        return new Promise((res, rej) => {
            this.db.all("SELECT * FROM players", [], (err, data) => {
                if (err === null)
                    res(data);
                else
                    rej(err);
            });
        });
    }

    resetPlayers() {
        return new Promise((res, rej) => {
            this.db.run("DELETE FROM players", [], (err) => {
                if (err === null)
                    res();
                else
                    rej();
            });
        });
    }

    // Games

    getGames() {
        return new Promise((res, rej) => {
            this.db.all("SELECT * FROM games ORDER BY gameID DESC", [], (err, data) => {
                if (err === null)
                    res(data);
                else
                    rej(err);
            })
        })
    }

    createGame(player1ID, player2ID, player1Score, player2Score) {
        return new Promise((res, rej) => {
            this.db.serialize(async () => {
                let player1 = null;
                let player2 = null;

                try {
                    player1 = await this.getPlayer(player1ID);
                    player2 = await this.getPlayer(player2ID);
                } catch (e) {
                    let missingPlayer = player1 === null ? player1ID : player2ID;
                    rej(Error('Player ID does not exist: ' + missingPlayer));
                    return;
                }

                // did player1 upset player2 and vice versa
                let player1Upset = (player1.elo > player2.elo) && (player1Score > player2Score);
                let player2Upset = (player2.elo > player1.elo) && (player2Score > player1Score);
                // true if an upset happened this game
                let upset = player1Upset || player2Upset;

                player1.updateRating(player2, player1Score > player2Score);
                player2.updateRating(player1, player2Score > player1Score);

                this.updatePlayerELO(player1.playerID, player1.elo);
                this.updatePlayerELO(player2.playerID, player2.elo);

                const gameInsert = "INSERT INTO games (player1, player2, player1Score, player2Score) VALUES (?,?,?,?)";
                this.db.run(gameInsert, [player1ID, player2ID, player1Score, player2Score], (err) => {
                    if (err === null)
                        res({upset});
                    else
                        rej(err);
                });
            });
        });
    }

    resetGames() {
        return new Promise((res, rej) => {
            this.db.run("DELETE FROM games", [], (err) => {
                if (err === null)
                    res();
                else
                    rej();
            });
        });
    }

    getMatchupPredictions(player1ID, player2ID) {
        return new Promise(async (res, rej) => {
            try {
                let player1 = await this.getPlayer(player1ID);
                let player2 = await this.getPlayer(player2ID);

                res({
                    player1Odds: player1.getWinProbabilityAgainst(player2),
                    player2Odds: player2.getWinProbabilityAgainst(player1)
                });
            } catch (e) {
                rej(e);
            }
        });
    }
}

let manager = new DataManager();

manager.createTables();
module.exports = manager;


