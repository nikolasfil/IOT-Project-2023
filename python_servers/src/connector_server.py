from flask import Flask, request
from sensor_context_provider import SensorCPConnector
from tracker_sensor import TrackerMQTTFormat
from button_sensor import Button
from context_provider import ContextProvider

app = Flask(__name__)


@app.route("/", methods=["GET", "POST"])
def home():
    """
    Description:
        The home page of the server. A simple request to check if the server is running

    Returns:
        str: Html rendered information
    """
    data = "<p>Home</p>"
    return data


@app.get("/device")
@app.post("/device")
def get_device():
    """
    Description:
        Get the device data from the context broker

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

    device = SensorCPConnector(
        base_url="http://150.140.186.118:1026", entity_id=entity_id
    )

    if device.response_json is None:
        return "No data found"

    data_json = device.response_json

    return data_json


@app.post("/device_info")
def device_info():
    """
    Description:
        Get device info from the mqtt server

    """

    data = request.json
    data = handling_device(data)
    print("============== ===========")
    save_to_database(data)

    return data


# -------- Internal functions -------------


def handling_device(information):
    """
    Description:
        Handles the information from the mqtt server and changes it to the context provider format
        It takes in the Sensor like class, differentiates between a Tracker and a Button, and then changes the information to the context provider format

    Args:
        information (json): The information from the mqtt server in a json format, containing the device information as it is sent from the mqtt server

    Returns:
        None: if the device information is not recognized as a Tracker or a Button
        json: The information in the context provider format
    """

    # Initialize the asset as the application name from the device information, or if it gets no result : None
    asset = information.get("deviceInfo").get("applicationName")

    # Check if it is a Tracker or a Button
    if asset == "Asset tracking" or asset == "tracker":
        asset = TrackerMQTTFormat(generic_info=information)

    elif asset == "Buttons":
        asset = Button(generic_info=information)

    # If it is still None, then it is not recognized as a Tracker or a Button
    if asset is None:
        return None

    # print(asset.info.get("time"))
    # Change the information to the context provider format
    asset.mqtt_to_cp()

    # Print the information for debug purposes
    # print(asset.cp_info)

    # Create the entity in the context broker
    entity = SensorCPConnector(
        entity_data=asset.cp_info,
        # debug=True,
    )
    # If the entity with the given id exists in the context provider it, delete it and create a new. If it is not, create a new one
    entity.new_entity()

    # Return the information in the context provider format
    data = entity.entity_data

    # Useless, just as a check if we need to get the information from the context broker
    return data


def save_to_database(data):
    """
    Description:
        Saves the data to the database

    Args:
        data (json): The data to be saved to the database

    Returns:
        None
    """

    # First I got to take the serial of the device and get the id.
    query = "INSERT INTO "
    data = build_sql_data(data)

    if data is None:
        print("Something went wrong with the sql building")
        return None

    if data.get("event") is not None:
        query += "Pressed "
    elif data.get("latitude") is not None:
        # elif data.get("location") is not None:
        query += "Tracked "
    else:
        print("No event or location")
        return None

    columns = list(data.keys())
    values = [data[key] for key in columns]

    # New lists
    query += f"({','.join(columns)}) VALUES ("
    query += ",".join(["?" for _ in columns]) + ")"

    payload = {
        "data": {
            "query": query,
            "arguments": values,
        }
    }
    print(query, values)

    database_url = f"http://{os.getenv('DBURL')}:7080/command"
    headers = {"Content-Type": "application/json"}
    db = ContextProvider(
        url=database_url,
        headers=headers,
        method="POST",
        payload=payload,
        automated=True,
        debug=True,
    )

    if db and not db.response.ok:
        print(db.response.text)


def get_id(serial):
    """
    Description:
        Get the id of the device from the database

    Args:
        serial (str): The serial number of the device

    Returns:
        str: The id of the device
    """

    payload = {
        "data": {
            "query": "SELECT d_id FROM DEVICE WHERE serial = ? LIMIT 1 ",
            "arguments": [serial],
        }
    }

    database_url = f"http://{os.getenv('DBURL')}:7080/command"
    headers = {"Content-Type": "application/json"}
    db = ContextProvider(
        url=database_url,
        headers=headers,
        method="POST",
        payload=payload,
        automated=True,
    )

    if not db.response.ok:
        print(db.response.text)
        return None

    # Check what the response is and return only the id
    d_id = db.response_json[0].get("d_id")
    return d_id


def build_sql_data(device_data):
    """
    Description:
        Build the data for the sql database

    Args:
        device_data (json): The data from the device

    Returns:
        json: The data in the format for the sql database
    """

    # Since the data is coming from the context provider format
    serial = device_data.get("id")

    # Get the id of the device
    d_id = get_id(serial)

    # If the id is not found, return None
    if d_id is None:
        return None

    # Get the data from the device

    # Create the data for the sql database
    sql_data = {
        "device_id": d_id,
        "time": device_data.get("timestamp").get("value").get("time"),
        "date": device_data.get("timestamp").get("value").get("date"),
        "temperature": device_data.get("temperature").get("value"),
    }

    if device_data.get("event") is not None:
        sql_data["event"] = device_data.get("event").get("value")
    elif device_data.get("location") is not None:
        sql_data["latitude"] = device_data.get("location").get("value").get("latitude")
        sql_data["longitude"] = (
            device_data.get("location").get("value").get("longitude")
        )

    # if device_data.get("batteryVoltage") is not None:
    # sql_data["battery_voltage"] = device_data.get("batteryVoltage").get("value")

    return sql_data


if __name__ == "__main__":

    # Import the dotenv to access the environmental variables
    from dotenv import load_dotenv
    import os

    load_dotenv()
    debug = os.getenv("FLASK_DEBUG")
    if str(debug) == "0":
        debug = False
    else:
        debug = True

    # Run the flask server
    app.run(host="0.0.0.0", port=5000, debug=debug)
