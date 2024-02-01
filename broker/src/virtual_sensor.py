import datetime
import uuid


class Sensor:
    def __init__(self):
        pass

    def generate_unique_hash():
        # Get current timestamp
        current_time = datetime.datetime.now().timestamp()

        # Convert timestamp to string and hash it using uuid
        hashed_value = uuid.uuid5(uuid.NAMESPACE_DNS, str(current_time))

        # Format the hashed value as per your requirement
        formatted_hash = str(hashed_value).replace("-", "")

        return formatted_hash

    def create_dictionary(self):
        self.info = {
            "deduplicationId": "e3e89558-48a6-4e80-9e6c-f383e55c12b6",
            "time": "2023-12-20T15:53:28.924029447+00:00",
            "deviceInfo": {
                "tenantId": "063a0ecb-e8c2-4a13-975a-93d791e8d40c",
                "tenantName": "Smart Campus",
                "applicationId": "9be10a72-026f-4e3b-8eac-4a74d0beecb8",
                "applicationName": "Asset tracking",
                "deviceProfileId": "82ff747e-1de8-4c38-8a8a-9319f3468732",
                "deviceProfileName": "Digital Matter Oyster3",
                "deviceName": "digital-matter-oyster3:1",
                "devEui": "70b3d570500134ae",
                "tags": {
                    "deviceId": "digital-matter-oyster3:1",
                    "apiKey": "4jggokgpesnvfb2uv1s40d73ov",
                },
            },
            "devAddr": "002f2c62",
            "adr": False,
            "dr": 2,
            "fCnt": 715,
            "fPort": 1,
            "confirmed": False,
            "data": "tFLSFjm0/Az7ANI=",
            "object": {
                "inactivityAlarm": None,
                "type": "position",
                "batCritical": None,
                "inTrip": True,
                "cached": {
                    "speedKmph": 0,
                    "latitudeDeg": 38.2882484,
                    "headingDeg": 348.75,
                    "longitudeDeg": 21.7887801,
                },
                "fixFailed": True,
                "batV": 5.25,
            },
            "rxInfo": [
                {
                    "gatewayId": "1dee04170f93c058",
                    "uplinkId": 47027,
                    "rssi": -81,
                    "snr": 7.2,
                    "channel": 5,
                    "location": {
                        "latitude": 38.288403977154466,
                        "longitude": 21.788731921156614,
                    },
                    "context": "1SZf5A==",
                    "metadata": {
                        "region_common_name": "EU868",
                        "region_config_id": "eu868",
                    },
                    "crcStatus": "CRC_OK",
                }
            ],
            "txInfo": {
                "frequency": 867500000,
                "modulation": {
                    "lora": {
                        "bandwidth": 125000,
                        "spreadingFactor": 10,
                        "codeRate": "CR_4_5",
                    }
                },
            },
        }
