CREATE TABLE `games` (
	`gameID`	INTEGER UNIQUE,
	`player1`	INTEGER,
	`player2`	INTEGER,
	`player1Score`	INTEGER,
	`player2Score`	INTEGER,
	`datetime`	DATETIME,
	FOREIGN KEY(`player1`) REFERENCES `players`(`playerID`),
	FOREIGN KEY(`player2`) REFERENCES `players`(`playerID`),
	PRIMARY KEY(`gameID`)
);
