CREATE TABLE IF NOT EXISTS DEVICE (
    d_id    INTEGER  AUTOINCREMENT, 
    serial  varchar(255) NOT NULL , 
    battery float,
    status  varchar(255) DEFAULT "deactivated" ,
    type    varchar(255) NOT NULL,
    PRIMARY Key (d_id)

);

CREATE TABLE IF NOT EXISTS USER (
    u_id        INTEGER AUTOINCREMENT, 
    first_name  varchar(255) NOT NULL, 
    last_name   varchar(255) NOT NULL, 
    phone       varchar(255) NOT NULL,
    role        varchar(255) DEFAULT "user",
    password    varchar(255) NOT NULL,
    salt        varchar(255),
    PRIMARY Key (u_id) 
);


CREATE TABLE IF NOT EXISTS Assigned ( 
    user_id         INTEGER NOT NULL,
    device_id       INTEGER NOT NULL,
    date_received   TIMESTAMP NOT NULL,
    date_returned   TIMESTAMP ,
    PRIMARY KEY (user_id, device_id, date_received),
    FOREIGN KEY (user_id)   REFERENCES USER(u_id)     ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (device_id) REFERENCES DEVICE(d_id)   ON DELETE CASCADE ON UPDATE CASCADE
);



CREATE TABLE IF NOT EXISTS Pressed ( 
    device_id       INTEGER NOT NULL,
    time            TIMESTAMP NOT NULL,
    date            DATE NOT NULL,
    event           varchar(255) NOT NULL,
    battery_level   varchar(100) ,
    temperature     float, 
    PRIMARY KEY  (device_id,time,date),
    FOREIGN KEY (device_id) REFERENCES DEVICE(d_id)   ON DELETE CASCADE ON UPDATE CASCADE
);



CREATE TABLE IF NOT EXISTS Tracked ( 
    device_id   INTEGER NOT NULL,
    time        TIMESTAMP NOT NULL,
    date        DATE NOT NULL,
    latitude    varchar(255) NOT NULL,
    longitude   varchar(255) NOT NULL,
    battery_level   varchar(100) ,
    temperature     float, 
    PRIMARY KEY  (device_id,time,date),
    FOREIGN KEY (device_id) REFERENCES DEVICE(d_id)   ON DELETE CASCADE ON UPDATE CASCADE
);
