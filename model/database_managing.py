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


if __name__ == "__main__":
    database = "database.sqlite"
    sqlfile = "create_database.sql"
    app = AdventureGuard(database, sqlfile)
    app.main()
