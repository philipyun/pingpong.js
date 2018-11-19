CREATE TABLE `games` (
	`gameID`	INTEGER UNIQUE,
	`winner`	INTEGER,
	`loser`	INTEGER,
	`winningScore`	INTEGER,
	`losingScore`	INTEGER,
    `winnerOdds`  NUMERIC,
    `loserOdds`  NUMERIC,
	`datetime`	DATETIME,
	FOREIGN KEY(`winner`) REFERENCES `players`(`playerID`),
	FOREIGN KEY(`loser`) REFERENCES `players`(`playerID`),
	PRIMARY KEY(`gameID`)
);
