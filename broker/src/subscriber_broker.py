from broker import Broker


class Subscriber(Broker):
    def __init__(self, client_id=None, topic=None, broker=None, port=None):
        super().__init__(client_id, topic, broker, port)
        self.subscribe_topic = "team7/custom/trackers"
        self.topic = "team7/custom/trackers"
        self.client_id = "indi-sub"
        self.client = self.connect_mqtt()

    def main(self):
        self.subscribe(self.client)

    def on_message(self, client, userdata, msg):
        super().on_message(client, userdata, msg)


if __name__ == "__main__":
    broker = Subscriber()
    # broker.run_loop()
    broker.run_once()
