from paho.mqtt import client as mqtt_client
import json
from pathlib import Path
import sys


class Broker:
    def __init__(
        self,
        client_id: str = None,
        topic: str = None,
        broker: str = None,
        port: int = None,
        run_only_once: bool = False,
    ):
        if client_id is None:
            client_id = "clienting-stuff"
        if topic is None:
            topic = "#"
            # topic = "Environmental/dutch-sensor-systems-ranos-db-2:1"
        if broker is None:
            broker = "150.140.186.118"
        if port is None:
            port = 1883

        self.client_id = client_id
        self.subscribe_topic = topic
        self.publish_topic = topic
        self.broker = broker
        self.port = port
        self.run_only_once = run_only_once

        # Connecting client
        # self.client = self.connect_mqtt()

    def json_to_dict(self, payload):
        try:
            return json.loads(payload)
        except:
            return None

    def dict_to_json(self, payload):
        """Converts a dict to a json string"""
        try:
            return json.dumps(payload)
        except:
            return None

    def connect_mqtt(self):
        client = mqtt_client.Client(self.client_id)
        client.on_connect = self.on_connect
        client.connect(self.broker, self.port)
        return client

    def on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            print(
                f"Connected to MQTT Broker as {self.client_id} at {self.broker}:{self.port}"
            )
        else:
            print("Failed to connect, return code %d\n", rc)

    def subscribe(self, client):
        client.subscribe(self.subscribe_topic)
        client.on_message = self.on_message

    def publish(self, client, payload):
        # msg_count = 1
        client.on_publish = self.on_publish
        client.publish(self.publish_topic, payload)

    def on_message(self, client, userdata, msg):
        # print(f"Received `{msg.payload.decode()}` from `{msg.topic}` topic")
        # turn msg.payload.decode() into a dict
        # message = dict(text)
        print(f"Received {len(msg.payload.decode())} length message from {msg.topic}")
        if self.run_only_once:
            self.exit()
        # self.logging(final_text)

    def on_publish(self, client, userdata, mid):
        print(f"Published {mid:>5} to {self.publish_topic}")
        if self.run_only_once:
            self.exit()

    def path_to_file(self, filename):
        """returns the path to the file"""
        return Path(__file__).parent / filename

    def logging(self, message, file=None):
        if file is None:
            file = "broker.log"
        file = self.path_to_file(file)
        with open(file, "a") as f:
            f.write(message)

    def run_loop(self):
        self.main()
        self.client.loop_forever()

    def run_once(self):
        # self.client.loop_start()
        self.run_only_once = True
        self.run_loop()

    def main(self):
        pass

    def exit(self):
        print("Exiting")
        self.client.disconnect()
        sys.exit(0)


if __name__ == "__main__":
    broker = Broker(topic="#")
    broker.run_loop()
