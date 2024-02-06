from virtual_sensor import Sensor, SensorCPF


class Button(Sensor):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def initialize(self, **kwargs):

        if kwargs.get("deviceInfo") is None:
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
        else:
            device_info = kwargs.get("deviceInfo")

        if kwargs.get("object") is None:
            object_info = {
                "batteryVoltage": kwargs.get("batteryVoltage"),
                "temperature": kwargs.get("temperature"),
                "thermistorProperlyConnected": kwargs.get(
                    "thermistorProperlyConnected"
                ),
                "pressEvent": kwargs.get("pressEvent"),
            }
        else:
            object_info = kwargs.get("object")

        if kwargs.get("rxInfo") is None:
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
        else:
            rxInfo_list = kwargs.get("rxInfo")

        if kwargs.get("txInfo") is None:
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
        else:
            txInfo_dict = kwargs.get("txInfo")

        button_info = {
            "deviceInfo": device_info,
            "devAddr": kwargs.get("devAddr"),
            "adr": kwargs.get("adr"),
            "dr": kwargs.get("dr"),
            "fCnt": kwargs.get("fCnt"),
            "fPort": kwargs.get("fPort"),
            "confirmed": kwargs.get("confirmed"),
            "data": kwargs.get("data"),
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
                "devAddr": "01ee6c87",
                "adr": True,
                "dr": 0,
                "fCnt": 1,
                "fPort": 2,
                "confirmed": True,
                "data": "Ab4A2QA=",
            }

    def main(self):
        pass


class ButtonCPF(SensorCPF):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.new_entity()
        self.default_values()

    def new_entity(self, entity_data=None):
        entity_data = super().new_entity(entity_data)

        self.id = entity_data.get("id")
        self.type = entity_data.get("type")
        self.temparature_dict = entity_data.get("temperature")
        self.temparature_type = entity_data.get("temperature_type")
        self.temperature_value = entity_data.get("temperature_value")
        self.temperature_metadata = entity_data.get("temperature_metadata")
        self.event = entity_data.get("press_event")
        self.event_metadata = entity_data.get("press_event_metadata")
        self.batteryVoltage = entity_data.get("batteryVoltage")

    def default_values(self):
        if self.temparature_dict is None:
            temperature = {
                "type": self.temparature_type,
                "value": self.temperature_value,
                "metadata": self.temperature_metadata,
            }
        else:
            temperature = self.temparature_dict

        if self.event is None:
            event = {
                "value": "00",
                "metadata": self.event_metadata,
            }
        else:
            event = self.event

        if self.entity_data is None:
            entity_data = {
                "id": self.id,
                "type": self.type,
                "temperature": temperature,
                "event": event,
                "batteryVoltage": self.batteryVoltage,
            }
        else:
            entity_data = self.entity_data
            entity_data.update(
                {
                    "id": self.id,
                    "type": self.type,
                    "temperature": temperature,
                    "event": event,
                    "batteryVoltage": self.batteryVoltage,
                }
            )

        self.info.update(entity_data)

        # info = {
        #     "id": "70b3d52dd6000065",
        #     "type": "mclimate-multipurpose-button",
        #     "temperature": {
        #         "type": "Float",
        #         "value": 21.7,
        #         "metadata": {},
        #     },
        #     "event": {
        #         "type": "button press",
        #         "value": "00",
        #         "metadata": {},
        #     },
        #     "batteryVoltage": 3.1,
        # }


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
