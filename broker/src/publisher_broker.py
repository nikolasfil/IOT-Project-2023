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

    def main(self):
        example = {
            "dataid": 1,
            "data": {
                "id": "entity_id",
                "type": "Entity",
                "temperature": {"value": 25.0, "type": "Float"},
            },
        }
        payload = json.dumps(example)
        self.publish(self.client, payload)

    def run_loop(self):
        client = self.connect_mqtt()
        client.loop_start()
        for i in range(10):
            info = {
                "object_info": {"type": "position", "batV": 600 - i},
                "rxInfo_info": {"latitude": 38 + 0.1 * i, "longitude": 21 + 0.1 * i},
                # "device_info": {}
            }
            payload = Tracker(**info).info_json

            time.sleep(2)
            self.publish(client, payload)
        client.loop_stop()
        # client.loop_forever()

    # def on_publish(self, client, userdata, mid):
    #     print(userdata)
    #     # json_payload = json.dumps(dict)


if __name__ == "__main__":
    broker = Publisher()
    broker.run_loop()
