CREATE TABLE `games` (
	`game_id`	NUMERIC,
	`player1`	INTEGER,
	`player2`	INTEGER,
	`player1score`	INTEGER,
	`player2score`	INTEGER,
	FOREIGN KEY(`player1`) REFERENCES `players`(`player_id`),
	FOREIGN KEY(`player2`) REFERENCES `players`(`player_id`),
	PRIMARY KEY(`game_id`)
);
