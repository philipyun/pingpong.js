CREATE TABLE `players` (
	`player_id`	INTEGER UNIQUE,
	`name`	TEXT,
	`nickname` TEXT,
	`elo`	NUMERIC DEFAULT 1000,
	PRIMARY KEY(`player_id`)
);
