require('./playerStats');

class Standings {
    constructor(games, playerELOs) {
        this.games = games;
        this.standingsMap = {};
        this.standingsTable = [];

        this.initTable(playerELOs);
        this.accumlateBasicStats();
        this.finalizeStats();
    }

    initTable() {
        for (let {playerID, elo} of playerELOs) {
            this.standingsMap[playerID] = new PlayerStats(playerID, elo);
        }
    }

    accumlateBasicStats() {
        for (let game of this.games) {
            let {winner, loser, winningScore, losingScore, trollGame, overTimeGame, upset} = game.results;

            let winnerRow = this.standingsMap[winner];
            let losingRow = this.standingsMap[loser];

            winnerRow.addWin(winningScore, losingScore, trollGame, overTimeGame, upset);
            losingRow.addLoss(losingScore, winningScore, trollGame, overTimeGame, upset);
        }
    }

    finalizeStats() {
        for (let id of playerIDs) {
            let standingsRow = this.standingsMap[id];
            standingsRow.finalizeStats();
            this.standingsTable.push(standingsRow)
        }

        this.standingsTable.sort((player1, player2) => player2.percentage - player2.percentage);
        for (let i = 1; i < this.standingsTable.length; i++) {
            this.standingsTable[i].computeGamesBehind(this.standingsTable[0]);
        }
    }

    getStandingsTable() {
        return this.standingsTable;
    }
}

module.exports = Standings;
