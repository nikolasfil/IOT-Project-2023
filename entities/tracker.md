List of properties

- `id` (string, required): The unique identifier of the tracker.
- `type` (string, required): The type of the device, if it is a tracker : tracker.
- `location` (object, required): The location of the tracker.
  - `metadata` (object, optional): The metadata of the location.
  - `type` (string, required): The type of the location.
  - `value` (object, required): The value of the location.
    - `latitude` (float, required): The latitude of the location.
    - `longitude` (float, required): The longitude of the location.
- `temperature` (object, required): The temperature of the tracker.
  - `metadata` (object, optional): The metadata of the temperature.
  - `type` (string, required): The type of the temperature.
  - `value` (float, required): The value of the temperature.
- `timestamp` (object, required): The timestamp of the tracker.
  - `type` (string, required): The type of the timestamp.
  - `value` (object, required): The value of the timestamp.
    - `date` (string, required): The date of the timestamp.
    - `time` (string, required): The time of the timestamp.
- `battery` (object, required): The battery of the tracker.
  - `metadata` (object, optional): The metadata of the battery.
  - `type` (string, required): The type of the battery.
  - `value` (float, required): The value of the battery.

Example

```json
{
  "id": "tracker-1",
  "type": "tracker",
  "location": {
    "metadata": {
      "name": "Home"
    },
    "type": "location",
    "value": {
      "latitude": 48.8566,
      "longitude": 2.3522
    }
  },
  "temperature": {
    "metadata": {
      "unit": "Celsius"
    },
    "type": "temperature",
    "value": 25.0
  },
  "timestamp": {
    "type": "timestamp",
    "value": {
      "date": "2020-01-01",
      "time": "00:00:00"
    }
  },
  "battery": {
    "metadata": {
      "unit": "percentage"
    },
    "type": "battery",
    "value": 100.0
  }
}
```
