const WIN = true;
const LOSS = false;

class LastTenGames {
    constructor() {
        this.games = [];
    }

    addWin() {
        if (this.games.length === 10) {
            return;
        }
        this.games.push(WIN);
    }

    addLoss() {
        if (this.games.length === 10) {
            return;
        }
        this.games.push(LOSS);
    }

    toString() {
        let wins = 0;
        let losses = 0;

        for (let result of this.games) {
            if (result === WIN) {
                wins++;
            } else {
                losses++;
            }
        }
        return `${wins}-${losses}`;
    }
}

module.exports = LastTenGames;
