import sqlite3 as sq
import sys
import codecs
import bcrypt
from pathlib import Path

# https://www.tutorialspoint.com/sqlite/sqlite_python.htm


class Database:
    def __init__(self, database, sqlfile):
        """
        Description:
            Initializes the database
        Args:
            database: str: the path to the database
            sqlfile: str: the path to the sql file

        """

        # Get the correct path
        database = self.path_to_file(database)
        sqlfile = self.path_to_file(sqlfile)

        try:
            # Connect to the database
            self.conn = sq.connect(database)
            self.sqlfile = sqlfile
            self.salt = bcrypt.gensalt()

        except Exception as e:
            print(e)
            sys.exit()

    def create_database(self):
        """
        Description:
            Creates the database from the sql file. It opens it and exceutes the sql commands
        """

        sql = codecs.open(self.sqlfile, "r", encoding="utf-8-sig").read()
        self.conn.executescript(sql)

        # saves the table names

        self.get_table_names()

        # saves the table columns
        self.get_table_columns()

    def get_table_names(self):
        """
        Description:
            Executes an sql command in the database to retrieve the names of all the tables
            It saves the names of the tables in the table_names attribute

        Returns:
            list: the names of the tables in the database
        """
        self.table_names = [
            table_name[0]
            for table_name in self.conn.execute(
                'SELECT name FROM sqlite_master WHERE type="table"'
            ).fetchall()
        ]
        return self.table_names

    def get_table_columns(self):
        """
        Description:
            Executes an sql command in the database to retrieve the columns of all the tables
            It saves the columns of the tables in the tables attribute

        Returns:
            dict: the names of the tables in the database
        """

        self.tables = {
            table_name: [
                column[1]
                for column in self.conn.execute(f"PRAGMA table_info({table_name})")
            ]
            for table_name in self.table_names
        }

        # Alternative way to get the columns

        # self.tables = {}
        # for table_name in self.table_names:
        #     self.tables[table_name] = [
        #         column[1]
        #         for column in self.conn.execute(
        #             f"PRAGMA table_info({table_name})"
        #         ).fetchall()
        #     ]

        return self.tables

    def clearing(self, tablename: str):
        """
        Description:
            clears the specific tablename from the values, but does not delete the columns

        Args:
            tablename: str: the name of the table to be cleared
        """

        self.conn.execute(f"DELETE FROM {tablename}")
        self.conn.commit()

    def clear_all(self):
        """
        Description:
            clears all tables
        """

        for table in self.table_names:
            self.clearing(table)

    def binary_to_string(self, string):
        """
        Description:
            converts binary to string
        Args:
            string: str: the binary string
        Returns:
            str: the string
        """

        return f"{str(string)[2:-1]}"

    def insert_data(self, table_name, data):
        """
        Description:
            inserts data into the table. It uses the table_name and the data to insert the data into the table, and comletes the columns automatically
            The data must be in the correct order

        Args:
            table_name: str: the name of the table
            data: list: the data to be inserted
        """

        command = f"""INSERT INTO {table_name}({','.join(self.tables[table_name])}) VALUES ({','.join(['?' for i in range(len(data))])})"""
        try:
            self.conn.execute(command, data)

            self.conn.commit()
        except Exception as e:
            print(e)
            print(command)
            print(data)

    def hashing_password(self, password):
        """
        Description:
            hashes the password using the bcrypt library
        Args:
            password: str: the password to be hashed
        Returns:
            str: the hashed password
        """
        return self.binary_to_string(bcrypt.hashpw(password.encode("utf-8"), self.salt))

    def main(self):
        """
        Description:
            main function. It is responsible for creating the database, filling it with data and closing the connection to the database after that
        """
        self.create_database()
        self.fill_database()
        self.conn.close()

    def fill_database(self):
        """
        Description:
            fills the database with data
        """
        pass

    def fill_table(
        self,
        tableName: str,
        path_to_file: str,
        function=None,
        extra_data: dict = {},
    ):

        self.clearing(tableName)

        file = self.path_to_file(path_to_file)

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

                if extra_data:
                    data.update(extra_data)

                if function:
                    data = function(data)

                self.insert_data(
                    tableName, [data[col] for col in self.tables[tableName]]
                )

    def path_to_file(self, filename):
        """returns the path to the file"""
        parent_folder = Path(__file__).parent
        parent_folder = parent_folder.parent

        if type(filename) == Path:
            return filename
        elif type(filename) == str:
            finalPath = Path(parent_folder, filename)
        elif type(filename) == list:
            finalPath = Path(parent_folder, *filename)
        return finalPath

    def select(self, command, fetchall=True):
        """
        Descrition:
            Executes a pure sql select command on the database

        Args:
            command (str): The sql command to be executed

        Returns:
            list: The result of the sql command
        """
        try:
            if fetchall:
                return self.conn.execute(command).fetchall()
            else:
                return self.conn.execute(command).fetchone()
        except Exception as e:
            print(e)
            print(command)
            return None
