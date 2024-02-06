from context_provider import ContextProvider


class SensorCP(ContextProvider):
    def __init__(self, **kwargs):
        """
        Description:
            Create a new entity with the given entity_data

        Args:
            entity_data (dict): The data to create the entity with
            base_url (str): The base url to send the request to
            url (str): The url to send the request to
            headers (dict): The headers to send with the request
            payload (dict): The payload to send with the request
            method (str): The method to use for the request
            entity_id (str): The id of the entity to create
            debug (bool): If True, print the response from the request
        """
        super().__init__(**kwargs)

        # Take the entity_data from the arguments if it's given
        self.entity_data = kwargs.get("entity_data")

        if self.entity_data is None:
            self.entity_data = {"id": kwargs.get("entity_id")}

        if self.entity_data.get("id") is not None:
            self.get_entity()
        # If the entity_data is given, create a new entity
        # self.new_entity(entity_data=self.entity_data)

    def new_entity(self, entity_data=None):
        """
        Description:
            Create a new entity with the given entity_data

        Args:
            entity_data (dict): The data to create the entity with

        Returns:
            None

        Assigns the result to self.response
        """

        # If the entity_data is given, assign it as Tracker attribute
        if entity_data is None:
            entity_data = self.entity_data

        if entity_data is None:
            raise ValueError("The entity_data is not given")

        # If the entity_data is given and there is a valid id, get the entity
        if entity_data.get("id"):
            # Get the entity with the given id and assigining itto the self.response
            self.get_entity(entity_data.get("id"))
            # If the response status code is 404, then the entity doesn't exist
            print(self.response.status_code)
            if self.response.status_code == 404:
                self.create_entity(entity_data=entity_data)
            elif self.response.status_code == 500:
                print("Internal Server Error")
            elif self.response.status_code == 200:
                self.delete_entity(entity_id=entity_data.get("id"))
                self.create_entity(entity_data=entity_data)
                # If the response status code is 200, then the entity exists so update the data
                # self.update_entity(
                #     entity_id=self.entity_data.get("id"), entity_data=self.entity_data
                # )
                # This still needs work
                # pass

    def create_entity(self, entity_data=None):
        """
        Description:
            Create a new entity with the given entity_data

        Args:
            entity_data (dict): The data to create the entity with

        Returns:
            None

        Assigns the result to self.response
        """

        if entity_data is None:
            # Case example for this condition is that we have deleted an entity and we want to create it again
            entity_data = self.entity_data

        if entity_data is None:
            raise ValueError("The entity_data is not given")

        self.url = f"{self.base_url}/v2/entities"
        self.headers = {"Content-Type": "application/json"}
        self.method = "POST"
        self.payload = entity_data
        self.build_request()
        self.make_request()

    def update_entity(self, entity_id=None, entity_data=None):
        """
        Description:
            Update the entity with the given id with the given entity_data

        Args:
            entity_id (str): The id of the entity to update
            entity_data (dict): The data to update the entity with

        Returns:
            None

        Assigns the result to self.response
        """

        if entity_id is None:
            entity_id = self.entity_data.get("id")

        if entity_id is None:
            raise ValueError("The entity_id is not given")

        self.url = f"{self.base_url}/v2/entities/{entity_id}/attrs"
        self.headers = {"Content-Type": "application/json"}
        self.method = "PATCH"

        # It raised an error and I tried changing some functions but it didn't work
        if entity_data.get("id"):
            del entity_data["id"]

        self.payload = entity_data

        self.build_request()
        self.make_request()

    def delete_entity(self, entity_id=None):
        """
        Description:
            Delete the entity with the given id

        Args:
            entity_id (str): The id of the entity to delete

        Returns:
            None

        Assigns the result to self.response
        """

        if entity_id is None:
            entity_id = self.entity_data.get("id")

        if entity_id is None:
            raise ValueError("The entity_id is not given")

        # Check if the entity exists
        self.get_entity(entity_id=entity_id)

        # if self.response.status_code == 404:
        #     print(f"{entity_id} Not Found")
        #     return

        self.url = f"{self.base_url}/v2/entities/{entity_id}"
        # self.headers = {"Content-Type": "application/json"}
        self.headers = None
        self.method = "DELETE"
        self.payload = None
        self.build_request()
        self.make_request()

        if self.response.ok:
            print(f" {self.entity_data.get('id')} Deleted Successfully")

    def get_entity(self, entity_id=None):
        """
        Description:
            Get the entity with the given id

        Args:
            entity_id (str): The id of the entity to get

        Returns:
            python Object: The response from the request, either a list or dictionary

        """

        if entity_id is None:
            entity_id = self.entity_data.get("id")

        if entity_id is None:
            raise ValueError("The entity_id is not given")

        self.url = f"{self.base_url}/v2/entities/{entity_id}"
        self.headers = {"Accept": "application/json"}
        self.method = "GET"
        self.payload = None
        self.build_request()
        self.make_request()
        return self.response_python_object

    def get_attribute(self, **kwargs):
        """
        Description:
            Get the attribute with the given id

        Args:
            entity_id (str): The id of the entity to get
            attribute (str): The attribute to get

        Returns:
            python Object: The response from the request, either a list or dictionary
        """
        entity_id, attribute = kwargs.get("entity_id"), kwargs.get("attribute")

        if entity_id is None:
            entity_id = self.entity_data.get("id")

        if entity_id is None:
            raise ValueError("The entity_id is not given")

        self.url = f"{self.base_url}/v2/entities/{entity_id}/attrs/{attribute}"
        self.headers = {"Accept": "application/json"}
        self.method = "GET"
        self.payload = None
        self.build_request()
        self.make_request()
        return self.response_python_object


if __name__ == "__main__":
    entity_data = {
        "id": "tracker4",
        "type": "Tracker",
        "location": {
            "type": "geo-json",
            "value": {
                "latitude": 40.7128,
                "longitude": 91.0,
            },
            "metadata": {},
        },
        "temperature": {
            "type": "Float",
            "value": 41,
            "metadata": {},
        },
    }
    # entity_data = {
    #     "id": "tracker4",
    #     "type": "Tracker",
    # }

    entity_data = {
        # "id": "digital-matter-oyster3:3",
        "id": "tracke2",
        "type": "Tracker",
        "location": {
            "type": "geo_json",
            "latitude": 38.2883084,
            "longitude": 21.7888401,
            "metadata": {},
        },
        "temperature": {"type": "Float", "value": 0, "metadata": {}},
    }

    tracker = SensorCP(
        base_url="http://150.140.186.118:1026",
        entity_data=entity_data,
        debug=True,
    )
    # print(tracker.get_entity())
    # print(tracker)
    # Delete the entity
    # tracker.delete_entity()
    # Create the entitiy
    tracker.new_entity()

    # tracked = Tracker(base_url="http://150.140.186.118:1026", entity_data=entity_data)
    # print(tracker.get_entity(entity_id="tracker1"))

    # tracker.delete_entity(entity_id="tracker1")
    # print(tracker)
    # track = SensorCP(
    #     base_url="http://150.140.186.118:1026",
    #     # entity_id="tracker4",
    # )
    # print(track.get_entity())

# Example Data
# example_data = {
#     "id": "tracker1",
#     "type": "Tracker",
#     "location": {
#         "type": "geo:json",
#         "value": {
#             "latitude": 40.7128,
#             "longitude": 90,
#         },
#         "metadata": {},
#     },
#     "temperature": {
#         "type": "Float",
#         "value": 25.5,
#         "metadata": {},
#     },
# }
