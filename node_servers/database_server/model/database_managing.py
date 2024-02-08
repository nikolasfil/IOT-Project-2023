#!/bin/python3

from database import Database
import random
from datetime import datetime, timedelta


class AdventureGuard(Database):
    def __init__(self, database, sqlfile):
        """
        Description:
            Initializes the AdventureGuard class. It inherits the Database class from the file database.py

        Args:
            database (str): the path to the database file to connect
            sqlfile (str): the path to the sql file to create the database
        """
        super().__init__(database, sqlfile)

        # Number of results to add in the database from the csv
        self.num = 100

        # List of users, devices, assigned, pressed and tracked
        self.users = []
        self.devices = []
        self.assigned = []
        self.pressed = []
        self.tracked = []

    def fill_database(self):
        """
        Description:
            Fills the database with data from the csv files after it clears the datbase.
        """

        self.clear_all()

        # self.fill_users()
        print("Filled users table")

        # self.fill_device()
        print("Filled device table")

        # self.fill_assigned()
        print("Filled assigned table")

        self.fill_pressed()
        # print("Filled pressed table")

        self.fill_tracked()
        # print("Filled tracked table")

    def fill_users(self):
        """
        Description :
            fills the users table with data from the csv file

        """

        # created by mockaroo
        # curl "https://api.mockaroo.com/api/72de52d0?count=1000&key=cf225740" > "users.csv"

        tableName = "USER"

        self.clearing(tableName)

        file = self.path_to_file("data/users.csv")

        headers = []
        with open(file, "r") as f:
            for i, line in enumerate(f):
                line = line.strip("\n").split(",")
                if i == 0:
                    headers = line[:]
                    continue
                elif i > self.num:
                    # it exceeded the number of results we wanted to add
                    break

                data = {}
                for i, header in enumerate(headers):
                    data[header] = line[i]

                data["password"] = self.hashing_password(data["password"])
                data["salt"] = self.binary_to_string(self.salt)

                self.insert_data(
                    tableName, [data[col] for col in self.tables[tableName]]
                )

    def fill_device(self):
        """fills the device table with data from the csv file"""
        # curl "https://api.mockaroo.com/api/35a73c80?count=1000&key=cf225740" > "device.csv"

        tableName = "DEVICE"

        self.clearing(tableName)

        file = self.path_to_file("data/device.csv")
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

    def fill_assigned(self):
        tableName = "Assigned"
        self.clearing(tableName)

        count_active = self.select(
            "SELECT COUNT(*) FROM DEVICE WHERE status = 'active'"
        )
        if count_active:
            count_active = count_active[0][0]
        else:
            count_active = 0
        num = min(self.num, count_active)
        for i in range(num):
            # user_id = random.choice(available_users)
            # device_id = random.choice(available_devices)
            user_id = self.select(
                "SELECT DISTINCT u_id FROM USER WHERE u_id NOT IN (SELECT user_id FROM Assigned)"
            )
            device_id = self.select(
                "SELECT DISTINCT d_id FROM DEVICE WHERE d_id NOT IN (SELECT device_id FROM Assigned) and status = 'active'"
            )
            date_received = self.random_date()
            date_returned = self.random_date(date_received)

            if not user_id or not device_id:
                continue
            data = [user_id[0][0], device_id[0][0], date_received, date_returned]

            # self.assigned.append(data)
            self.insert_data(tableName, data)

    def fill_pressed(self):
        pass

    def fill_tracked(self):
        pass

    def random_date(self, start=None):
        """Generate a random date, later than the provided start date if given."""
        if start:
            start_date = datetime.strptime(start, "%d/%m/%Y")
        else:
            start_date = datetime.now()

        # Generate a random number of days to add
        random_days = random.randint(1, 3)  # Adjust the range as needed

        # Calculate the new date
        new_date = start_date + timedelta(days=random_days)

        return new_date.strftime("%d/%m/%Y")


if __name__ == "__main__":
    database = "database.sqlite"
    sqlfile = "create_database.sql"
    app = AdventureGuard(database, sqlfile)

    app.main()
