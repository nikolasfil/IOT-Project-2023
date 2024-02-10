
```
database_server
├── controllers
│   └── database.js
│        └── Functions that communicate with the sqlite file
├── docs
│   └── some documentation
├── index.js
│   └── Starts the database server 
├── model
│   └── Files for creating the database 
└── routes
    └── route_database.js
        ├── route_device_info.js
            └── Contains all the routes used by the connector_server.py 
```


```mermaid
classDiagram

database : escapeRegExp(string)
database : exports.addingActivated=(activated_name, linker, regex)
database : exports.getAllDevicesJson= (data,  callback)
database : exports.getAllAttributes=(source,attribute, limit, offset, callback)
database : exports.checkIfUserExists= (id, callback)
database : exports.userDetails= (id, callback)
database : exports.checkUser= (id, password, callback)
database : exports.select=(command, callback)
database : exports.insert = (command,callback) 
database : exports.addUser= (user, callback)
database : function getRegex(searchValue, rows)

index : calls the route_database.j 

database <-- index


```

	 



