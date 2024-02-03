from flask import Flask, request, jsonify
import requests
import json

app = Flask(__name__)


@app.route("/")
def home():
    url = "http://150.140.186.118:1026/version"
    response = requests.get(url)
    data = {"message": "Hello World!"}
    data = jsonify(data)
    data = response.text
    return data


@app.route("/about", methods=["GET", "POST"])
def about():
    html = "<p>About</p>"
    if request.method == "POST":
        html += "<p>POST</p>"
    return html


@app.get("/get")
def get():
    return "<p>GET</p>"


@app.post("/post")
def post():
    if request.is_json:
        print(request.json)
    d = {
        "message": "POST",
        "data": "Dome",
        "form": "fodmt data",
        "request_data": request.data if request.data else None,
    }
    # turn the dict into a json string
    data = json.dumps(d)
    return data


# url_for('static', filename='style.css')

if __name__ == "__main__":
    # app.run(host="0.0.0.0", port=5000, debug=True)
    app.run(host="0.0.0.0", port=5000, debug=True)
