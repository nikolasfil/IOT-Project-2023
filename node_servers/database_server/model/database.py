import sqlite3 as sq
import sys
import codecs
import bcrypt
from pathlib import Path


# https://www.tutorialspoint.com/sqlite/sqlite_python.htm

# database='../dbdesigner/database-data'
# needs to run in the Program Folder

# https://www.googleapis.com/books/v1/volumes?q=title:python


class Database:
    def __init__(self, database, sqlfile):
        database = self.path_to_file(database)
        sqlfile = self.path_to_file(sqlfile)

        try:
            self.conn = sq.connect(database)
            self.sqlfile = sqlfile
            self.salt = bcrypt.gensalt()

        except Exception as e:
            print(e)
            sys.exit()

    def create_database(self):
        """Creates the database from the sql file"""

        sql = codecs.open(self.sqlfile, "r", encoding="utf-8-sig").read()
        self.conn.executescript(sql)

        # saves the table names
        self.table_names = [
            table_name[0]
            for table_name in self.conn.execute(
                'SELECT name FROM sqlite_master WHERE type="table"'
            ).fetchall()
        ]

        # saves the table columns
        self.tables = {
            table_name: [
                column[1]
                for column in self.conn.execute(f"PRAGMA table_info({table_name})")
            ]
            for table_name in self.table_names
        }

    def clearing(self, tablename: str):
        """clears the specific tablename from the values, but does not delete the columns"""
        self.conn.execute(f"DELETE FROM {tablename}")
        self.conn.commit()

    def clear_all(self):
        """clears all tables"""
        for table in self.table_names:
            self.clearing(table)

    def binary_to_string(self, string):
        """converts binary to string"""
        return f"{str(string)[2:-1]}"

    def insert_data(self, table_name, data):
        command = f"""INSERT INTO {table_name}({','.join(self.tables[table_name])}) VALUES ({','.join(['?' for i in range(len(data))])})"""
        try:
            self.conn.execute(command, data)

            self.conn.commit()
        except Exception as e:
            print(e)
            print(command)
            print(data)

    def hashing_password(self, password):
        """hashes the password"""
        return self.binary_to_string(bcrypt.hashpw(password.encode("utf-8"), self.salt))

    def main(self):
        """main function"""
        self.create_database()
        self.fill_database()
        self.conn.close()

    def fill_database(self):
        pass

    def path_to_file(self, filename):
        """returns the path to the file"""
        return Path(__file__).parent / filename

    def select(self, command):
        try:
            return self.conn.execute(command).fetchall()
        except Exception as e:
            print(e)
            print(command)
            return None
