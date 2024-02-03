---
date: 2024-02-03
subject: IOT
type: documentation
---


3 Servers 
1. NodeJS : Web Server running the front and backend 
2. Python : Running the mqtt broker that subscribes 
3. Python : Running the mqtt broker that publishes the virtual sensors 
4. Python : Connector Server receiving [GET/POST] requests and connects to database storage and Context Provider
5. ? : Server Running Database SQLITE

- broker.py
	- subscriber_broker.py
	- publisher_broker.py
- context_provider.py
	- sensor_context_provider.py
- virtual_sensor.py
	- tracker_sensor.py
	- button_sensor.py


