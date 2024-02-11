from paho.mqtt import client as mqtt_client
import json
from pathlib import Path
import sys
import datetime
import uuid


class Broker:
    def __init__(
        self,
        client_id: str = None,
        topic: str = None,
        broker: str = None,
        port: int = None,
        run_only_once: bool = False,
        debug: bool = False,
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
        self.debug = debug

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
        self.payload = msg.payload
        self.py_obj_payload = self.json_to_dict(msg.payload)

        if self.debug:
            print(
                f"Received {len(msg.payload.decode())} length message from {msg.topic}"
            )
        if self.run_only_once:
            self.exit()
        # self.logging(final_text)

    def on_publish(self, client, userdata, mid):
        if self.debug:
            print(f"Published {mid:>5} to {self.publish_topic}")
        if self.run_only_once:
            self.exit()

    def path_to_file(self, filename):
        """returns the path to the file"""
        parent_folder = Path(__file__).parent
        return Path(parent_folder, filename)

    def logging(self, message, file=None):
        if file is None:
            file = "broker.log"
        file = self.path_to_file(file)
        with open(file, "a") as f:
            f.write(message)

    def run_loop(self):
        try:
            self.main()
            self.client.loop_forever()
        except KeyboardInterrupt:
            self.exit()

    def run_once(self):
        # self.client.loop_start()
        self.run_only_once = True
        self.run_loop()

    def main(self):
        pass

    def exit(self):
        print("\n\nExiting\n\n")
        self.client.disconnect()
        sys.exit(0)

    def generate_unique_hash(self):
        # Get current timestamp
        current_time = datetime.datetime.now().timestamp()

        # Convert timestamp to string and hash it using uuid
        hashed_value = uuid.uuid5(uuid.NAMESPACE_DNS, str(current_time))

        formatted_hash = str(hashed_value)
        return formatted_hash


if __name__ == "__main__":
    broker = Broker(topic="#")
    broker.run_loop()
