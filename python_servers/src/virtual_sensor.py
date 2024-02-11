import datetime
from typing import Any
import uuid
import json


class ClassFunctionalities:
    def __init__(self, *args, **kwargs) -> None:
        self.info = {}
        self.limit = 10
        self.step = 0

    # def __str__(self):
    #     """
    #     Description:
    #         Returns the information in string format whenever the instance is called as a string
    #         E.g. print(self)

    #     Returns:
    #         str: stringify the information dict
    #     """
    #     return str(self.info)

    def __call__(self, *args: Any, **kwds: Any) -> Any:
        """
        Description :
            Returns the information as a dict whenever the instance is called
        Returns:
            dict: The information dict
        """
        return self.info

    def __getitem__(self, key):
        """
        Description:
            Returns the value of the key given. Whenever the instance is used as a dictionary
        """
        return self.info.get(key)

    def __setitem__(self, key, value):
        """
        Description:
            Sets the value of the key given. Whenever the instance is used as a dictionary
        """
        self.info[key] = value

    def __iter__(self):
        """
        Description:
            Returns the iterator of the information dict
        """
        # return iter(self.info)
        return self

    def __next__(self):
        """
        Description:
            Returns the next value of the information dict
        """
        if self.step < self.limit:
            self.step += 1
            self.generator()
            return self.info
        else:
            raise StopIteration

    def generator(self):
        """
        Description:
            Will be responsible for the generation of the data that will be provided with every iteration of the instance
        """
        pass


class SensorMQTTFormat(ClassFunctionalities):
    def __init__(self, *args, **kwargs) -> None:
        """
        Description:
            Initializes the Sensor class

        Args:
            **kwargs: The information that is sent from the mqtt server
                deviceInfo (json): The information about the device
                generic_info (json): The generic information about the device
                important_info (json): The important information about the device

        """

        # Initialize the information dictionary that will be used to access the sensor information
        super().__init__(self, *args, **kwargs)

        if kwargs.get("time"):
            time = kwargs.get("time")
        else:
            time = self.get_datetime()
        self.info = {
            "deduplicationId": self.generate_unique_hash(),
            "time": time,
            "deviceInfo": kwargs.get("deviceInfo"),
        }

        # Initialize the generic information dictionary if it is provided
        self.generic_info = kwargs.get("generic_info")

        # initialize the generic information dictionary
        self.default_values()

        # Initialize the important information dictionary if it is provided
        important_info = kwargs.get("important_info")

        if important_info is not None:
            # Initialize the information dictionary with the important information provided, and the generic won't matter so much
            self.initialize(**important_info, **self.generic_info)
        else:
            # Initialize the information dictionary with just the generic information, so that it is easier to dump all the data given in a **kwargs format
            self.initialize(**self.generic_info)

        # Initialize the json format of the information to use in payloads
        self.info_json = self.info_to_json()

        # Initialize the variable that will be used when transforming the information to a format that the Context Provider can understand
        self.cp_info = None

    def generate_unique_hash(self):
        """
        Description:
            Generates a unique hash for the information using the current timestamp

        Returns:
            str : The unique hash generated
        """

        # Get current timestamp
        current_time = datetime.datetime.now().timestamp()

        # Convert timestamp to string and hash it using uuid
        hashed_value = uuid.uuid5(uuid.NAMESPACE_DNS, str(current_time))

        formatted_hash = str(hashed_value)
        return formatted_hash

    def get_datetime(self):
        """
        Description:
            Get the current datetime in isoformat

        Returns:
            str: datetime in isoformat format
        """
        return datetime.datetime.now().isoformat()

    def info_to_json(self):
        """
        Description:
            Converts the information to a json format

        Returns:
            json: The information in json format
        """
        return json.dumps(self.info)

    def mqtt_to_cp(self, *args, **kwargs):
        """
        Description:
            Transforms the information to a format that the Context Provider can understand

        Raises:
            ValueError: _description_

        Returns:
            dict: information in the format the context provider for the sensor will accept
        """
        return self.cp_info


class SensorCPFormat(ClassFunctionalities):
    def __init__(self, *args, **kwargs):
        """
        Description:
            Initializes the SensorCPF class.

        Args:
            **kwargs: The information that is sent from the mqtt server
                entity_data (json): The information about the device
                id (str): The id of the device
                type (str): The type of the device

        """
        super().__init__(self, *args, **kwargs)
        self.entity_data = kwargs.get("entity_data")
        self.id = kwargs.get("id")
        self.type = kwargs.get("type")
        self.info = {"id": self.id, "type": self.type}

    def default_values(self):
        """
        Description:
            Initializes the default values of the SensorCPF class to keep as an interface
        """

    def new_entity(self, entity_data=None):
        """
        Description:
            Creates a new entity with the given entity data, given the values adding the default values as well

        Args:
            entity_data (dict, optional): information about the device. Defaults to None.

        Raises:
            ValueError: if the entity data is not initialized when the instance is created or when the method is called

        Returns:
            dict: completed form of the entity data in dictionary format
        """

        if entity_data is None:
            entity_data = self.entity_data

        if entity_data is None:
            raise ValueError("The entity_data is not given")

        # Assigning the values to the instance
        self.id = entity_data.get("id")
        self.type = entity_data.get("type")
        self.timestamp = entity_data.get("timestamp")

        self.temperature_dict = entity_data.get("temperature")
        self.temperature_value = entity_data.get("temperature_value")
        self.temperature_metadata = entity_data.get("temperature_metadata")

        return entity_data

    def get_date(self, isoformat: str):
        """
        Description:
            Get the date from the isoformat given

        Args:
            isoformat (str): The isoformat of the date

        Returns:
            str: The date in isoformat format
        """

        return datetime.datetime.fromisoformat(isoformat).date().isoformat()

    def get_time(self, isoformat: str):
        """
        Description:
            Get the time from the isoformat given

        Args:
            isoformat (str): The isoformat of the time

        Returns:
            str: The time in isoformat format
        """
        return datetime.datetime.fromisoformat(isoformat).time().isoformat()
