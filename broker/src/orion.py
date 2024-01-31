import requests


class Orion:
    def __init__(self) -> None:
        self.host = "150.140.186.118"
        self.port = "1026"

    def send_data_to_orion(self, data):
        # url = f"http://{self.host}:{self.port}/v2/entities"
        url = f"http://{self.host}:{self.port}/v2/entities"
        headers = {"Content-Type": "application/json"}

        try:
            response = requests.post(url, json=data, headers=headers)
            response.raise_for_status()
            print("Data sent to Orion successfully!")
        except requests.exceptions.HTTPError as errh:
            print(f"HTTP Error: {errh}")
        except requests.exceptions.ConnectionError as errc:
            print(f"Error Connecting: {errc}")
        except requests.exceptions.Timeout as errt:
            print(f"Timeout Error: {errt}")
        except requests.exceptions.RequestException as err:
            print(f"Request Error: {err}")

    def main(self):
        # Example data to be sent to Orion
        sample_data = {
            "id": "entity_id",
            "type": "Entity",
            "temperature": {"value": 25.0, "type": "Float"},
        }

        self.send_data_to_orion(sample_data)


if __name__ == "__main__":
    orion = Orion()
    orion.main()
