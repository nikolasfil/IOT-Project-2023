from subscriber_broker import Subscriber


class SubServer(Subscriber):
    def on_message(self, client, userdata, msg):
        super().on_message(client, userdata, msg)
        # Send the msg payload
        

if __name__ == "__main__":
    server = SubServer()
    server.run_loop()
