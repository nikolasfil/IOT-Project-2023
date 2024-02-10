
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
        └── route_homepage.js
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




Class01 <|-- AveryLongClass : Cool
Class01 : size()
Class01 : int chimp
Class01 : int gorilla

```





