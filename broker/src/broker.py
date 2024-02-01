from paho.mqtt import client as mqtt_client
import json
from pathlib import Path
import datetime


class Broker:
    def __init__(self, client_id=None, topic=None, broker=None, port=None):
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

        # Connecting client
        # self.client = self.connect_mqtt()

    def connect_mqtt(self):
        client = mqtt_client.Client(self.client_id)
        client.on_connect = self.on_connect
        client.connect(self.broker, self.port)
        return client

    def on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            print("Connected to MQTT Broker!")
            print(f"Subscribing to topic: {self.subscribe_topic}")
            print(f"{userdata=}")
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
        extra = msg
        text = str(msg.payload.decode())
        # .replace("'",'''"''').replace("None",'''"None"''').replace("True",'''"None"'''))
        # message = eval(text)
        try:
            json_payload = json.loads(msg.payload)
        except:
            json_payload = None

        # turn msg.payload.decode() into a dict
        # message = dict(text)

        current_datetime = datetime.datetime.now()
        delim = f"\n\n {'-'*10} {current_datetime:%Y-%m-%d %H:%M:%S} {'-'*10}\n\n"

        final_text = delim + text + delim
        # final_text = delim + str("") + delim

        print(final_text)

        # self.logging(final_text)

    def on_publish(self, client, userdata, mid):
        print(userdata)
        # json_payload = json.dumps(dict)

    # def main(self):
    #     self.subscribe(self.client)

    # def run_loop(self):
    #     # client = self.connect_mqtt()
    #     # self.subscribe(client)
    #     self.main()
    #     self.client.loop_forever()

    # def run_once(self):
    #     # Alternative
    #     self.client.loop_start()
    #     self.main()
    #     # self.publish(self.main_client)
    #     self.client.loop_stop()

    def path_to_file(self, filename):
        """returns the path to the file"""
        return Path(__file__).parent / filename

    def logging(self, message, file=None):
        if file is None:
            file = "broker.log"
        file = self.path_to_file(file)
        with open(file, "a") as f:
            f.write(message)


if __name__ == "__main__":
    broker = Broker(topic="#")
    broker.run_loop()
