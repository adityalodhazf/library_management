import re

def is_valid_isbn(isbn):
    # Remove hyphens and spaces
    isbn = re.sub(r'[\s-]', '', isbn)

    # ISBN-10 validation
    if len(isbn) == 10:
        if not re.match(r'^\d{9}[\dX]$', isbn):
            return False

        total = sum((10 - i) * (10 if ch == 'X' else int(ch))
                    for i, ch in enumerate(isbn))

        return total % 11 == 0

    # ISBN-13 validation
    elif len(isbn) == 13:
        if not isbn.isdigit():
            return False

        total = sum(
            int(digit) * (1 if i % 2 == 0 else 3)
            for i, digit in enumerate(isbn[:-1])
        )

        check_digit = (10 - (total % 10)) % 10

        return check_digit == int(isbn[-1])

    return False


def test():
    # Example usage
    test_isbns = [
        "0-306-40615-2",    # Valid ISBN-10
        "0306406152",       # Valid ISBN-10
        "9780306406157",    # Valid ISBN-13
        "978-0-306-40615-7",# Valid ISBN-13
        "1234567890"        # Invalid
    ]

    for isbn in test_isbns:
        print(f"{isbn}: {is_valid_isbn(isbn)}")


if __name__ == "__main__":
    test()