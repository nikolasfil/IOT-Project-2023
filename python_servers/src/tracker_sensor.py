from virtual_sensor import Sensor, SensorCP


class Tracker(Sensor):
    def __init__(self, **kwargs):
        """ "
        Description:
            Initialize the Tracker Sensor

        Args:
            generic_info (dict): The generic info of the tracker
            important_info (dict): The important info of the tracker
                type (str): The type of the tracker
                deviceId (str): The id of the tracker
                speedKmph (float): The speed of the tracker
                latitudeDeg (float): The latitude of the tracker
                headingDeg (float): The heading of the tracker
                longitudeDeg (float): The longitude of the tracker

        Kwargs:
            generic_info (dict): The generic info of the tracker
            important_info (dict): The important info of the tracker


        """
        super().__init__()
        self.generic_info = kwargs.get("generic_info")
        self.default_values()
        important_info = kwargs.get("important_info")
        self.initialize(**important_info, **self.generic_info)
        self.info_json = self.info_to_json()

    def initialize(self, **kwargs):
        device_info = {
            "tenantId": kwargs.get("tenantId"),
            "tenantName": kwargs.get("tenantName"),
            "applicationId": kwargs.get("applicationId"),
            "applicationName": kwargs.get("applicationName"),
            "deviceProfileId": kwargs.get("deviceProfileId"),
            "deviceProfileName": kwargs.get("deviceProfileName"),
            "deviceName": kwargs.get("deviceName"),
            "devEui": kwargs.get("devEui"),
            "tags": {
                "deviceId": kwargs.get("deviceId"),
                "apiKey": kwargs.get("apiKey"),
            },
        }

        object_info = {
            "inactivityAlarm": kwargs.get("inactivityAlarm"),
            "type": kwargs.get("type"),
            "batCritical": kwargs.get("batCritical"),
            "inTrip": kwargs.get("inTrip"),
            "cached": {
                "speedKmph": kwargs.get("speedKmph"),
                "latitudeDeg": kwargs.get("latitudeDeg"),
                "headingDeg": kwargs.get("headingDeg"),
                "longitudeDeg": kwargs.get("longitudeDeg"),
            },
            "fixFailed": kwargs.get("fixFailed"),
            "batV": kwargs.get("batV"),
        }

        rxInfo = [
            {
                "gatewayId": kwargs.get("gatewayId"),
                "uplinkId": kwargs.get("uplinkId"),
                "rssi": kwargs.get("rssi"),
                "snr": kwargs.get("snr"),
                "channel": kwargs.get("channel"),
                "location": {
                    "latitude": kwargs.get("latitude"),
                    "longitude": kwargs.get("longitude"),
                },
                "context": kwargs.get("context"),
                "metadata": {
                    "region_common_name": kwargs.get("region_common_name"),
                    "region_config_id": kwargs.get("region_config_id"),
                },
                "crcStatus": kwargs.get("crcStatus"),
            }
        ]

        txInfo = {
            "frequency": kwargs.get("frequency"),
            "modulation": {
                "lora": {
                    "bandwidth": kwargs.get("bandwidth"),
                    "spreadingFactor": kwargs.get("spreadingFactor"),
                    "codeRate": kwargs.get("codeRate"),
                }
            },
        }

        tracker_info = {
            "deviceInfo": device_info,
            "devAddr": kwargs.get("devAddr"),
            "adr": kwargs.get("adr"),
            "dr": kwargs.get("dr"),
            "fCnt": kwargs.get("fCnt"),
            "fPort": kwargs.get("fPort"),
            "confirmed": kwargs.get("confirmed"),
            "data": kwargs.get("data"),
            "object": object_info,
            "rxInfo": rxInfo,
            "txInfo": txInfo,
        }

        self.info.update(tracker_info)

    def default_values(self):
        """
        Description:
            Set the default values for the tracker
        """
        if self.generic_info is None:
            self.generic_info = {
                "tenantName": "Smart Campus",
                "tenantId": "063a0ecb-e8c2-4a13-975a-93d791e8d40c",
                "applicationId": "420",
                "applicationName": "AdGuard",
                # Standarized data
                "deviceProfileId": "82ff747e-1de8-4c38-8a8a-9319f3468732",
                "deviceProfileName": "Digital Matter Oyster3",
                "deviceName": "digital-matter-oyster3:1",
                "devEui": "70b3d570500134ae",
                "apiKey": "4jggokgpesnvfb2uv1s40d73ov",
                # object
                "inactivityAlarm": None,
                "batCritical": None,
                "inTrip": True,
                "fixFailed": True,
                # rxInfo
                "gatewayId": "1dee04170f93c058",
                "uplinkId": 47027,
                "rssi": -81,
                "snr": 7.2,
                "channel": 5,
                "context": "1SZf5A==",
                "latitude": 38.288403977154466,
                "longitude": 21.788731921156614,
                "region_common_name": "EU868",
                "region_config_id": "eu868",
                "crcStatus": "CRC_OK",
                # txInfo
                "frequency": 867500000,
                "bandwidth": 125000,
                "spreadingFactor": 10,
                "codeRate": "CR_4_5",
                # tracker data
                "devAddr": "002f2c62",
                "adr": False,
                "dr": 2,
                "fCnt": 715,
                "fPort": 1,
                "confirmed": False,
                "data": "tFLSFjm0/Az7ANI=",
            }


class TrackerCP(SensorCP):
    def __init__(self, **kwargs):
        """
        Description:
            Initialize the Tracker Context Provider

        Args:


        Kwargs:
            entity_data (dict): The data of the entity
                id (str): The id of the entity
                type (str): The type of the entity
                location (dict): The location of the entity
                    type (str): The type of the location
                    value (dict): The value of the location
                        latitude (float): The latitude of the entity
                        longitude (float): The longitude of the entity
                    location_metadata (dict): The metadata of the location
                temperature (dict): The temperature of the entity
                    type (str): The type of the temperature
                    value (float): The value of the temperature
                    temperature_metadata (dict): The metadata of the temperature
        """
        super().__init__(**kwargs)
        self.new_entity()
        self.default_values()

    def new_entity(self, entity_data=None) -> None:
        """
        Description:
            Create a new entity

        Args:
            entity_data (dict, optional): Contains all the data needed to create a new entity. Defaults to None.

        Returns:
            None: No return value
        """
        entity_data = super().new_entity(entity_data)

        self.id = entity_data.get("id")
        self.type = entity_data.get("type")
        self.location_dict = entity_data.get("location")
        self.latitude = entity_data.get("latitude")
        self.longitude = entity_data.get("longitude")
        self.location_metadata = entity_data.get("location_metadata")
        self.temperature_dict = entity_data.get("temperature")
        self.temperatur_value = entity_data.get("temperature_value")
        self.temperature_metadata = entity_data.get("temperature_metadata")

    def default_values(self):
        if self.location_dict is None:
            location = {
                "type": "geo:json",
                "value": {
                    "latitude": self.latitude,
                    "longitude": self.longitude,
                },
                "metadata": self.location_metadata,
            }
        else:
            location = self.location_dict

        if self.temperature_dict is None:
            temperature = {
                "type": "Float",
                "value": self.temperatur_value,
                "metadata": {},
            }
        else:
            temperature = self.temperature_dict

        if self.entity_data is None:
            entity_data = {
                "location": location,
                "temparature": temperature,
            }
        else:
            entity_data = self.entity_data

            entity_data.update({"location": location, "temperature": temperature})

        self.info.update(entity_data)


if __name__ == "__main__":
    important_info = {
        "type": "position",
        "deviceId": "digital-matter-oyster3:1",
        "speedKmph": 0,
        "latitudeDeg": 38.2882484,
        "headingDeg": 348.75,
        "longitudeDeg": 21.7887801,
    }

    tracker = Tracker(important_info=important_info)
    print(tracker.info)

    context_info = {
        "id": "tracker",
        "type": "Tracker",
        "latitude": 80,
        "longitude": 90,
        "temperature_value": 25.5,
        # Not needed
        "location_metadata": {
            "region_common_name": "EU868",
            "region_config_id": "eu868",
        },
        # In location we could add the metadata for fires or sth
    }

    trackerCP = TrackerCP(entity_data=context_info)
    print(trackerCP.info)
