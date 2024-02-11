
```bash

├── docker-compose.yml
├── DockerFiles
│   ├── Copies
│   │   ├── Dockerfile-Node
│   │   └── Dockerfile-Python
│   └── Volumes
│       ├── Dockerfile-Database
│       ├── Dockerfile-Node
│       ├── Dockerfile-Node-ci
│       ├── Dockerfile-Python
│       └── Dockerfile-Website
├── node_servers
│   ├── database_server
│   │   ├── controllers
│   │   │   └── database.js
│   │   ├── docs
│   │   │   └── index.md
│   │   ├── index.js
│   │   ├── model
│   │   │   ├── data
│   │   │   │   ├── device.csv
│   │   │   │   └── users.csv
│   │   │   ├── database.sqlite
│   │   │   ├── payload
│   │   │   │   ├── status.json
│   │   │   │   └── tracker.json
│   │   │   ├── python
│   │   │   │   ├── database_managing.py
│   │   │   │   └── database.py
│   │   │   ├── sessions
│   │   │   │   ├── random.txt
│   │   │   │   └── session.sqlite
│   │   │   └── sql
│   │   │       ├── create_database.sql
│   │   │       └── database_queries.sql
│   │   ├── package.json
│   │   ├── package-lock.json
│   │   ├── public
│   │   └── routes
│   │       ├── route_database.js
│   │       ├── route_device_info.js
│   │       └── route_homepage.js
│   └── website
│       ├── controllers
│       │   ├── c_search.js
│       │   ├── database.js
│       │   ├── helpers.js
│       │   └── login.js
│       ├── docs
│       │   └── index.md
│       ├── index.js
│       ├── model
│       │   └── sessions
│       │       ├── random.txt
│       │       └── session.sqlite
│       ├── package.json
│       ├── package-lock.json
│       ├── Procfile
│       ├── public
│       │   ├── css
│       │   │   ├── button.css
│       │   │   ├── card.css
│       │   │   ├── carousel.css
│       │   │   ├── filters.css
│       │   │   ├── footer.css
│       │   │   ├── header.css
│       │   │   ├── individual_pages
│       │   │   │   ├── about.css
│       │   │   │   ├── device_info.css
│       │   │   │   ├── index.css
│       │   │   │   └── user_profile.css
│       │   │   ├── map.css
│       │   │   ├── pages.css
│       │   │   ├── searchbar.css
│       │   │   ├── sign_in.css
│       │   │   └── style.css
│       │   ├── img
│       │   │   ├── banner.jpg
│       │   │   ├── banner.png
│       │   │   ├── borrowing_card.svg
│       │   │   ├── button.png
│       │   │   ├── card_book_1.png
│       │   │   ├── card_book_2.png
│       │   │   ├── card_book_3.png
│       │   │   ├── card_book_4.png
│       │   │   ├── card_book_5.png
│       │   │   ├── card_book_default.jpg
│       │   │   ├── card_library_1.png
│       │   │   ├── card_library_2.png
│       │   │   ├── card_library_3.png
│       │   │   ├── card_library_4.png
│       │   │   ├── card_library_5.png
│       │   │   ├── demo_pic_311_281.png
│       │   │   ├── ellipse_1.png
│       │   │   ├── geo-alt-fill.png
│       │   │   ├── geo-alt-fill.svg
│       │   │   ├── globe_no_bg.png
│       │   │   ├── gps-over.png
│       │   │   ├── gps-side.png
│       │   │   ├── gps-under.png
│       │   │   ├── hand-drawn-flat-design-stack-books
│       │   │   │   ├── 6897387.ai
│       │   │   │   ├── 6897388.eps
│       │   │   │   ├── 6897389.jpg
│       │   │   │   └── Fonts.txt
│       │   │   ├── hand-drawn-flat-design-stack-books.zip
│       │   │   ├── imgPlaceholder.png
│       │   │   ├── kotorenis_profile.png
│       │   │   ├── letter_G.png
│       │   │   ├── library_image_1.svg
│       │   │   ├── logo_background.png
│       │   │   ├── logo_bg.svg
│       │   │   ├── logo-horizontal.svg
│       │   │   ├── logo_no_bg.png
│       │   │   ├── logo.png
│       │   │   ├── logo_small.svg
│       │   │   ├── logo_vertical.png
│       │   │   ├── logo_vertical.svg
│       │   │   ├── logo_white_bg.png
│       │   │   ├── logo_white_filling.png
│       │   │   ├── logo_white_filling.svg
│       │   │   ├── logo_white.png
│       │   │   ├── nikolas_profile.jpg
│       │   │   ├── person-fill.svg
│       │   │   ├── pin-fill.svg
│       │   │   ├── pin.png
│       │   │   ├── progress.png
│       │   │   └── rectangle_15.png
│       │   └── javascript
│       │       ├── alerting.js
│       │       ├── filters.js
│       │       ├── map.js
│       │       ├── searchbar.js
│       │       ├── search_page.js
│       │       ├── show_pages.js
│       │       ├── sign_in.js
│       │       └── user_profile.js
│       ├── routes
│       │   ├── route_about.js
│       │   ├── route_device_info.js
│       │   ├── route_homepage.js
│       │   ├── route_search.js
│       │   ├── route_sign.js
│       │   └── route_user_profile.js
│       └── views
│           ├── about.hbs
│           ├── book_info_og.hbs
│           ├── device_info.hbs
│           ├── homepage.hbs
│           ├── layouts
│           │   └── main.hbs
│           ├── partials
│           │   ├── card copy.hbs
│           │   ├── card.hbs
│           │   ├── deviceHistoryList.hbs
│           │   ├── device_placement.hbs
│           │   ├── devices_grid.hbs
│           │   ├── filterCategories.hbs
│           │   ├── footer.hbs
│           │   ├── header.hbs
│           │   ├── info_grid.hbs
│           │   ├── map.hbs
│           │   ├── membershipCard.hbs
│           │   ├── profile_picture.hbs
│           │   ├── searchbar.hbs
│           │   ├── sign_in_up.hbs
│           │   └── timeline.hbs
│           ├── print_list.hbs
│           ├── search.hbs
│           └── user_profile.hbs
├── python_servers
│   ├── files
│   ├── logs
│   │   ├── broker_2.log
│   │   ├── broker.log
│   │   ├── button_press_00.json
│   │   ├── button_press_01.json
│   │   ├── button_press.json
│   │   ├── button.zip
│   │   ├── context_provider.log
│   │   ├── test.json
│   │   ├── tracker_moved.json
│   │   └── tracker_no_movement.json
│   ├── requirements.txt
│   └── src
│       ├── broker.py
│       ├── button_sensor.py
│       ├── connector_server.py
│       ├── context_provider.py
│       ├── publisher_broker.py
│       ├── sensor_context_provider.py
│       ├── subscriber_broker.py
│       ├── tracker_sensor.py
│       └── virtual_sensor.py
└── README.md
```

