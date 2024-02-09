---
date: 2024-02-05
subject: IOT
type:
---

## Table of Contents

- [Database](#database)
- [Pages](#pages)
  - [1 Homepage](#1-homepage)
  - [2. User page](#2-user-page)
  - [3. Device Page](#3-device-page)
  - [4. Search page for admins](#4-search-page-for-admins)
  - [5. Admin Page](#5-admin-page)
  - [6. About us page](#6-about-us-page)
- [Deployment](#deployment)
- [Notes](#notes)
- [Useful links](#useful-links)

## Database

1. Set up the broker for the tables pressed and tracked
2. fill the tables with dummy data
3. Review the device fields based on the payloads
4. Look again the constraints

Headers:

- Tracked

| mqtt                       | Context P                | DB Field          | Example                  |
| -------------------------- | ------------------------ | ----------------- | ------------------------ |
|                            |                          | device_id         | 1                        |
| deviceInfo.tags.deviceId   | id                       | serial            | digital-matter-oyster3:1 |
| deviceInfo.applicationName | type                     |                   | Asset Tracking           |
| object.cached.latitudeDeg  | location.value.latitude  | latitude          | 38.2882484               |
| object.cached.longitudeDeg | location.value.longitude | longitude         | 21.7887801               |
| time                       | timestamp.time           | time              | 12:00:00                 |
| time                       | timestamp.date           | date              | 2021-08-25               |
| object.batCritical         |                          | batteryCritical ? | null                     |

- Pressed

| mqtt                       | Context P         | DB Field          | Example                  |
| -------------------------- | ----------------- | ----------------- | ------------------------ |
|                            |                   | device_id         | digital-matter-oyster3:1 |
| deviceInfo.tags.deviceId   | id                | serial            | digital-matter-oyster3:1 |
| deviceInfo.applicationName | type              |                   | Asset Tracking           |
| object.temperature         | temperature.value | temperature       | 21.7                     |
| object.pressEvent          | event.value       | event             | 00                       |
| time                       | timestamp.time    | time              | 12:00:00                 |
| time                       | timestamp.date    | date              | 2021-08-25               |
| object.batCritical         |                   | batteryCritical ? | null                     |

## Pages

### 1 Homepage

- User
  - No device Assigned
    1. Show the map and the layers of the map
  - Device assigned
    1. Show the map and the layers of the map
    2. Show the device and the last time it was pressed
    3. Show the device and the last time it was tracked
- Admin
  1. Show the map and the layers of the map
  2. Carusel of active trackers to choose
  3. Map of trackers selected
  4. Table of the last time the button was pressed and how

### 2. User page

- User

  1. User info
  2. Table of the dates he had an assigned pair of devices
  3. Live view of the trackers assigned to them or the path of the past assigned tracker selected
  4. table of button presses

- Admin
  1. User info
  2. Extra functions, device assignment, user ban or sth
  3. Table of the dates he had an assigned pair of devices
  4. Live view of the trackers assigned to them or the path of the past assigned tracker selected
  5. table of button presses

### 3. Device Page

- User

  1. Device info
  2. map of the device if tracker
  3. if button, last time it was pressed and how many times

- Admin
  1. Device info
  2. map of the device if tracker, maybe include the whole path ? surely the active location
  3. if button, last time it was pressed and how many times
  4. change the status of the device
  5. assign the device to a user
  6. view the user assigned to the device history

### 4. Search page for admins

1. Fix Assigned to be a radius box instead of a check box

### 5. Admin Page

Either make it an extra page for admins or make the search page only for admins

1. view active users
2. view active devices
3. assign devices to users

### 6. About us page

1. about us developers, and adguard

---

## Deployment

1. fix the docker to create the database once connected. Create another Dockerfile to have act as a secondary more permanent way of accessing the infrastructure

---

## Notes

1. Bluetooth θεωρια coach
2. Να παρουσιασουμε αυτο που ειπαμε στο κινητο
3. διευθυνση της γενικης ιδεας της παρουσιασης του προιοντος μας

## Useful links

[OpenLayers](https://openlayers.org/en/latest/apidoc/)
