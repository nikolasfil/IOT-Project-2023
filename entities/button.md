## List of properties

- `id` (string, required): The unique identifier of the button.
- `type` (string, required): The type of the device, if it is a button : Buttons.
- `temperature` (object, required): The temperature of the button.
  - `metadata` (object, optional): The metadata of the temperature.
  - `type` (string, required): The type of the temperature.
  - `value` (float, required): The value of the temperature.
- `event` (object, required): The event of the button.
  - `metadata` (object, optional): The metadata of the event.
  - `type` (string, required): The type of the event.
  - `value` (string, required): The value of the event.
- `battery` (object, required): The battery of the button.
  - `metadata` (object, optional): The metadata of the battery.
  - `type` (string, required): The type of the battery.
  - `value` (float, required): The value of the battery.
- `timestamp` (object, required): The timestamp of the button.
  - `type` (string, required): The type of the timestamp.
  - `value` (object, required): The value of the timestamp.
    - `date` (string, required): The date of the timestamp.
    - `time` (string, required): The time of the timestamp.

Example

```json
{
  "id": "mclimate-multipurpose-button:1",
  "type": "Buttons",
  "temperature": {
    "type": "Float",
    "value": 21.700000000000003,
    "metadata": {}
  },
  "event": { "value": "00", "metadata": {} },
  "battery": { "type": "Float", "value": 3.1, "metadata": {} },
  "timestamp": {
    "type": "datetime",
    "value": { "date": "2024-02-15", "time": "17:34:28.015966" }
  }
}
```
