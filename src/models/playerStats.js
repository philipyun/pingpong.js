const LastTenGames = require('./lastTenGames');
const Streak = require('./streak');

class PlayerStats {

    static IndividualStats(playerID, elo, games) {
        let stats = new PlayerStats(playerID, elo);

        for (let game of games) {
            let {winner, loser, winningScore, losingScore, trollGame, overTimeGame, upset} = game.results;

            if (winner === playerID) {
                stats.addWin(winningScore, losingScore, trollGame, overTimeGame, upset);
            } else {
                stats.addLoss(losingScore, winningScore, trollGame, overTimeGame, upset);
            }
        }

        stats.finalizeStats();

        // we don't need GB stat when looking at an individual player
        delete stats.gamesBehind;

        return stats;
    }

    constructor(id, elo) {
        this.playerID = id;
        this.eloScore = elo;

        this.wins = 0;
        this.losses = 0;
        this.overTimeWins = 0;
        this.overTimeLosses = 0;
        this.trollWins = 0;
        this.trollLosses = 0;
        this.upsetWins = 0;
        this.upsetLoses = 0;
        this.pointsScored = 0;
        this.pointsAllowed = 0;
        this.streak = new Streak();
        this.lastTen = new LastTenGames();

        // stats computed after accumulating basic details
        this.totalGames = 0;
        this.percentage = 0;
        this.gamesBehind = 0;
        this.winDiff = 0;
        this.pointDiff = 0;
    }

    addWin(ptsScored, ptsAllowed, trollGame, overTimeGame, upset) {
        this.pointsScored += ptsScored;
        this.pointsAllowed += ptsAllowed;

        this.wins++;

        if (trollGame)
            this.trollWins++;

        if (overTimeGame)
            this.overTimeWins++;

        if (upset)
            this.upsetWins++;

        this.streak.addWin();
        this.lastTen.addWin();
    }

    addLoss(ptsScored, ptsAllowed, trollGame, overTimeGame, upset) {
        this.pointsScored += ptsScored;
        this.pointsAllowed += ptsAllowed;

        this.losses++;

        if (trollGame)
            this.trollLosses++;

        if (overTimeGame)
            this.overTimeLosses++;

        if (upset)
            this.upsetLoses++;

        this.streak.addLoss();
        this.lastTen.addLoss();
    }

    finalizeStats() {
        this.totalGames = this.wins + this.losses;
        this.percentage = this.wins / this.totalGames;
        this.winDiff = this.wins - this.losses;
        this.pointDiff = this.pointsScored - this.pointsAllowed;

        this.streak = this.streak.toString();
        this.lastTen = this.lastTen.toString();
    }

    computeGamesBehind(topPlayerStats) {
        this.gamesBehind = (topPlayerStats.winDiff - this.winDiff) / 2;
    }
}

module.exports = PlayerStats;
