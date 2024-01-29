from flask import Flask, request

app = Flask(__name__)


@app.route("/")
def home():
    html = "<p>Hello World!</p>"
    return html


@app.route("/about", methods=["GET", "POST"])
def about():
    html = "<p>About</p>"
    if request.method == "POST":
        html += "<p>POST</p>"
    return html


@app.get("/get")
def get():
    return "<p>GET</p>"


# url_for('static', filename='style.css')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
