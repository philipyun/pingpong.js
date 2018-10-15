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
           this.db.run("DELETE FROM players WHERE player_id = (?)", playerId, (err) => {
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


