from typing import Any
import requests
import json


class ContextProvider:
    def __init__(self, **kwargs):
        self.url = kwargs.get("url")
        self.headers = kwargs.get("headers")
        self.payload = kwargs.get("payload")
        self.method = kwargs.get("method")
        self.build_request(url=self.url, headers=self.headers, payload=self.payload)
        self.make_request()

    def __call__(self, *args: Any, **kwds: Any) -> Any:
        return self.response

    def __str__(self) -> str:
        return self.response.text

    def __getitem__(self, key):
        return self.response_python_object.get(key)

    def set_headers(self, **headers):
        self.headers = headers

    def build_request(self, **kwargs):
        """
        Builds a request to the given url with the given headers and payload

        Args:
            url (str): The url to send the request to
            method (str): The method to use for the request
            headers (dict): The headers to send with the request
            payload (dict): The payload to send with the request

        Returns:
            requests.Response: The response from the request
        """
        if kwargs.get("url"):
            self.url = kwargs.get("url")
        if kwargs.get("headers"):
            self.headers = kwargs.get("headers")
        if kwargs.get("method"):
            self.method = kwargs.get("method")
        elif self.method is None:
            self.method = "GET"
        if kwargs.get("payload"):
            self.payload = kwargs.get("payload")

    def make_request(self):
        self.response = None
        if self.url:
            self.response = requests.request(
                url=self.url,
                method=self.method,
                headers=self.headers,
                data=self.payload,
            )
            self.get_json_response()

    def get_json_response(self):
        try:
            self.response_json = self.response.json()
            self.response_python_object = json.loads(self.response.text)
        except Exception as e:
            print(e)
            self.response_json = None
            self.response_python_object = None


if __name__ == "__main__":
    # Get the version of the orion broker
    version = ContextProvider(url="http://150.140.186.118:1026/version")
    print(version["orionld version"])

    # Get the entities
    cp = ContextProvider(
        url="http://150.140.186.118:1026/v2/entities",
        method="GET",
    )

    # Context broker get the keys to the dictionaries that the entities use
    for item in cp.response_python_object:
        # print(item.keys())
        if item.get("id") == "tracker":
            print(item)
    # print(cp.response_dict[1])

    # cp2 = ContextProvider(
    #     url="http://127.0.0.1:5000/post",
    #     # headers={"Content-Type": "application/json"},
    #     method="POST",
    #     payload={"data": "Dome", "form": "fodmt data"},
    # )
    # print(cp2.response.text)
