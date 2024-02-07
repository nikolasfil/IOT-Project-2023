import datetime
from typing import Any
import uuid
import json


class Sensor:
    def __init__(self, **kwargs) -> None:
        self.info = {
            "deduplicationId": self.generate_unique_hash(),
            "time": self.get_datetime(),
            "deviceInfo": kwargs.get("deviceInfo"),
        }

        self.generic_info = kwargs.get("generic_info")
        self.default_values()
        important_info = kwargs.get("important_info")
        if important_info is not None:
            self.initialize(**important_info, **self.generic_info)
        else:
            self.initialize(**self.generic_info)
        self.info_json = self.info_to_json()
        self.cp_info = None

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

    def mqtt_to_cp(self, *args, **kwargs):
        """
        Description:
            Transforms the information to a format that the Context Provider can understand


        Raises:
            ValueError: _description_

        Returns:
            _type_: _description_
        """


class SensorCPF:
    def __init__(self, **kwargs):
        self.entity_data = kwargs.get("entity_data")
        self.id = kwargs.get("id")
        self.type = kwargs.get("type")
        self.info = {"id": self.id, "type": self.type}

    def __str__(self):
        return str(self.info)

    def __call__(self, *args: Any, **kwds: Any) -> Any:
        return self.info

    def __getitem__(self, key):
        return self.info.get(key)

    def default_values(self):
        pass

    def new_entity(self, entity_data=None):
        if entity_data is None:
            entity_data = self.entity_data

        if entity_data is None:
            raise ValueError("The entity_data is not given")
        return entity_data
