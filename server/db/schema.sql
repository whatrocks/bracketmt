/*

///////////////////////////////////////////
// ORIGINAL MYSQL DATABASE
///////////////////////////////////////////

///////////////////////////////////////////
// Drop tables
///////////////////////////////////////////

DROP TABLE matches;
DROP TABLE participants;
DROP TABLE tournaments;
DROP TABLE match_status;
DROP TABLE users;
DROP TABLE game_types;
DROP TABLE tournament_types;
DROP TABLE tournament_status;

///////////////////////////////////////////
// Database schema
///////////////////////////////////////////

CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT,
  first VARCHAR(30) NOT NULL,
  last VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL UNIQUE,
  salt VARCHAR(255) NOT NULL UNIQUE,
  hash VARCHAR(255) NOT NULL UNIQUE,
  PRIMARY KEY (id)
);

CREATE TABLE game_types (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  PRIMARY KEY (id)
);

CREATE TABLE tournament_types (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  PRIMARY KEY (id)
);

CREATE TABLE tournament_status (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  PRIMARY KEY (id)
);

CREATE TABLE match_status (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  PRIMARY KEY (id)
);

CREATE TABLE tournaments (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  shortname VARCHAR(50) NOT NULL UNIQUE,
  id_owner INT NOT NULL,
  id_game_types INT NOT NULL,
  id_tournament_types INT NOT NULL,
  id_status INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (id_owner) REFERENCES users(id),
  FOREIGN KEY (id_game_types) REFERENCES game_types(id),
  FOREIGN KEY (id_tournament_types) REFERENCES tournament_types(id),
  FOREIGN KEY (id_status) REFERENCES tournament_status(id)
);

CREATE TABLE participants (
  id INT NOT NULL AUTO_INCREMENT,
  id_tournaments INT NOT NULL,
  id_users INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (id_users) REFERENCES users(id),
  FOREIGN KEY (id_tournaments) REFERENCES tournaments(id)
);

CREATE TABLE matches (
  id INT NOT NULL AUTO_INCREMENT,
  id_tournaments INT NOT NULL,
  playerA INT,
  playerB INT,
  round INT NOT NULL,
  winner INT NOT NULL,
  id_status INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (id_tournaments) REFERENCES tournaments(id),
  FOREIGN KEY (playerA) REFERENCES users(id),
  FOREIGN KEY (playerB) REFERENCES users(id),
  FOREIGN KEY (winner) REFERENCES users(id),
  FOREIGN KEY (id_status) REFERENCES match_status(id)
);

///////////////////////////////////////////
// Initialization data
///////////////////////////////////////////

INSERT INTO tournament_types (name) VALUES ('Single Elimination');
INSERT INTO game_types (name) VALUES ('Ping Pong');
INSERT INTO game_types (name) VALUES ('Beer Pong');
INSERT INTO game_types (name) VALUES ('3x3 Basketball');
INSERT INTO tournament_status (name) VALUES ('Registration Open');
INSERT INTO tournament_status (name) VALUES ('Registration Closed');
INSERT INTO tournament_status (name) VALUES ('In-Progress');
INSERT INTO tournament_status (name) VALUES ('Ended');
INSERT INTO match_status (name) VALUES ('Upcoming');
INSERT INTO match_status (name) VALUES ('In-Progress');
INSERT INTO match_status (name) VALUES ('Ended');

INSERT INTO users (first, last, email, salt, hash) VALUES ('Darth', 'Vader', 'anakin@tatooine.org', 'salty123', 'hashy123');
INSERT INTO users (first, last, email, salt, hash) VALUES ('Luke', 'Skywalker', 'luke@tatooine.org', 'salty1234', 'hashy1234');
INSERT INTO users (first, last, email, salt, hash) VALUES ('Han', 'Solo', 'han@smuggler.org', 'salty12345', 'hashy12345');
INSERT INTO users (first, last, email, salt, hash) VALUES ('Leia', 'Solo', 'leia@smuggler.org', 'salty123456', 'hashy123456');

INSERT INTO tournaments (name, shortname, id_owner, id_game_types, id_tournament_types, id_status) VALUES ('Death Star Beer Pong', 'deathstarbeerpong', 1, 2, 1, 1);

INSERT INTO participants (id_tournaments, id_users) VALUES (1, 1);
INSERT INTO participants (id_tournaments, id_users) VALUES (1, 2);
INSERT INTO participants (id_tournaments, id_users) VALUES (1, 3);
INSERT INTO participants (id_tournaments, id_users) VALUES (1, 4);

UPDATE tournaments SET id_status = 2 WHERE shortname = 'deathstarbeerpong'; 
*/
