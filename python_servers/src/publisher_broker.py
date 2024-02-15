from broker import Broker
import time
from tracker_sensor import TrackerMQTTFormat
from button_sensor import Button
import random
from coords_generator import CoordsGenerator


class Publisher(Broker):
    def __init__(
        self, client_id=None, topic=None, broker=None, port=None, run_only_once=False
    ):
        super().__init__(client_id, topic, broker, port, run_only_once)
        self.client_id = f"pub-{self.generate_unique_hash()}"
        self.publish_topic = "team7/custom/trackers"
        self.subscribe_topic = None
        self.client = self.connect_mqtt()

    def virtual_tracker(self, **kwargs):
        counter = kwargs.get("counter", 1)
        default_lat = 38.2882484 + (random.choice([1, -1]) * 0.01 * counter)
        default_lon = 21.7887801 + (random.choice([1, -1]) * 0.01 * counter)
        latitude = kwargs.get("latitude", default_lat)
        longitude = kwargs.get("longitude", default_lon)
        deault_id = random.randint(1, 55)
        idd = kwargs.get("idd", deault_id)

        tracker_info = {
            "type": "position",
            "deviceId": f"digital-matter-oyster3:{idd}",
            # cached
            "speedKmph": 0,
            "latitudeDeg": latitude,
            "headingDeg": 348.75,
            "longitudeDeg": longitude,
            "batV": 5 - counter * 0.001,
        }

        payload = TrackerMQTTFormat(important_info=tracker_info).info_json

        return payload

    def virtual_button(self, **kwargs):
        default_idd = random.randint(1, 45)
        idd = kwargs.get("idd", default_idd)
        default_event = f"0{random.randint(0, 2)}"
        event = kwargs.get("event", default_event)

        button_info = {
            "deviceName": "mclimate-multipurpose-button:1",
            # "deviceId": f"mclimate-multipurpose-button:{random.randint(1,45)}",
            "deviceId": f"mclimate-multipurpose-button:{idd}",
            "batteryVoltage": 3.1,
            "temperature": 21.7 + (random.choice([1, -1]) * 2),
            "thermistorProperlyConnected": True,
            "pressEvent": event,
        }

        payload = Button(important_info=button_info).info_json
        return payload

    def main(self):
        # This needs to be from a folder
        counter = 0
        time_sleeping = 4

        # timestamp = "2024-02-10T01:05:29.934532"

        for counter in range(1000):
            time.sleep(time_sleeping)
            payload = self.virtual_tracker(counter)
            self.publish(self.client, payload)
            time.sleep(time_sleeping)
            payload = self.virtual_button()
            self.publish(self.client, payload)


if __name__ == "__main__":
    broker = Publisher()
    broker.run_loop()
