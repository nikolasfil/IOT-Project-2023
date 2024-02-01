from broker import Broker
import json


class Publisher(Broker):
    def __init__(self, client_id=None, topic=None, broker=None, port=None):
        super().__init__(client_id, topic, broker, port)
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
        example = {
            "dataid": 1,
            "data": {
                "id": "entity_id",
                "type": "Entity",
                "temperature": {"value": 25.0, "type": "Float"},
            },
        }
        payload = json.dumps(example)
        client = self.connect_mqtt()
        self.publish(client, "Hello")
        client.loop_forever()

    # def on_publish(self, client, userdata, mid):
    #     print(userdata)
    #     # json_payload = json.dumps(dict)


if __name__ == "__main__":
    broker = Publisher()
    broker.run_loop()
