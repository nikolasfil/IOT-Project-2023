from broker import Broker
import json
import time
from tracker_sensor import Tracker


class Publisher(Broker):
    def __init__(
        self, client_id=None, topic=None, broker=None, port=None, run_only_once=False
    ):
        super().__init__(client_id, topic, broker, port, run_only_once)
        self.client_id = "indi-pub"
        self.publish_topic = "team7/custom/trackers"
        self.subscribe_topic = None
        self.client = self.connect_mqtt()

    def main(self):
        # for i in range(10):
        # This needs to be from a folder
        counter = 0
        while counter < 1000:
            important_info = {
                "type": "position",
                "deviceId": "digital-matter-oyster3:1",
                # cached
                "speedKmph": 0,
                "latitudeDeg": 38.2882484 + counter * 0.00001,
                "headingDeg": 348.75,
                "longitudeDeg": 21.7887801 + counter * 0.00001,
                "batV": 5 - counter * 0.001,
            }

            payload = Tracker(important_info=important_info).info_json
            self.publish(self.client, payload)
            time.sleep(2)
            counter += 1

    # def on_publish(self, client, userdata, mid):
    #     super().on_publish(client, userdata, mid)


if __name__ == "__main__":
    broker = Publisher()
    broker.run_loop()
