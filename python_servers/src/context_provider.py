from typing import Any
import requests
import json
from dotenv import load_dotenv
import os


class ContextProvider:
    def __init__(self, **kwargs):
        """
        Description:
            Create a new ContextProvider object

        Args:
            base_url (str): The base url to send the request to
            url (str): The url to send the request to
            headers (dict): The headers to send with the request
            payload (dict): The payload to send with the request
            method (str): The method to use for the request
        """
        self.base_url = kwargs.get("base_url")
        if self.base_url is None:
            load_dotenv()
            self.base_url = os.getenv("CPURL")
        self.url = kwargs.get("url")
        self.headers = kwargs.get("headers")
        self.payload = kwargs.get("payload")
        self.method = kwargs.get("method")
        self.debug = kwargs.get("debug")
        self.response = None
        self.response_json = None
        self.response_python_object = None
        if kwargs.get("automated") is True:
            self.build_request(url=self.url, headers=self.headers, payload=self.payload)
            self.make_request()

    def __call__(self, *args: Any, **kwds: Any) -> Any:
        """
        Description:
            Returns the response from the request when the instance is called

        Returns:
            requests.Response: The response from the request
        """
        return self.response

    def __str__(self) -> str:
        """
        Description:
            It is called when the instanse is called as a string

        Returns:
            str: The response from the request as a string
        """
        if self.response is not None and self.response.text:
            return self.response.text
        return "No response"

    def __getitem__(self, key):
        """
        Description:
            Is called when the instance is called with as a dictionary with a key
        Returns:
            Python object: value of the dictionary given a key
        """
        return self.response_python_object.get(key)

    def set_headers(self, **headers) -> None:
        """
        Description:
            Set the headers to the given headers
        """
        self.headers = headers

    def build_request(self, **kwargs) -> None:
        """
        Description:
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
        if self.method is None:
            self.method = "GET"
        if kwargs.get("payload"):
            self.payload = kwargs.get("payload")
        if self.payload is not None and type(self.payload) is dict:
            self.payload = json.dumps(self.payload)
        elif self.payload is not None and self.is_json(self.payload) is False:
            self.payload = json.loads(self.payload)
        # elif self.payload is not None and self.is_json(self.payload) is True:

    def make_request(self) -> None:
        """
        Description:
            Makes the request to the given url with the given headers, method and payload
        """
        self.response = None
        if self.url:
            try:
                self.response = requests.request(
                    url=self.url,
                    method=self.method,
                    headers=self.headers,
                    data=self.payload,
                )
            except Exception as e:
                if self.debug:
                    print(e)
                return False

            # Check if the response status is ok
            if self.response.ok is False:
                if self.debug:
                    print(self.payload)
                    print(f"Error: {self.response.status_code}")
                    print(self.response.text)
                return False
            self.get_json_response()
            return True

        return False

    def get_json_response(self) -> None:
        """
        Description:
            Get the json response from the request

        """

        try:
            self.response_json = self.response.json()
            # self.response_json = json.loads(self.response.text)
            self.response_python_object = json.loads(self.response.text)
        except Exception as e:
            self.response_json = None
            self.response_python_object = None

    def is_json(self, object):
        """Checks if a given object is a json object    

        Args:
            object (python Object): The object to check if it is a json object

        Returns:
            bool: True if the object is a json object, False if it is not 
        """ """"""
        try:
            json.loads(object)
        except ValueError:
            return False
        return True


if __name__ == "__main__":
    # Get the version of the orion broker
    version = ContextProvider(url="http://150.140.186.118:1026/version", automated=True)
    print(version["orionld version"])

    # id?type=

    url = f"http://150.140.186.118:1026/v2/entities" + "?type=Buttons"
    url = f"http://150.140.186.118:1026/v2/entities" + "?type=tracker"
    # Get the entities
    cp = ContextProvider(
        url=url,
        headers={"Accept": "application/json"},
        method="GET",
        automated=True,
    )

    # Context broker get the keys to the dictionaries that the entities use
    for item in cp.response_python_object:
        print(list(item.keys()))
    # print(cp.response_dict[1])

    # cp2 = ContextProvider(
    #     url="http://127.0.0.1:5000/post",
    #     # headers={"Content-Type": "application/json"},
    #     method="POST",
    #     payload={"data": "Dome", "form": "fodmt data"},
    # )
    # print(cp2.response.text)
