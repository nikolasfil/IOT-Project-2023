CREATE TABLE IF NOT EXISTS DEVICE (
    d_id      INTEGER PRIMARY Key AUTOINCREMENT NOT NULL, 
    serial  varchar(255) NOT NULL , 
    battery float,
    status  varchar(255) NOT NULL,
    type    varchar(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS USER (
    u_id          INTEGER PRIMARY Key AUTOINCREMENT NOT NULL, 
    first_name  varchar(255) NOT NULL, 
    last_name   varchar(255) NOT NULL, 
    phone       varchar(255) NOT NULL,
    role        varchar(255) ,
    password    varchar(255) NOT NULL,
    salt        varchar(255) 
);


CREATE TABLE IF NOT EXISTS Assigned ( 
    user_id         INTEGER NOT NULL,
    device_id       INTEGER NOT NULL,
    date_received   TIMESTAMP NOT NULL,
    date_returned   TIMESTAMP ,
    PRIMARY KEY (user_id, device_id),
    FOREIGN KEY (user_id)   REFERENCES USER(u_id)     ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (device_id) REFERENCES DEVICE(d_id)   ON DELETE CASCADE ON UPDATE CASCADE
);



CREATE TABLE IF NOT EXISTS Pressed ( 
    user_id         INTEGER NOT NULL,
    device_id       INTEGER NOT NULL,
    time   TIMESTAMP NOT NULL,
    pressEvent   varchar(100) NOT NULL,
    batteryVoltage   varchar(100) NOT NULL,
    PRIMARY KEY (user_id, device_id),
    FOREIGN KEY (user_id)   REFERENCES USER(u_id)     ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (device_id) REFERENCES DEVICE(d_id)   ON DELETE CASCADE ON UPDATE CASCADE
);



CREATE TABLE IF NOT EXISTS Tracked ( 
    user_id     INTEGER NOT NULL,
    device_id   INTEGER NOT NULL,
    time        TIMESTAMP NOT NULL,
    latitude     float NOT NULL,
    longitude    float NOT NULL,
    batCritical     varchar(100) NOT NULL,
    PRIMARY KEY (user_id, device_id),
    FOREIGN KEY (user_id)   REFERENCES USER(u_id)     ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (device_id) REFERENCES DEVICE(d_id)   ON DELETE CASCADE ON UPDATE CASCADE
);
