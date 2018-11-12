const sqlite = require('sqlite3').verbose();
const fs = require('fs');


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

    deletePlayer(playerId) {
        return new Promise((res, rej) => {
           this.db.run("DELETE FROM players WHERE playerID = (?)", playerId, (err) => {
               if (err === null)
                   res();
               else
                   rej(err)
           })
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

    createGame(player1, player2, player1_score, player2_score) {
        return new Promise((res, rej) => {
            this.db.serialize(() => {
                for (let playerId of [player1, player2]) {
                    const playerIdSelect = "SELECT player_id FROM players WHERE player_id=(?)";
                    this.db.get(playerIdSelect, [playerId], (err, row) => {
                        if (!row) {
                            rej(Error('Player ID does not exist: ' + playerId));
                        }
                    });
                }

                const gameInsert = "INSERT INTO games (player1, player2, player1_score, player2_score) VALUES (?,?,?,?)";
                this.db.run(gameInsert, [player1, player2, player1_score, player2_score], (err) => {
                    if (err === null)
                        res();
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
}

let manager = new DataManager();

manager.createTables();
module.exports = manager;


