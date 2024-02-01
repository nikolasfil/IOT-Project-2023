from virtual_sensor import Sensor
import json


class Tracker(Sensor):
    def __init__(self, **kwargs):
        super().__init__()
        self.generic_info = kwargs.get("generic_info")
        self.default_values()
        important_info = kwargs.get("important_info")
        self.initialize(**important_info, **self.generic_info)

    def info_json(self):
        return json.dumps(self.info)

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
                "batV": 5.25,
                # rxInfo
                "gatewayId": "1dee04170f93c058",
                "uplinkId": 47027,
                "rssi": -81,
                "snr": 7.2,
                "channel": 5,
                "context": "1SZf5A==",
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


if __name__ == "__main__":
    payload = {
        "important_info": {
            "type": "position",
            "deviceId": "digital-matter-oyster3:1",
            "latitude": 38.288403977154466,
            "longitude": 21.788731921156614,
            "speedKmph": 0,
            "latitudeDeg": 38.2882484,
            "headingDeg": 348.75,
            "longitudeDeg": 21.7887801,
        }
    }
    tracker = Tracker(**payload)
    print(tracker.info_json())
