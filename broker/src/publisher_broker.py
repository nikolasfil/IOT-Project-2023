from broker import Broker
import json
import time
from tracker_sensor import Tracker


class Publisher(Broker):
    def __init__(self, client_id=None, topic=None, broker=None, port=None):
        super().__init__(client_id, topic, broker, port)
        self.client_id = "indi-pub"
        self.publish_topic = "team7/custom/trackers"
        self.subscribe_topic = None
        self.client = self.connect_mqtt()

    def main(self):
        for i in range(10):
            info = {
                "device_info": {
                    "deviceName": "DPP",
                    # "deviceName": "digital-matter-oyster3:1",
                    "deviceId": "DOYO",
                },
                "object_info": {
                    "type": "position",
                    "batV": 600 - i,
                },
                "rxInfo_info": {"latitude": 38 + 0.1 * i, "longitude": 21 + 0.1 * i},
                # "device_info": {}
            }
            payload = Tracker(**info).info_json

            time.sleep(2)
            self.publish(self.client, payload)


if __name__ == "__main__":
    broker = Publisher()
    broker.run_once()
