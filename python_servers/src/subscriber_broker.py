from broker import Broker
import datetime
from context_provider import ContextProvider
import os
from dotenv import load_dotenv


class Subscriber(Broker):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.subscribe_topic = "team7/custom/trackers"
        self.topic = "team7/custom/trackers"
        self.client_id = f"sub-{self.generate_unique_hash()}"
        self.client = self.connect_mqtt()

    def main(self):
        self.subscribe(self.client)

    def on_message(self, client, userdata, msg):
        text = str(msg.payload.decode())
        current_datetime = datetime.datetime.now()
        delim = f"\n\n {'-'*10} {current_datetime:%Y-%m-%d %H:%M:%S} {'-'*10}\n\n"
        final_text = delim + text + delim
        if self.debug:
            print(final_text)
        super().on_message(client, userdata, msg)

        self.handling_device()

    def handling_device(self):
        # Send the information to the connector server
        network_url = os.getenv("URL")

        # if self.py_obj_payload:
        # if self.py_obj_payload

        connector_server = ContextProvider(
            url=f"http://{network_url}:5000/device_info",
            headers={"Content-Type": "application/json"},
            method="POST",
            payload=self.py_obj_payload,
            automated=True,
        )


if __name__ == "__main__":
    load_dotenv()
    debug = os.getenv("DEBUG")
    broker = Subscriber()
    broker.run_loop()
