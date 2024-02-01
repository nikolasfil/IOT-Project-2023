import datetime
import uuid
import json


class Sensor:
    def __init__(self, device_info: dict = None) -> None:
        self.info = {
            "deduplicationId": self.generate_unique_hash(),
            "time": self.get_datetime(),
            "deviceInfo": device_info,
        }
        # self.info.update(another_dict)

    def kwarging(self, arguments, item):
        if arguments.get(item):
            return arguments.get(item)
        else:
            return {}

    def generate_unique_hash(self):
        # Get current timestamp
        current_time = datetime.datetime.now().timestamp()

        # Convert timestamp to string and hash it using uuid
        hashed_value = uuid.uuid5(uuid.NAMESPACE_DNS, str(current_time))

        formatted_hash = str(hashed_value)
        return formatted_hash

    def get_datetime(self):
        return datetime.datetime.now().isoformat()

    def info_to_json(self):
        return json.dumps(self.info)
