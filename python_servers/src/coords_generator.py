import random
import csv

def generate_coordinates(min_x, max_x, min_y, max_y, num_sets):
    '''Generates a list of random coordinates within the given ranges.
    Args:
        min_x (float): the minimum x value
        max_x (float): the maximum x value
        min_y (float): the minimum y value
        max_y (float): the maximum y value
        num_sets (int): the number of coordinates to generate
    Returns:
        list: a list of (x, y) tuples representing the coordinates
        '''
    coordinates = []
    for _ in range(num_sets):
        x = random.uniform(min_x, max_x)
        y = random.uniform(min_y, max_y)
        coordinates.append((x, y))
    return coordinates

def write_to_csv(filename, coordinates):
    '''Writes the given coordinates to a csv file.
    Args:
        filename (str): the name of the csv file
        coordinates (list): a list of (x, y) tuples representing the coordinates
    '''
    with open(filename, 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(['Latitude', 'Longitude'])
        num = random.randint(40, 50)
        for _ in range(num):
            writer.writerow(coordinates.pop(0))

def main():
    '''Generates 10 csv files with random coordinates within the given ranges.
    
    The ranges are:     
    min_x = 38.20
    max_x = 38.21
    min_y = 21.81
    max_y = 21.85
    num_sets = 60

    The csv files are named Path_1.csv, Path_2.csv, ..., Path_10.csv
    '''
    min_x = 38.20
    max_x = 38.21
    min_y = 21.81
    max_y = 21.85
    num_sets = 60

    for i in range(10):

        # Generate the coordinates
        coordinates = generate_coordinates(min_x, max_x, min_y, max_y, num_sets)

        # Order the coordinates by x and then by y
        coordinates.sort()
        coordinates.sort(key=lambda coord: coord[1])

        # Write the coordinates to a csv file
        # Nikola, Change the name of the file to point to whichever directory you want to save the files
        filename = f'Path_{i+1}.csv'
        write_to_csv(filename, coordinates)
        print(f'Wrote {filename}')

        # Increase the ranges for the next file
        min_x += 0.01
        max_x += 0.01
        # min_y += 0.01
        # max_y += 0.01

if __name__ == '__main__':
    main()

    