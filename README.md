# AdventureGuard

##### Description

Application for managing gps Trackers

#### Developers

<!-- to be fixed later  -->

- [Alkiviadis Tzortzakis](https://github.com/ALKABOURAS)
- [Agisilaos Kolliopoulos](https://github.com/agis22)
- [Nikolas Filippatos](https://github.com/nikolasfil/)

---

### Table of Contents

<!-- Copilot  -->

<!-- - [Description](#description) -->
<!-- - [Table of Contents](#table-of-contents) -->

- [Developers](#developers)
- [Developing Stage](#developing-stage)
- [Technologies](#technologies)
- [Building the application](#building-the-application)
  - [Running the server locally](#running-the-server-locally)

---

### Developing Stage:

- [ ] Database:
- [x] Database ERD
- [x] Database Schema
- [x] Database Creating Database
- [x] Database Automated Script
- [ ] Database Filling
- [x] Database Filling Users
- [ ] Database Filling Devices
- [ ] Database Filling Rest of Tables
- [ ] Website
- [x] Website Login
- [x] Website Register
- [ ] Website Home
- [ ] Website Devices
- [ ] Website User Page
- [ ] Website Device Map

<!-- URL: -->

---

### Building the application

###### Install the dependencies

```bash
npm install nodemon -g #suggested for development
```

```bash
npm install
```

The previous command will download all the dependencies and install them in the node_modules folder.

It gets the dependencies from the package.json file. The dependencies are listed in the dependencies section and are added there everytime we install a new dependency with npm install .

###### Database

To create the database, run the following program:

```bash
python3 database_managing.py
```

The python program [database_managing.py file](model/database_managing.py) looks for the database file (database.sqlite) and if it doesn't it creates it .
It builds the sql database from the file [dbdesigner.sql](/model/dbdesigner.sql) .

If there are no errors the database is created successfully .

---

### Running the server locally

###### Running it with nodemon

```bash
npm start
```

And it automatically loads the changes while working on the files.

**OR**

###### Running it with node

```bash
npm run startWebsite
```

It runs node index.js

---

###### Running it with docker

Building the image

```bash
docker build -t bilbo .
```

Running the image

```bash
docker run -d -p 8080:8080 app
```

---

Then head over to [localhost:8080](http://localhost:8080)

---
