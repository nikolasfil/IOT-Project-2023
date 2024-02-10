
```
website
├── controllers
│   ├── c_search.js
│   ├── database.js
│   ├── helpers.js
│   └── login.js
├── docs
│   └── index.md
├── index.js
├── model
│   └── sessions
│       ├── random.txt
│       └── session.sqlite
├── public
│   ├── css
│   ├── img
│   └── javascript
│       ├── alerting.js
│       ├── filters.js
│       ├── map.js
│       ├── searchbar.js
│       ├── search_page.js
│       ├── show_pages.js
│       ├── sign_in.js
│       └── user_profile.js
├── routes
│   ├── route_about.js
│   ├── route_device_info.js
│   ├── route_homepage.js
│   ├── route_search.js
│   ├── route_sign.js
│   └── route_user_profile.js
└── views
    ├── about.hbs
    ├── book_info_og.hbs
    ├── device_info.hbs
    ├── homepage.hbs
    ├── layouts
    │   └── main.hbs
    ├── partials
    │   ├── card copy.hbs
    │   ├── card.hbs
    │   ├── deviceHistoryList.hbs
    │   ├── device_placement.hbs
    │   ├── devices_grid.hbs
    │   ├── filterCategories.hbs
    │   ├── footer.hbs
    │   ├── header.hbs
    │   ├── info_grid.hbs
    │   ├── map.hbs
    │   ├── membershipCard.hbs
    │   ├── profile_picture.hbs
    │   ├── searchbar.hbs
    │   ├── sign_in_up.hbs
    │   └── timeline.hbs
    ├── print_list.hbs
    ├── search.hbs
    └── user_profile.hbs
```


```mermaid
classDiagram


index : route_homepage 
index : route_device_info
index : route_homepage
index : route_search
index : route_sign
index : route_user_profile

database: async function fetchResponse(route, data, callback)
database: addingActivated=(activated_name, linker, regex)
database: exports.getAllDevicesJson= (data,  callback)     
database: exports.getAllAttributes=(source,attribute, limit, offset, callback)
database: exports.checkIfUserExists= (id, callback) 
database: exports.userDetails= (id, callback) 
database: exports.checkUser= (id, password, callback) 
database: exports.select=(command, callback) 
database: exports.insert = (command,callback) 
database: exports.addUser= (user, callback) 

index --> route_homepage
route_homepage -- database : getAllDevicesJson
route_homepage: homepage.hbs
route_homepage: index.css


index --> search_page 

search_page -- post_fetchresults: "/fetchResults/numOf"
post_fetchresults -- database : getAllDevicesJson
post_fetchresults : partials/decices_grid


```
