class Streak {
    constructor() {
        this.count = 0;
    }

    addWin() {
        if (this.count < 0)
            return;

        this.count++;
    }

    addLoss() {
        if (this.count > 0)
            return;

        this.count--;
    }

    toString() {
        if (this.count < 0) {
            return `L${this.count}`;
        } else if (this.count > 0) {
            return `W${this.count}`;
        } else {
            return null;
        }
    }
}

module.exports = Streak;
