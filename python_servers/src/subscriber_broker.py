from broker import Broker
import datetime
from context_provider import ContextProvider


class Subscriber(Broker):
    def __init__(
        self, client_id=None, topic=None, broker=None, port=None, run_only_once=False
    ):
        super().__init__(client_id, topic, broker, port, run_only_once)
        self.subscribe_topic = "team7/custom/trackers"
        self.topic = "team7/custom/trackers"
        self.client_id = "indi-sub"
        self.client = self.connect_mqtt()

    def main(self):
        self.subscribe(self.client)

    def on_message(self, client, userdata, msg):
        text = str(msg.payload.decode())
        current_datetime = datetime.datetime.now()
        delim = f"\n\n {'-'*10} {current_datetime:%Y-%m-%d %H:%M:%S} {'-'*10}\n\n"
        final_text = delim + text + delim
        print(final_text)
        super().on_message(client, userdata, msg)
        self.handling_tracker()

    def handling_tracker(self):
        deviceId = self.py_obj_payload.get("deviceInfo").get("tags").get("deviceId")
        latitude = self.py_obj_payload.get("object").get("cached").get("latitudeDeg")
        longitude = self.py_obj_payload.get("object").get("cached").get("longitudeDeg")
        batV = self.py_obj_payload.get("object").get("batV")
        time_recorded = self.py_obj_payload.get("time")

        text = f"{deviceId=} \n{latitude=} \n{longitude=} \n{batV=} \n{time_recorded=}"
        # print(text)

        # Send the information to the connector server
        connector_server = ContextProvider(
            # url="http://localhost:5000/device_info",
            url="http://connector-app:5000/device_info",
            headers={"Content-Type": "application/json"},
            method="POST",
            payload=self.py_obj_payload,
            automated=True,
        )

        # print(connector_server.response_json)

    def handling_button(self):
        # Sends the information to the connector server
        pass


if __name__ == "__main__":
    broker = Subscriber()
    broker.run_loop()
    # broker.run_once()
