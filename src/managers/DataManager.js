const sqlite = require('sqlite3').verbose();
const fs = require('fs');

const ERRORS = require('../defines/errors');
const {Player, PlayerStats, Game} = require('../models');

class DataManagerError {
    constructor(errorCode, data) {
        this.status = errorCode;
        this.data = data;
    }
}


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
            this.db.run("INSERT INTO players (name, nickname) VALUES (?, ?)", [playerName, nickname], (error) => {
                if (error === null)
                    res();
                else
                    rej(new DataManagerError(ERRORS.CREATE_PLAYER, {error}));
            });
        });
    }

    updatePlayerELO(playerID, playerELO) {
        return new Promise((res, rej) => {
            this.db.run("UPDATE players SET elo = ? WHERE playerID = ?", [playerELO, playerID], (error) => {
                if (error === null)
                    res();
                else
                    rej(new DataManagerError(ERRORS.UPDATE_PLAYER_ELO, {error, playerID}));
            });
        });
    }

    deletePlayer(playerID) {
        return new Promise((res, rej) => {
           this.db.run("DELETE FROM players WHERE playerID = (?)", playerID, (error) => {
               if (error === null)
                   res();
               else
                   rej(new DataManagerError(ERRORS.DELETE_PLAYER, {error, playerID}))
           })
        });
    }

    getPlayer(playerID) {
        return new Promise((res, rej) => {
            this.db.get("SELECT * FROM players WHERE playerID = (?)", playerID, (error, data) => {
                if (data === undefined)
                    rej(new DataManagerError(ERRORS.GET_PLAYER, {error, playerID}));
                else
                    res(new Player(data));
            });
        });
    }

    getPlayers() {
        return new Promise((res, rej) => {
            this.db.all("SELECT * FROM players", [], (error, data) => {
                if (error === null)
                    res(data.map(playerData => new Player(playerData)));
                else
                    rej(new DataManagerError(ERRORS.GET_PLAYERS, {error}));
            });
        });
    }

    getPlayerELOs() {
        return new Promise((res, rej) => {
            this.db.all("SELECT playerID, elo FROM players", [], (error, data) => {
                if (error === null && Array.isArray(data) && data.length !== 0)
                    res(data);
                else
                    rej(new DataManagerError(ERRORS.GET_PLAYER_ELOS, {error}));
            });
        });
    }

    resetPlayers() {
        return new Promise((res, rej) => {
            this.db.run("DELETE FROM players", [], (error) => {
                if (error === null)
                    res();
                else
                    rej(new DataManagerError(ERRORS.RESET_PLAYERS, {error}));
            });
        });
    }

    // Games

    getGames(playerID=null) {
        const sql = playerID === null
            ? "SELECT * FROM games ORDER BY datetime DESC"
            : "SELECT * FROM games WHERE player1 = (?) OR player2 = (?) ORDER BY datetime DESC";

        const args = playerID === null ? [] : [playerID, playerID];

        return new Promise((res, rej) => {
            this.db.all(sql, args, (error, data) => {
                if (error === null)
                    res(data.map(gameData => new Game(gameData)));
                else
                    rej(new DataManagerError(ERRORS.GET_GAMES, {error}));
            })
        })
    }

    async _createGame(player1ID, player2ID, player1Score, player2Score) {
        let player1 = await this.getPlayer(player1ID);
        let player2 = await this.getPlayer(player2ID);
        let player1Odds = player1.getWinProbabilityAgainst(player2);
        let player2Odds = player2.getWinProbabilityAgainst(player1);

        let winner = (player1Score > player2Score) ? player1 : player2;
        let loser = (player1Score > player2Score) ? player2 : player1;
        let winnerOdds = (player1Score > player2Score) ? player1Odds : player2Odds;
        let loserOdds = (player1Score > player2Score) ? player2Odds : player1Odds;
        let winningScore = Math.max(player1Score, player2Score);
        let losingScore = Math.min(player1Score, player2Score);


        player1.updateRating(player2, winner === player1ID);
        player2.updateRating(player1, winner === player2ID);

        this.updatePlayerELO(player1.playerID, player1.elo);
        this.updatePlayerELO(player2.playerID, player2.elo);

        const datetime = new Date().toISOString();

        return new Promise((res, rej) => {
            const gameInsert = ("INSERT INTO games (winner, loser, winningScore, losingScore, winnerOdds," +
                " loserOdds, datetime) VALUES (?,?,?,?,?)");

            let args = [
                winner,
                loser,
                winningScore,
                losingScore,
                winnerOdds,
                loserOdds,
                datetime
            ];

            this.db.run(gameInsert, args, (error) => {
                if (error === null) {
                    res({
                        winner,
                        loser,
                        winningScore,
                        losingScore,
                        winnerOdds,
                        loserOdds,
                        datetime
                    });
                } else {
                    rej(new DataManagerError(ERRORS.CREATE_GAME), {error});
                }
            });
        });
    }

    async createGame(player1ID, player2ID, player1Score, player2Score) {
        try {
            return await this._createGame(player1ID, player2ID, player1Score, player2Score);
        } catch (reason) {
            throw new DataManagerError(ERROR.CREATE_GAME, {reason});
        }
    }

    resetGames() {
        return new Promise((res, rej) => {
            this.db.run("DELETE FROM games", [], (error) => {
                if (error === null)
                    res();
                else
                    rej(new DataManagerError(ERRORS.RESET_GAMES, {error}));
            });
        });
    }

    async getMatchupPredictions(player1ID, player2ID) {
        try {
            let player1 = await this.getPlayer(player1ID);
            let player2 = await this.getPlayer(player2ID);

            return {
                player1Odds: player1.getWinProbabilityAgainst(player2),
                player2Odds: player2.getWinProbabilityAgainst(player1)
            };
        } catch (reason) {
            throw new DataManagerError(ERROR.GET_MATCHUP, {reason});
        }

    }

    // Stats

    async getStats(playerID) {
        try {
            let player = this.getPlayer(playerID);
            let games = await this.getGames(playerID);
            return PlayerStats.IndividualStats(playerID, player.elo, games);
        } catch (reason) {
            throw new DataManagerError(ERROR.GET_STATS, {reason});
        }

    }

    async getStandingsTable() {
        try {
            let games = await this.getGames();
            let playerELOs = await this.getPlayerELOs();
            let standings = new Standings(games, playerELOs);

            return standings.getStandingsTable();
        } catch (reason) {
            throw new DataManagerError(ERROR.GET_STANDINGS, {reason});
        }
    }
}

let manager = new DataManager();
manager.createTables();

module.exports = manager;


