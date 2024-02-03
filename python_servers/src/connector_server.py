from flask import Flask, request, jsonify
import requests
import json
from sensor_context_provider import SensorCP

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

    tracker = SensorCP(
        base_url="http://150.140.186.118:1026", entity_id=entity_id, debug=True
    )
    print(tracker.entity_data)
    data = str(tracker.get_entity())
    return data


# url_for('static', filename='style.css')

if __name__ == "__main__":
    # app.run(host="0.0.0.0", port=5000, debug=True)
    app.run(host="0.0.0.0", port=5000, debug=True)
