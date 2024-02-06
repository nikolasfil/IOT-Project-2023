from flask import Flask, request
from sensor_context_provider import SensorCP
from tracker_sensor import TrackerCPF, Tracker
from dotenv import load_dotenv
import os


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
    data_python = tracker.response_python_object

    return data_json


@app.post("/device_info")
def device_info():
    """
    Description:
        Get device info from the mqtt server

    """
    # Send the info to the database
    # Send the info to the context broker

    load_dotenv()
    baseurl = os.getenv("CPURL")

    data = request.json
    # print(data)
    # print(data)
    tracker = Tracker(generic_info=data)
    data = tracker.mqtt_to_cp()

    # data["id"] = "test_id"

    trackerCP = TrackerCPF(base_url=baseurl, entity_data=data, debug=True)

    print(trackerCP["id"])
    # trackerCP.new_entity()
    # print(trackerCP.info)

    entity = SensorCP(
        entity_data=trackerCP.info,
        debug=True,
    )
    entity.new_entity()

    return data


if __name__ == "__main__":

    app.run(host="0.0.0.0", port=5000, debug=True)
