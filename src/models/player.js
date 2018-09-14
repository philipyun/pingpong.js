const BEGINNER_K = 32;
const INTERMEDIATE_K = 24;
const ADVANCED_K = 16;

class Player {
    constructor(id, name, elo) {
        this.id = id;
        this.name = name;
        this.elo = elo;
    }

    getWinProbabilityAgainst(opposingPlayer) {
        let factor = 1 + Math.pow(10, (opposingPlayer.elo - this.elo)/400);
        return 1/factor;
    }

    get KFactor() {
        if (this.elo < 2100)
            return BEGINNER_K;
        if (this.elo < 2400)
            return INTERMEDIATE_K;

        return ADVANCED_K;
    }

    updateRating(opposingPlayer, win) {
        let winProbability = this.getWinProbabilityAgainst(opposingPlayer);
        this.elo = Math.round(this.elo + this.KFactor * ((win ? 1 : 0) - winProbability));
        return this.elo;
    }
}
