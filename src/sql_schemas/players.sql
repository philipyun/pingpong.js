CREATE TABLE `players` (
	`playerID`	INTEGER UNIQUE,
	`name`	TEXT,
	`nickname` TEXT,
	`elo`	NUMERIC DEFAULT 1000,
	PRIMARY KEY(`playerID`)
);
