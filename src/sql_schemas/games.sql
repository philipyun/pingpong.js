CREATE TABLE `games` (
	`game_id`	INTEGER UNIQUE,
	`player1`	INTEGER,
	`player2`	INTEGER,
	`player1_score`	INTEGER,
	`player2_score`	INTEGER,
	FOREIGN KEY(`player1`) REFERENCES `players`(`player_id`),
	FOREIGN KEY(`player2`) REFERENCES `players`(`player_id`),
	PRIMARY KEY(`game_id`)
);
