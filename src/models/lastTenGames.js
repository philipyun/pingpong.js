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
}

module.exports = LastTenGames;
