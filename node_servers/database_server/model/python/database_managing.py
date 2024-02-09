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
        # print("Filled users table")

        self.fill_device()
        print("Filled device table")

        self.fill_assigned()
        print("Filled assigned table")

        self.fill_pressed()
        print("Filled pressed table")

        self.fill_tracked()
        print("Filled tracked table")

    def fill_users(self):
        """
        Description :
            fills the users table with data from the csv file

        """

        # created by mockaroo
        # curl "https://api.mockaroo.com/api/72de52d0?count=1000&key=cf225740" > "users.csv"

        tableName = "USER"
        file = ["data", "users.csv"]
        self.fill_table(
            tableName=tableName,
            path_to_file=file,
            function=self.fill_user_password,
        )

    def fill_user_password(self, data):
        data["password"] = self.hashing_password(data["password"])
        data["salt"] = self.binary_to_string(self.salt)
        return data

    def fill_device(self):
        """fills the device table with data from the csv file"""
        # curl "https://api.mockaroo.com/api/35a73c80?count=1000&key=cf225740" > "device.csv"

        tableName = "DEVICE"
        file = ["data", "device.csv"]
        self.tracker_count = 0
        self.button_count = 0
        self.fill_table(
            tableName=tableName, path_to_file=file, function=self.fill_type_device
        )

    def fill_type_device(self, data):
        """
        Description:
            Will take the data that is computed from the line of device.csv file, but will be chaning the serial number on it

        Args:
            data (dict): The data that is computed from the line of device.csv file

        Returns:
            dict: The data that is computed from the line of device.csv file, but with changed serial number
        """

        if data["type"] == "Asset tracking":
            self.tracker_count += 1
            data["serial"] = f"digital-matter-oyster3:{self.tracker_count}"
        elif data["type"] == "Buttons":
            self.button_count += 1
            data["serial"] = f"mclimate-multipurpose-button:{self.button_count}"
            

        return data

    def fill_assigned(self):

        tableName = "Assigned"
        self.clearing(tableName)

        count_active = self.select(
            "SELECT COUNT(*) FROM DEVICE WHERE status = 'active'", False
        )

        if count_active:
            count_active = count_active[0]
        else:
            count_active = 0
        num = min(self.num, count_active)

        # To ensure that the number of assigned devices is less than the number of active devices or our desired number
        for i in range(num):

            tracker_id = self.select(
                "SELECT DISTINCT d_id FROM DEVICE WHERE d_id NOT IN (SELECT device_id FROM Assigned) and status = 'active' and type='tracker' LIMIT 1 ",
                fetchall=False,
            )

            button_id = self.select(
                "SELECT DISTINCT d_id FROM DEVICE WHERE d_id NOT IN (SELECT device_id FROM Assigned) and status = 'active' and type='button'",
                fetchall=False,
            )

            if not tracker_id or not button_id:
                # Added this to avoid useless iterations
                # This means there are no more devices to assign
                break
                # continue

            user_id = self.select(
                "SELECT DISTINCT u_id FROM USER WHERE u_id NOT IN (SELECT user_id FROM Assigned)",
                fetchall=False,
            )

            if not user_id:
                break
                # continue

            # Creating the random dates
            date_received = self.random_date()
            date_returned = self.random_date(date_received)

            data_tracker = [user_id[0], tracker_id[0], date_received, date_returned]
            data_button = [user_id[0], button_id[0], date_received, date_returned]

            # print(data_tracker, data_button)
            # Insert the data in the table
            self.insert_data(tableName, data_tracker)
            self.insert_data(tableName, data_button)

    def fill_pressed(self):
        pass

    def fill_tracked(self):
        pass

    def random_date(self, start=None, num_days=None):
        """Generate a random date, later than the provided start date if given."""
        if start:
            start_date = datetime.strptime(start, "%d/%m/%Y")
        else:
            start_date = datetime.now()

        if num_days is None:
            # Generate a random number of days to add
            random_days = random.randint(1, 3)  # Adjust the range as needed

        # Calculate the new date
        new_date = start_date + timedelta(days=random_days)

        return new_date.strftime("%d/%m/%Y")


if __name__ == "__main__":
    database = "database.sqlite"
    sqlfile = ["sql", "create_database.sql"]
    app = AdventureGuard(database, sqlfile)

    app.main()
