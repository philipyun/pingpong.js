const TROLL_LOSE_MAX_SCORE = 0;
const OVERTIME_MIN_SCORE = 10;

class Game {
    constructor(sqlObject) {
        this.winner = sqlObject.winner;
        this.loser = sqlObject.loser;
        this.winningScore = sqlObject.winningScore;
        this.losingScore = sqlObject.losingScore;
        this.winnerOdds = sqlObject.winnerOdds;
        this.loserOdds = sqlObject.loserOdds;
        this.datetime = sqlObject.datetime;
        this.upset = this.winnerOdds < this.loserOdds;
    }

    get results() {
        let trollGame = this.losingScore <= TROLL_LOSE_MAX_SCORE;
        let overTimeGame = this.losingScore >= OVERTIME_MIN_SCORE;

        return {
            trollGame,
            overTimeGame,
            winner: this.winner,
            loser: this.loser,
            winningScore: this.winningScore,
            losingScore: this.losingScore,
            upset: this.upset
        }
    }
}

module.exports = Game;
