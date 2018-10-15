const DataManager = require("./DataManager");

class APIManager {

    constructor() {

    }

    async createPlayer(req, res, next) {
        let { playerName, nickname } = req.body;
        try {
            await DataManager.createPlayer(playerName, nickname);
            res.status = 200;
            res.send(true);
        } catch (e) {
            res.stat = 500;
            res.send(false);
        }
    }

    async getPlayers(req, res, next) {
        let players = await DataManager.getPlayers();
        res.send(players);
    }

    async deletePlayer(req, res, next) {
        try {
            await DataManager.deletePlayer(req.params.playerId);
            res.status = 200;
            res.send(true);
        } catch (e) {
            res.status = 500;
            res.send(false);
        }
    }

    async deleteAllPlayers(req, res, next) {
        try {
            await DataManager.resetPlayers();
            res.status = 200;
            res.send(true);
        } catch (e) {
            res.status = 500;
            res.send(false);
        }

    }
}

let manager = new APIManager();
module.exports = manager;
