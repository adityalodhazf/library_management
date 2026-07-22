import csv

def read_csv(file_path):
    with open(file_path, mode="r", encoding="utf-8", newline="") as file:
        reader = csv.DictReader(file)
        rows = list(reader)
        for row in rows:
            print(row['title'])  # row is a dict

read_csv("books.csv")