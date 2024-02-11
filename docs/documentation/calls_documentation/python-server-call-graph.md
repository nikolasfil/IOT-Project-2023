
```mermaid
classDiagram 

broker: class 
broker <-- subscriber_broker : inherits
broker <-- publisher_broker : inherits

subscriber_broker : class 
publisher_broker : class 

context_provider : class
context_provider <-- sensor_context_provider : inherits
sensor_context_provider : class


connector_server : class 

virtual_sensor : class 

virtual_sensor <-- button_sensor : inherits 
virtual_sensor <-- tracker_sensor : inherits 

button_sensor : class 
tracker_sensor : class 


```

