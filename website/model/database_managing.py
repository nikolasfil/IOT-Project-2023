#!/bin/python3

from database import Database


class AdventureGuard(Database):
    def __init__(self, database, sqlfile):
        super().__init__(database, sqlfile)
        self.num = 100
        self.users = []
        self.devices = []
        self.assigned = []
        self.pressed = []
        self.tracked = []

    def main(self):
        """main function"""
        self.create_database()
        self.fill_database()
        self.conn.close()

    def fill_database(self):
        self.clear_all()
        self.fill_users()
        print("Filled users table")
        self.fill_device()
        print("Filled device table")
        self.fill_assigned()
        print("Filled assigned table")
        self.fill_pressed()

        self.fill_tracked()

    def fill_users(self):
        """fills the users table with data from the csv file"""
        # curl "https://api.mockaroo.com/api/72de52d0?count=1000&key=cf225740" > "users.csv"

        tableName = "USER"

        self.clearing(tableName)

        file = self.path_to_file("users.csv")
        headers = []
        with open(file, "r") as f:
            for i, line in enumerate(f):
                line = line.strip("\n").split(",")
                if i == 0:
                    headers = line[:]
                    continue
                elif i > self.num:
                    break

                data = {}
                for i, header in enumerate(headers):
                    data[header] = line[i]

                data["password"] = self.hashing_password(data["password"])
                data["salt"] = self.binary_to_string(self.salt)

                self.insert_data(
                    tableName, [data[col] for col in self.tables[tableName]]
                )
                self.users.append(data)

        print("Filled users table")

    def fill_device(self):
        """fills the device table with data from the csv file"""
        # curl "https://api.mockaroo.com/api/35a73c80?count=1000&key=cf225740" > "device.csv"

        tableName = "DEVICE"

        self.clearing(tableName)

        file = self.path_to_file("device.csv")
        headers = []
        with open(file, "r") as f:
            for i, line in enumerate(f):
                line = line.strip("\n").split(",")
                if i == 0:
                    headers = line[:]
                    continue
                elif i > self.num:
                    break

                data = {}
                for i, header in enumerate(headers):
                    data[header] = line[i]

                self.insert_data(
                    tableName, [data[col] for col in self.tables[tableName]]
                )

                self.devices.append(data)

    def fill_assigned(self):
        tableName = "Assigned"
        self.clearing(tableName)

        # user id
        # device id
        # date_received
        # date_returned

        for i in range(self.num):
            user_id = self.users[i]["id"]
            device_id = self.devices[i]["id"]
            date_received = self.random_date()
            # date_returned is after date_received
            date_returned = self.random_date(date_received)

            data = [user_id, device_id, date_received, date_returned]
            self.insert_data(tableName, data)
            self.assigned.append(data)

    def fill_pressed(self):
        pass

    def fill_tracked(self):
        pass

    def random_date(self, start="1/1/2023", end="1/1/2024"):
        """Generate a random date between two dates"""
        from datetime import datetime
        import random

        start = datetime.strptime(start, "%m/%d/%Y")
        end = datetime.strptime(end, "%m/%d/%Y")

        return start + (end - start) * random.random()


if __name__ == "__main__":
    database = "database.sqlite"
    sqlfile = "create_database.sql"
    app = AdventureGuard(database, sqlfile)
    app.main()
