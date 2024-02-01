from broker import Broker


class Subscriber(Broker):
    def __init__(self, client_id=None, topic=None, broker=None, port=None):
        super().__init__(client_id, topic, broker, port)
        self.subscribe_topic = "team7/custom/trackers"
        self.topic = "team7/custom/trackers"
        self.client_id = "indi-sub"

    def main(self):
        self.subscribe(self.client)

    def run_loop(self):
        client = self.connect_mqtt()
        self.subscribe(client)
        client.loop_forever()


if __name__ == "__main__":
    broker = Subscriber()
    broker.run_loop()
