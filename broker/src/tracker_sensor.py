from virtual_sensor import Sensor
import json

# This needs to have some functions for updating !


class Tracker(Sensor):
    def __init__(self, **kwargs):
        super().__init__()
        self.tracker_info = self.kwarging(kwargs, "tracker_info")
        self.device_info = self.kwarging(kwargs, "device_info")
        self.object_info = self.kwarging(kwargs, "object_info")
        self.rxInfo = self.kwarging(kwargs, "rxInfo")
        self.txInfo = self.kwarging(kwargs, "txInfo")
        self.update_final_info()

    def update_device_info(self, **kwargs) -> dict:
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

        device_info.update(self.device_info)
        self.device_info = device_info

        return device_info

    def update_object_info(self, **kwargs):
        """
        Parameters :

        inactivityAlarm, type, batCritical, inTrip, speedKmph , latitudeDeg, headingDeg, longitudeDeg , fixFailed, batV

        Parameter information:

            inactivityAlarm :
            type : str
            batCritical :
            inTrip : bool
            cached
                speedKmph : float
                latitudeDeg : float
                headingDeg : float
                longitudeDeg : float
            fixFailed : bool
            batV : float
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

        object_info.update(self.object_info)
        self.object_info = object_info

        return object_info

    def update_rxInfo(self, **kwargs):
        """

        Parameters :

        gatewayId, uplinkId, rssi, snr, channel, latitude, longitude, context, region_common_name, region_config_id, crcStatus

        Parameter information

            gatewayId : str
            uplinkId : float
            rssi : float
            snr : float
            channel : int
            location
                latitude : float
                longitude : float
            context : str
            metadata
                region_common_name : str
                region_config_id : str
            crcStatus : str
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
        rxInfo[0].update(self.rxInfo[0])
        self.rxInfo[0] = rxInfo[0]
        return rxInfo

    def update_txInfo(self, **kwargs):
        """

        Parameters :

        frequency, bandwidth, spreadingFactor, codeRate

        Parameter information


        frequency : int
        modulation
            lora
                bandwidth : int
                spreadingFactor : int
                codeRate : str
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
        txInfo.update(self.txInfo)
        self.txInfo = txInfo

        return txInfo

    def update_tracker_info(self, **kwargs):
        """

        Parameters :

        deviceInfo, devAddr, adr, dr, fCnt, fPort, confirmed, data, object, rxInfo, txInfo

        Parameter information

            deviceInfo : dict
            devAddr : str
            adr : bool
            dr : int
            fCnt : int
            fPort : int
            confirmed : bool
            data : str
            object : dict
            rxInfo : List of dictionaries
            txInfo : dict
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

        tracker_info.update(self.tracker_info)
        self.tracker_info = tracker_info

        return tracker_info

    def update_dictionary(self):
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

    def update_final_info(self, important_info: dict = None, generic_info: dict = None):
        important_info = {
            "type": "position",
            "deviceId": "digital-matter-oyster3:1",
            "latitude": 38.288403977154466,
            "longitude": 21.788731921156614,
            # ----- cached geo ------
            "speedKmph": 0,
            "latitudeDeg": 38.2882484,
            "headingDeg": 348.75,
            "longitudeDeg": 21.7887801,
            # ----- cached geo ------
        }

        if generic_info is None:
            generic_info = {
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

        generic_info.update(important_info)

        device_info = self.update_device_info(**generic_info)
        object_info = self.update_object_info(**generic_info)
        rxInfo_list = self.update_rxInfo(**generic_info)
        txInfo_dictionary = self.update_txInfo(**generic_info)
        tracker_info = self.update_tracker_info(
            object=object_info,
            rxInfo=rxInfo_list,
            txInfo=txInfo_dictionary,
            deviceInfo=device_info,
            **generic_info,
        )

        self.info.update(tracker_info)
        self.info_json = json.dumps(self.info)

        # return self.info


if __name__ == "__main__":
    sensor = Tracker()
    print(sensor.info)
