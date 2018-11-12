class Game {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.player1score = -1;
        this.player2score = -1;
    }

    recordGame(player1score, player2score) {
        let player1wins = player1score > player2score;

        this.player1.updateRating(this.player2, player1wins);
        this.player2.updateRating(this.player1, !player1wins);

    }
}
