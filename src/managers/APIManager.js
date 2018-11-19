const DataManager = require("./DataManager");

class APIManager {
    // Players

    async createPlayer(req, res, next) {
        let { playerName, nickname } = req.body;
        try {
            await DataManager.createPlayer(playerName, nickname);
            res.status(200);
            res.send(true);
        } catch (e) {
            res.status(500);
            res.send(e.message);
        }
    }

    async getPlayer(req, res, next) {
        let { playerID } = req.body;
        try {
            let player = await DataManager.getPlayer(playerID);
            res.status(200);
            res.send(JSON.stringify(player));
        } catch (e) {
            // should check type of error and possibly send 404
            res.status(500);
            res.send(e.message);
        }
    }

    async getPlayers(req, res, next) {
        let players = await DataManager.getPlayers();
        res.send(players);
    }

    async deletePlayer(req, res, next) {
        try {
            await DataManager.deletePlayer(req.params.playerID);
            res.status(200);
            res.send(true);
        } catch (e) {
            res.status(500);
            res.send(e.message);
        }
    }

    async deleteAllPlayers(req, res, next) {
        try {
            await DataManager.resetPlayers();
            res.status(200);
            res.send(true);
        } catch (e) {
            res.status(500);
            res.send(e.message);
        }
    }

    // Games

    async getGames(req, res, next) {
        let games = await DataManager.getGames(req.params.playerID);
        res.send(games);
    }

    async createGame(req, res, next) {
        let { player1, player2, player1Score, player2Score } = req.body;
        try {
            await DataManager.createGame(player1, player2, player1Score, player2Score);
            res.status(200);
            res.send(true);
        } catch (e) {
            res.status(500);
            res.send(e.message);
        }
    }

    async deleteAllGames(req, res, next) {
        try {
            await DataManager.resetGames();
            res.status(200);
            res.send(true);
        } catch (e) {
            res.status(500);
            res.send(e.message);
        }
    }

    // Stats

    async getStats(req, res, next) {
        let {playerID} = req.params;
        try {
            let stats = await DataManager.getStats(playerID);
            res.status(200);
            res.send(stats);
        } catch (e) {
            res.status(500);
            res.send(e.message);
        }
    }

    async getStandings(req, res, next) {
        try {
            let standings = await DataManager.getStandingsTable();
            res.status(200);
            res.send(standings);
        } catch (e) {
            res.status(500);
            res.send(e.message);
        }
    }

    // Matchup

    async getMatchup(req, res, next) {
        let {player1ID, player2ID} = req.params;
        try {
            let odds = await DataManager.getMatchupPredictions(player1ID, player2ID);
            res.status(200);
            res.send(odds);
        } catch (e) {
            res.status(500);
            res.send(e.message);
        }
    }
}

let manager = new APIManager();
module.exports = manager;
