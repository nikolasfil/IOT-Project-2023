from broker import Broker
import datetime


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
        # text = str(msg.payload.decode())
        # .replace("'",'''"''').replace("None",'''"None"''').replace("True",'''"None"'''))
        # message = eval(text)
        # msg.payload
        # print(payload)

        deviceId = self.py_obj_payload.get("deviceInfo").get("tags").get("deviceId")
        latitude = self.py_obj_payload.get("object").get("cached").get("latitudeDeg")
        longitude = self.py_obj_payload.get("object").get("cached").get("longitudeDeg")
        batV = self.py_obj_payload.get("object").get("batV")
        time_recorded = self.py_obj_payload.get("time")

        text = f"{deviceId=} \n{latitude=} \n{longitude=} \n{batV=} \n{time_recorded=}"

        current_datetime = datetime.datetime.now()
        delim = f"\n\n {'-'*10} {current_datetime:%Y-%m-%d %H:%M:%S} {'-'*10}\n\n"
        final_text = delim + text + delim
        # final_text = delim + str("") + delim

        print(final_text)
        super().on_message(client, userdata, msg)


if __name__ == "__main__":
    broker = Subscriber()
    broker.run_loop()
    # broker.run_once()
