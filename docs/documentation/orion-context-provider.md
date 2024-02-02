---
type: documentation
---



Απο το φυλλάδιο : `Lecture_5(LAB)_IoT_FIWARE_2023-2024`

[Github Source](https://github.com/FIWARE/tutorials.Getting-Started/tree/NGSI-v2)

## Context Providers 

### Definition 

- There is another class of context data which is much more dynamic 
- This information is always changing and if it were statically held in a database, the data would be out-of-date 
- The FIWARE platform makes the gathering and presentation of real-time  context data transparent. Each NGSI request will return the latest context  by combining the data held within its database along with real-time data  readings from any registered external context providers.


Δεν τον χρειαζομαστε να τον τρεχουμε εμεις. αλλα στελνουμε και παιρνουμε δεδομενα απο αυτον με python

https://fiware-orion.readthedocs.io/en/master/


----

Using : 

```python
# Get the version of the orion broker
version = ContextProvider(url="http://150.140.186.118:1026/version")
print(version["orionld version"])

# Get the entities
cp = ContextProvider(
	url="http://150.140.186.118:1026/v2/entities",
	method="GET",
)

# Context broker get the keys to the dictionaries that the entities use
for item in cp.response_python_object:
	print(item)
```



