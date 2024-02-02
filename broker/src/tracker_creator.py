from context_provider import ContextProvider
import json


class Tracker(ContextProvider):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        self.entity_data = kwargs.get("entity_data")
        # self.create_entity(entity_data=self.entity_data)
        self.new_entity(entity_data=self.entity_data)

    def new_entity(self, entity_data=None):
        if entity_data:
            self.entity_data = entity_data

        if self.entity_data and self.entity_data.get("id"):
            self.get_entity(self.entity_data.get("id"))

            if self.response.status_code == 404:
                self.create_entity(entity_data=self.entity_data)
            else:
                self.update_entity(
                    entity_id=self.entity_data.get("id"), entity_data=self.entity_data
                )

    def create_entity(self, entity_data):
        self.url = f"{self.base_url}/v2/entities"
        self.headers = {"Content-Type": "application/json"}
        self.method = "POST"
        # print(entity_data)

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

    def delete_entity(self, entity_id):
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
