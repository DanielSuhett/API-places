USE playerum;

  CREATE TABLE user (
  _id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(45) NOT NULL,
  password VARCHAR(100) NOT NULL,
  salt VARCHAR(100) NULL,
  places JSON NULL,
  PRIMARY KEY (_id),
  UNIQUE INDEX _id_UNIQUE (_id ASC),
  UNIQUE INDEX username_UNIQUE (username ASC));