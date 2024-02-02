from context_provider import ContextProvider
import json


class Tracker(ContextProvider):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        # self.entity_id = kwargs.get("entity_id")

        # Take the entity_data from the arguments if it's given
        self.entity_data = kwargs.get("entity_data")
        # If the entity_data is given, create a new entity
        self.new_entity(entity_data=self.entity_data)

    def new_entity(self, entity_data=None):
        # If the entity_data is given, assign it as Tracker attribute
        if entity_data:
            self.entity_data = entity_data

        # If the entity_data is given and there is a valid id, get the entity
        if self.entity_data and self.entity_data.get("id"):
            # Get the entity with the given id and assigining itto the self.response
            self.get_entity(self.entity_data.get("id"))

            # If the response status code is 404, then the entity doesn't exist
            if self.response.status_code == 404:
                self.create_entity(entity_data=self.entity_data)
            else:
                # If the response status code is 200, then the entity exists so update the data
                # self.update_entity(
                #     entity_id=self.entity_data.get("id"), entity_data=self.entity_data
                # )
                # This still needs work
                pass

    def create_entity(self, entity_data):
        self.url = f"{self.base_url}/v2/entities"
        self.headers = {"Content-Type": "application/json"}
        self.method = "POST"

        self.build_request(
            url=self.url, headers=self.headers, method=self.method, payload=entity_data
        )
        self.make_request()

    def update_entity(self, entity_id, entity_data):
        self.url = f"{self.base_url}/v2/entities/{entity_id}/attrs"
        self.headers = {"Content-Type": "application/json"}
        self.method = "PATCH"
        if entity_data.get("id"):
            del entity_data["id"]
        self.payload = entity_data
        self.build_request(
            url=self.url,
            headers=self.headers,
            method=self.method,
            payload=self.payload,
        )
        self.make_request()

    def delete_entity(self, **kwargs):
        entity_id = kwargs.get("entity_id")
        if entity_id is None:
            entity_id = self.entity_data.get("id")

        if entity_id is None:
            raise ValueError("The entity_id is not given")

        self.url = f"{self.base_url}/v2/entities/{entity_id}"
        self.headers = {"Content-Type": "application/json"}
        self.method = "DELETE"
        self.build_request(
            url=self.url,
            headers=self.headers,
            method=self.method,
            payload=None,
        )
        self.make_request()

    def get_entity(self, entity_id):
        """Get the entity with the given id information"""
        self.url = f"{self.base_url}/v2/entities/{entity_id}"
        self.headers = {"Accept": "application/json"}
        self.method = "GET"
        self.build_request(
            url=self.url, headers=self.headers, method=self.method, payload=None
        )
        self.make_request()
        return self.response_python_object

    def get_attribute(self, entity_id, attribute):
        self.url = f"{self.base_url}/v2/entities/{entity_id}/attrs/{attribute}"
        self.headers = {"Accept": "application/json"}
        self.method = "GET"
        self.build_request(
            url=self.url, headers=self.headers, method=self.method, payload=None
        )
        self.make_request()
        return self.response_python_object


if __name__ == "__main__":
    entity_data = {"id": "tracker1", "type": "Tracker"}
    tracker = Tracker(base_url="http://150.140.186.118:1026", entity_data=entity_data)
    print(tracker)

    tracked = Tracker(base_url="http://150.140.186.118:1026")
    print(tracked.get_entity("tracker1"))
