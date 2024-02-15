import random
import csv


class CoordsGenerator:
    def __init__(self, **kwargs) -> None:
        """
        Description:
            Initializes the CoordsGenerator object.

        Args:
            min_x (float): the minimum x value
            max_x (float): the maximum x value
            min_y (float): the minimum y value
            max_y (float): the maximum y value
            num_sets (int): the number of coordinates to generate
        """
        self.min_x = kwargs.get("min_x", 38.20)
        self.max_x = kwargs.get("max_x", 38.21)
        self.min_y = kwargs.get("min_y", 21.81)
        self.max_y = kwargs.get("max_y", 21.85)
        self.num_sets = kwargs.get("num_sets", 60)
        self.coordinates = []

    def generate_coordinates(self, **kwargs):
        """
        Description :
            Generates a list of random coordinates within the given ranges.
        Args:
            min_x (float): the minimum x value
            max_x (float): the maximum x value
            min_y (float): the minimum y value
            max_y (float): the maximum y value
            num_sets (int): the number of coordinates to generate
        Returns:
            list: a list of (x, y) tuples representing the coordinates
        """

        min_x = kwargs.get("min_x")
        if min_x is None:
            min_x = self.min_x
        max_x = kwargs.get("max_x")
        if max_x is None:
            max_x = self.max_x
        min_y = kwargs.get("min_y")
        if min_y is None:
            min_y = self.min_y
        max_y = kwargs.get("max_y")
        if max_y is None:
            max_y = self.max_y
        num_sets = kwargs.get("num_sets")
        if num_sets is None:
            num_sets = 60

        for _ in range(num_sets):
            x = random.uniform(min_x, max_x)
            y = random.uniform(min_y, max_y)
            self.coordinates.append((x, y))
        return self.coordinates

    def write_to_csv(self, filename, coordinates):
        """
        Description:
            Writes the given coordinates to a csv file.
        Args:
            filename (str): the name of the csv file
            coordinates (list): a list of (x, y) tuples representing the coordinates
        """
        with open(filename, "w", newline="") as file:
            writer = csv.writer(file)
            writer.writerow(["latitude", "longitude"])
            num = random.randint(40, 50)
            for _ in range(num):
                writer.writerow(coordinates.pop(0))

    def sort_coordinates(self, **kwargs):
        """
        Description:
            Sorts the given coordinates by x and then by y.
        Args:
            coordinates (list): a list of (x, y) tuples representing the coordinates
        Returns:
            list: the sorted coordinates
        """

        coordinates = kwargs.get("coordinates")
        if coordinates is None:
            coordinates = self.coordinates

        coordinates.sort()
        coordinates.sort(key=lambda coord: coord[1])

        if kwargs.get("coordinates") is None:
            self.coordinates = coordinates

        return coordinates

    def main(self):
        for i in range(self.num_sets):
            self.generate_coordinates()
        self.sort_coordinates()

    def example_generate(self):
        """
        Description:
            Generates 10 csv files with random coordinates within the given ranges.

        The ranges are:
        min_x = 38.20
        max_x = 38.21
        min_y = 21.81
        max_y = 21.85
        num_sets = 60

        The csv files are named Path_1.csv, Path_2.csv, ..., Path_10.csv
        """
        min_x = 38.20
        max_x = 38.21
        min_y = 21.81
        max_y = 21.85
        num_sets = 60

        for i in range(10):

            # Generate the coordinates
            coordinates = self.generate_coordinates(
                min_x, max_x, min_y, max_y, num_sets
            )

            # Order the coordinates by x and then by y
            coordinates.sort()
            coordinates.sort(key=lambda coord: coord[1])

            # Write the coordinates to a csv file
            # Nikola, Change the name of the file to point to whichever directory you want to save the files
            filename = f"Path_{i+1}.csv"
            self.write_to_csv(filename, coordinates)
            print(f"Wrote {filename}")

            # Increase the ranges for the next file
            min_x += 0.01
            max_x += 0.01
            # min_y += 0.01
            # max_y += 0.01


if __name__ == "__main__":
    generator = CoordsGenerator()
    # generator.example_generate()
    # generator.main()

    thousand = CoordsGenerator(num_sets=1000)
    thousand.main()
    print(thousand.coordinates)
