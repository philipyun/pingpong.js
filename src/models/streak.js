class Streak {
    constructor() {
        this.count = 0;
        this.stopCounting = false;
    }

    addWin() {
        if (this.stopCounting || this.count < 0) {
            this.stopCounting = true;
            return;
        }
        this.count++;
    }

    addLoss() {
        if (this.stopCounting || this.count > 0) {
            this.stopCounting = true;
            return;
        }
        this.count--;
    }

    toString() {
        if (this.count < 0) {
            return `L${Math.abs(this.count)}`;
        } else if (this.count > 0) {
            return `W${this.count}`;
        } else {
            return "W0";
        }
    }
}

module.exports = Streak;
