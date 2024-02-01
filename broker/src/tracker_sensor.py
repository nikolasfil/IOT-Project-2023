from virtual_sensor import Sensor


class Tracker(Sensor):
    def __init__(self):
        super().__init__()

    def create_device_info(self, **kwargs) -> dict:
        """
        Parameters :

        tenantId, tenantName, applicationId, applicationName, deviceProfileId, deviceProfileName, deviceName, devEui, deviceId, apiKey


        Parameter information:

            tenantId : str
            tenantName: str
            applicationId : str
            applicationName : str
            deviceProfileId : str
            deviceProfileName : str
            deviceName : str
            devEui : str
            tags: dict
                deviceId : str
                apiKey : str

        """
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
        return device_info

    def create_object_info(self, **kwargs):
        """
        Parameters :

        inactivityAlarm, type, batCritical, inTrip, speedKmph , latitudeDeg, headingDeg, longitudeDeg , fixFailed, batV

        Parameter information:

            inactivityAlarm : For the device
            type : For the device
            batCritical : For the device
            inTrip : For the device
            cached
                speedKmph : For the device
                latitudeDeg : For the device
                headingDeg : For the device
                longitudeDeg : For the device
            fixFailed : For the device
            batV : For the device
        """
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
        return object_info

    def create_rxInfo(self, **kwargs):
        """

        Parameters :

        gatewayId, uplinkId, rssi, snr, channel, latitude, longitude, context, region_common_name, region_config_id, crcStatus

        Parameter information

            gatewayId : For the device
            uplinkId : For the device
            rssi : For the device
            snr : For the device
            channel : For the device
            location
                latitude : For the device
                longitude : For the device
            context : For the device
            metadata
                region_common_name : For the device
                region_config_id : For the device
            crcStatus : For the device
        """
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
        return rxInfo

    def create_txInfo(self, **kwargs):
        """

        Parameters :

        frequency, bandwidth, spreadingFactor, codeRate

        Parameter information


        frequency : For the device
        modulation
            lora
                bandwidth : For the device
                spreadingFactor : For the device
                codeRate : For the device
        """
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
        return txInfo

    def create_tracker_info(self, **kwargs):
        """

        Parameters :

        deviceInfo, devAddr, adr, dr, fCnt, fPort, confirmed, data, object, rxInfo, txInfo

        Parameter information

            deviceInfo : For the device
            devAddr : For the device
            adr : For the device
            dr : For the device
            fCnt : For the device
            fPort : For the device
            confirmed : For the device
            data : For the device
            object : For the device
            rxInfo : List of dictionaries
            txInfo : Dictionary
        """
        tracker_info = {
            "deviceInfo": kwargs.get("deviceInfo"),
            "devAddr": kwargs.get("devAddr"),
            "adr": kwargs.get("adr"),
            "dr": kwargs.get("dr"),
            "fCnt": kwargs.get("fCnt"),
            "fPort": kwargs.get("fPort"),
            "confirmed": kwargs.get("confirmed"),
            "data": kwargs.get("data"),
            "object": kwargs.get("object"),
            "rxInfo": kwargs.get("rxInfo"),
            "txInfo": kwargs.get("txInfo"),
        }
        return tracker_info

    def create_dictionary(self):
        # dedubplcationId = self.generate_unique_hash()
        device_info_dictionary = {
            "tenantId": None,
            "tenantName": None,
            "applicationId": None,
            "applicationName": None,
            "deviceProfileId": "82ff747e-1de8-4c38-8a8a-9319f3468732",
            "deviceProfileName": "Digital Matter Oyster3",
            "deviceName": "digital-matter-oyster3:1",
            "devEui": "70b3d570500134ae",
            "tags": {
                "deviceId": "digital-matter-oyster3:1",
                "apiKey": "4jggokgpesnvfb2uv1s40d73ov",
            },
        }

        object_info_dictionary = {
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
        }

        rxInfo_list = [
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
        ]

        txInfo_dictionary = {
            "frequency": 867500000,
            "modulation": {
                "lora": {
                    "bandwidth": 125000,
                    "spreadingFactor": 10,
                    "codeRate": "CR_4_5",
                }
            },
        }

        tracker_dictionary = {
            "deviceInfo": device_info_dictionary,
            "devAddr": "002f2c62",
            "adr": False,
            "dr": 2,
            "fCnt": 715,
            "fPort": 1,
            "confirmed": False,
            "data": "tFLSFjm0/Az7ANI=",
            "object": object_info_dictionary,
            "rxInfo": rxInfo_list,
            "txInfo": txInfo_dictionary,
        }

        self.info.update(tracker_dictionary)

    def updating_dictionary(self):
        self.info["deviceInfo"]["tenantId"] = "063a0ecb-e8c2-4a13-975a-93d791e8d40c"
        self.info["deviceInfo"]["tenantName"] = "Smart Campus"
        self.info["deviceInfo"][
            "applicationId"
        ] = "063a0ecb-e8c2-4a13-975a-93d791e8d40c"
        self.info["deviceInfo"]["applicationName"] = "AdGuard"
        self.info["deviceInfo"]["tags"]["deviceId"] = "digital-matter-oyster3:1"

    def final_dictionary(self):
        final_info = {
            "tenantName": "Smart Campus",
            "tenantID": "063a0ecb-e8c2-4a13-975a-93d791e8d40c",
            "applicationId": "420",
            "applicationName": "AdGuard",
            "deviceProfileId": "82ff747e-1de8-4c38-8a8a-9319f3468732",
            "deviceProfileName": "Digital Matter Oyster3",
            "deviceName": "digital-matter-oyster3:1",
            "devEui": "70b3d570500134ae",
            "deviceId": "digital-matter-oyster3:1",
            "apiKey": "4jggokgpesnvfb2uv1s40d73ov",
        }
        device_info = self.create_device_info(**final_info)
        object_info = self.create_object_info()
        rxInfo_list = self.create_rxInfo()
        txInfo_dictionary = self.create_txInfo()
        tracker_info = self.create_tracker_info(
            object=object_info,
            rxInfo=rxInfo_list,
            txInfo=txInfo_dictionary,
            deviceInfo=device_info,
        )

        self.info.update(tracker_info)
        # return self.info


if __name__ == "__main__":
    sensor = Tracker()
    sensor.final_dictionary()
    print(sensor.info)
