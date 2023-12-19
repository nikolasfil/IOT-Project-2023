from paho.mqtt import client as mqtt_client
import json


class Broker:
    def __init__(self, client_id=None, topic=None, broker=None, port=None):
        if client_id is None:
            self.client_id = "clienting-stuff"

        # topic = 'Environmental/barani-meteohelix-iot-pro:1'
        if topic is None:
            self.topic = "Environmental/dutch-sensor-systems-ranos-db-2:1"
        if broker is None:
            self.broker = "150.140.186.118"
        if port is None:
            self.port = 1883
        self.run()

    def connect_mqtt(self):
        def on_connect(client, userdata, flags, rc):
            if rc == 0:
                print("Connected to MQTT Broker!")
            else:
                print("Failed to connect, return code %d\n", rc)

        client = mqtt_client.Client(self.client_id)
        # client.username_pw_set(username, password)
        client.on_connect = on_connect
        client.connect(self.broker, self.port)
        return client

    def subscribe(self, client):
        def on_message(client, userdata, msg):
            # print(f"Received `{msg.payload.decode()}` from `{msg.topic}` topic")
            text = str(
                msg.payload.decode()
            )  # .replace("'",'''"''').replace("None",'''"None"''').replace("True",'''"None"'''))
            message = eval(text)
            # message = dict(text)

            # message = json.loads(text)
            # print(message.keys())
            print(message)

        client.subscribe(self.topic)
        client.on_message = on_message

    def run(self):
        client = self.connect_mqtt()
        self.subscribe(client)
        client.loop_forever()

    def logging(self):
        pass


if __name__ == "__main__":
    broker = Broker()
