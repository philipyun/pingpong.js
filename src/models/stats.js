const VICTORY = true;
const LOSS = false;

class Stats {
    constructor() {
        this.wins = 0;
        this.losses = 0;
        this.overtimeLosses = 0;
        this.lastTen = []; // 0th/9th index <=> newest/oldest
        this.streak = 0; // positive/negative <=> winning/losing
    }

    get winPercent() {
        return (this.wins / (this.wins + this.losses)) * 100;
    }

    get gamesPlayed() {
        return this.wins + this.losses;
    }

    addMatch(pointsFor, pointsAgainst) {
        if (pointsFor > pointsAgainst) {
            this.addVictory();
        } else {
            this.addLoss(pointsAgainst > 11);
        }
    }

    addVictory() {
        this.wins++;
        if (this.streak >= 0) {
            this.streak++;
        } else {
            this.streak = 1;
        }
        this.addToLastTen(VICTORY);
    }

    addLoss(overtime) {
        this.losses++;
        if (this.streak <= 0) {
            this.streak--;
        } else {
            this.streak = -1;
        }
        if (overtime) {
            this.overtimeLosses++;
        }
        this.addToLastTen(LOSS);
    }

    addToLastTen(outcome) {
        this.lastTen.push(outcome);
        if (this.lastTen.length > 10) {
            this.lastTen.splice(0, this.lastTen.length - 10);
        }
    }
}

module.exports = Stats;
