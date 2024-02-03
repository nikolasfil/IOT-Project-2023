from virtual_sensor import Sensor


class Button(Sensor):
    def __init__(self, **kwargs):
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
                "model": kwargs.get("model"),
                "apiKey": kwargs.get("apiKey"),
                "manufacturer": kwargs.get("manufacturer"),
                "deviceId": kwargs.get("deviceId"),
            },
        }

        object_info = {
            "batteryVoltage": kwargs.get("batteryVoltage"),
            "temperature": kwargs.get("temperature"),
            "thermistorProperlyConnected": kwargs.get("thermistorProperlyConnected"),
            "pressEvent": kwargs.get("pressEvent"),
        }

        rxInfo_list = [
            {
                "gatewayId": "1dee1a0843acf826",
                "uplinkId": 61505,
                "rssi": -114,
                "snr": 2,
                "channel": 3,
                "location": {
                    "latitude": 38.288395556071336,
                    "longitude": 21.788930292281066,
                },
                "context": "vAqubA==",
                "metadata": {
                    "region_config_id": "eu868",
                    "region_common_name": "EU868",
                },
                "crcStatus": "CRC_OK",
            },
            {
                "gatewayId": "1dee04170f93c058",
                "uplinkId": 45715,
                "rssi": -85,
                "snr": 7.8,
                "channel": 3,
                "location": {
                    "latitude": 38.288403977154466,
                    "longitude": 21.788731921156614,
                },
                "context": "yJ6AhA==",
                "metadata": {
                    "region_common_name": "EU868",
                    "region_config_id": "eu868",
                },
                "crcStatus": "CRC_OK",
            },
        ]

        txInfo_dict = {
            "frequency": 867100000,
            "modulation": {
                "lora": {
                    "bandwidth": 125000,
                    "spreadingFactor": 12,
                    "codeRate": "CR_4_5",
                }
            },
        }

        button_info = {
            "deviceInfo": device_info,
            "devAddr": "01ee6c87",
            "adr": True,
            "dr": 0,
            "fCnt": 1,
            "fPort": 2,
            "confirmed": True,
            "data": "Ab4A2QA=",
            "object": object_info,
            "rxInfo": rxInfo_list,
            "txInfo": txInfo_dict,
        }

        self.info.update(button_info)

    def default_values(self):
        if self.generic_info is None:
            self.generic_info = {
                "tenantId": "063a0ecb-e8c2-4a13-975a-93d791e8d40c",
                "tenantName": "Smart Campus",
                "applicationId": "97865748-6f77-4f37-82f0-d76771651b21",
                "applicationName": "Buttons",
                "deviceProfileId": "c707a935-359c-4359-9186-53bccc74bcb5",
                "deviceProfileName": "MClimate Multipurpose Button",
                "devEui": "70b3d52dd6000065",
                "model": "multipurpose-button",
                "apiKey": "4jggokgpesnvfb2uv1s40d73ov",
                "manufacturer": "mclimate",
            }

    def main(self):
        pass


if __name__ == "__main__":
    important_info = {
        "deviceName": "mclimate-multipurpose-button:1",
        "deviceId": "mclimate-multipurpose-button:1",
        "batteryVoltage": 3.1,
        "temperature": 21.700000000000003,
        "thermistorProperlyConnected": True,
        "pressEvent": "00",
    }

    button = Button(important_info=important_info)
    print(button.info_json)
