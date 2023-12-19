#!/bin/python3

from database import Database


class AdventureGuard(Database):
    def __init__(self, database, sqlfile):
        super().__init__(database, sqlfile)

    def main(self):
        """main function"""
        self.create_database()
        self.fill_database()
        self.conn.close()

    def fill_database(self):
        self.clear_all()
        self.fill_users()

    def fill_users(self):
        """fills the users table with data from the csv file"""
        # curl "https://api.mockaroo.com/api/72de52d0?count=1000&key=cf225740" > "users.csv"

        tableName = "USER"

        self.clearing(tableName)

        file = self.path_to_file("users.csv")
        num_users = 100
        headers = []
        with open(file, "r") as f:
            for i, line in enumerate(f):
                line = line.strip("\n").split(",")
                if i == 0:
                    headers = line[:]
                    continue
                elif i > num_users:
                    break

                data = {}
                for i, header in enumerate(headers):
                    data[header] = line[i]

                data["password"] = self.hashing_password(data["password"])
                data["salt"] = self.binary_to_string(self.salt)

                self.insert_data(
                    tableName, [data[col] for col in self.tables[tableName]]
                )


if __name__ == "__main__":
    database = "database.sqlite"
    sqlfile = "create_database.sql"
    app = AdventureGuard(database, sqlfile)
    app.main()
