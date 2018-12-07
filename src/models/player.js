const NOOB_K = 56;
const BEGINNER_K = 48;
const MODERATE_K = 40;
const INTERMEDIATE_K = 32;
const ADVANCED_K = 24;
const ALL_STAR_K = 16;

class Player {
    constructor(sqlObject) {
        this.playerID = sqlObject.playerID;
        this.name = sqlObject.name;
        this.nickname = sqlObject.nickname;
        this.elo = sqlObject.elo;
    }

    getWinProbabilityAgainst(opposingPlayer) {
        let factor = 1 + Math.pow(10, (opposingPlayer.elo - this.elo)/400);
        return 1/factor;
    }

    get KFactor() {
        if (this.elo < 1200)
            return NOOB_K;
        if (this.elo < 1500)
            return BEGINNER_K;
        if (this.elo < 1800)
            return MODERATE_K;
        if (this.elo < 2100)
            return INTERMEDIATE_K;
        if (this.elo < 2400)
            return ADVANCED_K;

        return ALL_STAR_K;
    }

    getNewRating(opposingPlayer, win) {
        let winProbability = this.getWinProbabilityAgainst(opposingPlayer);
        return Math.round(this.elo + this.KFactor * ((win ? 1 : 0) - winProbability));
    }
}

module.exports = Player;
