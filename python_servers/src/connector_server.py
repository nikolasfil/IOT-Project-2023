from flask import Flask, request
from sensor_context_provider import SensorCP
from tracker_sensor import Tracker
from button_sensor import Button
from context_provider import ContextProvider

app = Flask(__name__)


@app.route("/")
def home():
    data = "<p>Home</p>"
    return data


@app.get("/tracker")
@app.post("/tracker")
def get_tracker():
    """
    Describtion:
        Get the tracker data from the context broker

    Returns:
        json data: The data from the context broker
    """

    if request.method == "GET":
        entity_id = request.args.get("id")
    elif request.method == "POST":
        if request.is_json:
            entity_id = request.json.get("id")

    if entity_id is None:
        return "No entity_id given"

    # tracker = SensorCP(base_url="http://150.140.186.118:1026", entity_id=entity_id)
    tracker = SensorCP(base_url="http://150.140.186.118:1026", entity_id=entity_id)
    if tracker.response_json is None:
        return "No data found"
    data_json = tracker.response_json

    return data_json


@app.post("/device_info")
def device_info():
    """
    Description:
        Get device info from the mqtt server

    """

    data = request.json
    data = handling_device(data)
    return data


def handling_device(information):
    asset = None
    if information.get("deviceInfo").get("applicationName") == "Asset tracking":

        asset = Tracker(generic_info=information)

    elif information.get("deviceInfo").get("applicationName") == "Buttons":
        asset = Button(generic_info=information)

    if asset is None:
        return None

    asset.mqtt_to_cp()
    print(asset.cp_info)
    entity = SensorCP(entity_data=asset.cp_info)
    entity.new_entity()
    data = entity.entity_data

    return data


if __name__ == "__main__":
    from dotenv import load_dotenv
    import os

    load_dotenv()
    debug = os.getenv("FLASK_DEBUG")
    if str(debug) == "0":
        debug = False
    else:
        debug = True
    app.run(host="0.0.0.0", port=5000, debug=debug)
