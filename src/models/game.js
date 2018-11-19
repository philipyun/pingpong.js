const TROLL_LOSE_MAX_SCORE = 2;
const OVERTIME_MIN_SCORE = 10;

class Game {
    constructor(sqlObject) {
        this.player1 = sqlObject.player1;
        this.player2 = sqlObject.player2;
        this.player1Score = sqlObject.player1Score;
        this.player2Score = sqlObject.player2Score;
        this.player1Odds = sqlObject.player1Odds;
        this.player2Odds = sqlObject.player2Odds;
        this.upset = !!sqlObject.upset;
        this.datetime = sqlObject.datetime;
    }

    get results() {
        let winner = (this.player1Score > this.player2Score) ? this.player1 : this.player2;
        let loser = (this.player1Score > this.player2Score) ? this.player2 : this.player1;
        let winningScore = Math.max(this.player1Score, this.player2Score);
        let losingScore = Math.min(this.player1Score, this.player2Score);
        let trollGame = losingScore <= TROLL_LOSE_MAX_SCORE;
        let overTimeGame = losingScore >= OVERTIME_MIN_SCORE;

        return {
            winner,
            loser,
            winningScore,
            losingScore,
            trollGame,
            overTimeGame,
            upset: this.upset
        }
    }
}

module.exports = Game;
