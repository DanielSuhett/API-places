USE playerum;

CREATE TABLE place (
    _id INT NOT NULL AUTO_INCREMENT,
    place_name VARCHAR(45) NOT NULL,
    userId INT NOT NULL,
    image JSON NULL,
    votes INT NOT NULL,
    PRIMARY KEY (_id),
    UNIQUE INDEX place_name_UNIQUE (place_name ASC ))

  PACK_KEYS = DEFAULT;
