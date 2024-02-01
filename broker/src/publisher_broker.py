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
        # for i in range(10):
        # This needs to be from a folder
        counter = 0
        while counter < 1000:
            important_info = {
                "type": "position",
                "deviceId": "digital-matter-oyster3:1",
                "latitude": 38.288403977154466 + counter * 0.00001,
                "longitude": 21.788731921156614 + counter * 0.00001,
                # cached
                "speedKmph": 0,
                "latitudeDeg": 38.2882484,
                "headingDeg": 348.75,
                "longitudeDeg": 21.7887801,
                "batV": 5 - counter * 0.001,
            }

            payload = Tracker(important_info=important_info).info_json
            self.publish(self.client, payload)
            time.sleep(2)
            counter += 1

    def on_publish(self, client, userdata, mid):
        print(f"Published {mid:>5} to {self.publish_topic}")


if __name__ == "__main__":
    broker = Publisher()
    broker.run_loop()
