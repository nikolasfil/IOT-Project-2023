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

```toc

```


<!-- - [Description](#description) -->
<!-- - [Table of Contents](#table-of-contents) -->

- [Developers](#developers)
- [Developing Stage](#developing-stage)
- [Technologies](#technologies)
- [Building the application](#building-the-application)
  - [Running the server locally](#running-the-server-locally)

---



---

## Building the application

### docker-compose 

Building the image

```bash
docker-compose up --build
```

Running the image

```bash
docker-compose up 
```


Then head over to [localhost:8080](http://localhost:8080)

----

### Running the services individually

#### Node Servers

First of all install the dependencies on the node_servers folder : 

Go to ./node_servers/website and the ./node_servers/database_server and run npm install, in order to have the necessary node_modules 

```bash
npm install
```


It gets the dependencies from the package.json file. The dependencies are listed in the dependencies section and are added there everytime we install a new dependency with npm install .

##### Create Database

To create the database, run the following program:

```bash
python3 node_servers/database_server/model/python/database_managing.py
```

The python program [database_managing.py file](./node_servers/database_server/model/database_managing.py) looks for the database file (database.sqlite) and if it doesn't it creates it .
It builds the sql database from the file [dbdesigner.sql](/model/dbdesigner.sql) .

If there are no errors the database is created successfully .

#### Running Node Services 

Run the following command in both folders node_servers/database_server and node_servers/website 

```bash
npm run startWebsite
```

### Python Services 

In the path : ./python_servers/src 

#### Create a virtual environment 

```bash
python -m venv app_venv
```

#### Enable virtual environment 

```bash
source app_venv/bin/activate 
```

To disable it after running the programms : 

```bash
deactivate 
```

### Run Python Services 

#### Connector App 

The following application will take data from our mqtt subscriber and forward them to the context provider and the database 

```bash
python src/connector_app.py
```

#### Publisher App

This application acts as virtual sensors in order to provide a live demo 

```bash
python src/publisher_app.py
```


#### Subscriber App 

This application will connect to the specified mqtt broker and forward the data it receives to the connector app 

```bash
python src/subscriber_app.py
```

---