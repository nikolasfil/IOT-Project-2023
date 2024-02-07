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
  - [3. Admin Page](#3-admin-page)
  - [4. Search page for admins](#4-search-page-for-admins)
  - [5. Device Page](#5-device-page)
  - [6. About us page](#6-about-us-page)
- [Deployment](#deployment)
- [Notes](#notes)
- [Useful links](#useful-links)

## Database

1. Set up the broker for the tables pressed and tracked
2. fill the tables with dummy data
3. Review the device fields based on the payloads
4. Look again the constraints

## Pages

### 1 Homepage

1. fix the map
2. add the map layers and show the trackers based on the time or sth

### 2. User page

1. add history based on the assigned and tracked table
2. be able to view a list and select them based on the assigned table
3. Live view of the trackers assigned to them
4. gps map of the tracker
5. Table of the last time the button was pressed and how

### 3. Admin Page

Either make it an extra page for admins or make the search page only for admins

1. view active users
2. view active devices
3. assign devices to users

### 4. Search page for admins

1. Fix Assigned to be a radius box instead of a check box

### 5. Device Page

1. map of the device if tracker
2. if button, last time it was pressed and how many times
3. change the status of the device
4. assign the device to a user
5. view the user assigned to the device
6. A slider to view current map or selected from history map

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
