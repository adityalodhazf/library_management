from core.db_mgmt import DBManager
from sqlalchemy import text


class CreateDBTables():
    """
    class to create tables of the DB if not present
    """

    def _execute_query(self, query):
        res = None
        try:
            db = DBManager()
            session = db.get_session()
            res = session.execute(text(query))
            session.commit()
        except Exception as e:
            print(f"Exception in _execute_query: {repr(e)}")
        finally:
            db.session_factory.remove()

        return res

    # book realted tables
    def create_books(self):
        try:
            query = """
                        CREATE TABLE IF NOT EXISTS books (
                            book_id SERIAL PRIMARY KEY,
                            title VARCHAR(100) NOT NULL,
                            isbn VARCHAR(15),
                            genere VARCHAR(50),
                            publisher VARCHAR(100),
                            publication_date TIMESTAMPTZ,
                            fine_per_day INT DEFAULT 0,

                            CONSTRAINT uq_title
                                UNIQUE(title)
                        );
                    """
            res = self._execute_query(query=query)
            print(f"create_books response: {res}")
        except Exception as e:
            print(f"create_books Exception: {repr(e)}")

    def create_authors(self):
        try:
            query = """
                        CREATE TABLE IF NOT EXISTS authors (
                            author_id SERIAL PRIMARY KEY,
                            first_name VARCHAR(100) NOT NULL,
                            last_name VARCHAR(100),

                            CONSTRAINT uq_author_name
                                UNIQUE(first_name, last_name)
                        );
                    """
            res = self._execute_query(query=query)
            print(f"create_authors response: {res}")
        except Exception as e:
            print(f"create_authors Exception: {repr(e)}")

    def create_book_authors(self):
        try:
            query = """
                        CREATE TABLE IF NOT EXISTS book_authors (
                            book_id INTEGER,
                            author_id INTEGER,

                            CONSTRAINT fk_book
                                FOREIGN KEY (book_id)
                                REFERENCES books(book_id)
                                ON UPDATE CASCADE
                                ON DELETE RESTRICT,

                            CONSTRAINT fk_author
                                FOREIGN KEY (author_id)
                                REFERENCES authors(author_id)
                                ON UPDATE CASCADE
                                ON DELETE RESTRICT,
                            
                            CONSTRAINT uq_book_author
                                UNIQUE(book_id, author_id)
                        );
                    """
            res = self._execute_query(query=query)
            print(f"create_book_authors response: {res}")
        except Exception as e:
            print(f"create_book_authors Exception: {repr(e)}")

    def create_book_inventory(self):
        try:
            query = """
                        CREATE TABLE IF NOT EXISTS book_inventory (
                            book_id INTEGER NOT NULL,
                            branch_id INTEGER NOT NULL,
                            total_count INTEGER NOT NULL,
                            available_count INTEGER,

                            CONSTRAINT fk_book
                                FOREIGN KEY (book_id)
                                REFERENCES books(book_id)
                                ON UPDATE CASCADE
                                ON DELETE RESTRICT,

                            CONSTRAINT fk_branch
                                FOREIGN KEY (branch_id)
                                REFERENCES branches(branch_id)
                                ON UPDATE CASCADE
                                ON DELETE RESTRICT
                        );
                    """
            res = self._execute_query(query=query)
            print(f"create_book_inventory response: {res}")
        except Exception as e:
            print(f"create_book_inventory Exception: {repr(e)}")

    # member related tables
    def create_members(self):
        try:
            query = """
                        CREATE TABLE IF NOT EXISTS members (
                            member_id SERIAL PRIMARY KEY,
                            branch_id INTEGER,
                            first_name VARCHAR(100) NOT NULL,
                            last_name VARCHAR(100),
                            username VARCHAR(50),
                            password VARCHAR(100),
                            address TEXT,
                            mobile_number VARCHAR(10),
                            email TEXT,
                            joining_date TIMESTAMPTZ,
                            is_active BOOLEAN DEFAULT TRUE,

                            CONSTRAINT uq_member
                                UNIQUE(first_name, last_name, mobile_number),

                            CONSTRAINT uq_mobile_number
                                UNIQUE(mobile_number)
                        );
                    """
            res = self._execute_query(query=query)
            print(f"create_members response: {res}")
        except Exception as e:
            print(f"create_members Exception: {repr(e)}")

    def create_transactions(self):
        try:
            query = """
                        CREATE TABLE IF NOT EXISTS transactions (
                            transaction_id SERIAL PRIMARY KEY,
                            book_id INTEGER NOT NULL,
                            member_id INTEGER NOT NULL,
                            issued_branch_id INTEGER NOT NULL,
                            returned_branch_id INTEGER,
                            issue_date TIMESTAMPTZ NOT NULL,
                            return_date TIMESTAMPTZ,
                            is_returned BOOLEAN,
                            fine INTEGER DEFAULT 0,

                            CONSTRAINT fk_book
                                FOREIGN KEY (book_id)
                                REFERENCES books(book_id)
                                ON UPDATE CASCADE
                                ON DELETE RESTRICT,

                            CONSTRAINT fk_member
                                FOREIGN KEY (member_id)
                                REFERENCES members(member_id)
                                ON UPDATE CASCADE
                                ON DELETE RESTRICT,

                            CONSTRAINT fk_issued_branch
                                FOREIGN KEY (issued_branch_id)
                                REFERENCES branches(branch_id)
                                ON UPDATE CASCADE
                                ON DELETE RESTRICT,

                            CONSTRAINT fk_returned_branch
                                FOREIGN KEY (returned_branch_id)
                                REFERENCES branches(branch_id)
                                ON UPDATE CASCADE
                                ON DELETE RESTRICT,

                            CONSTRAINT uq_book_member
                                UNIQUE(book_id, member_id)
                        );
                    """
            res = self._execute_query(query=query)
            print(f"create_transactions response: {res}")
        except Exception as e:
            print(f"create_transactions Exception: {repr(e)}")

    def create_member_finance(self):
        try:
            query = """
                        CREATE TABLE IF NOT EXISTS member_finance (
                            transaction_id SERIAL PRIMARY KEY,
                            member_id INTEGER NOT NULL,
                            transaction_date TIMESTAMPTZ NOT NULL,
                            year SMALLINT NOT NULL,
                            month VARCHAR(3) NOT NULL,
                            fee_type BOOLEAN DEFAULT FALSE,
                            debit_amount INTEGER,
                            credit_amount INTEGER,

                            CONSTRAINT fk_member
                                FOREIGN KEY (member_id)
                                REFERENCES members(member_id)
                                ON UPDATE CASCADE
                                ON DELETE RESTRICT
                        );
                    """
            res = self._execute_query(query=query)
            print(f"create_member_finance response: {res}")
        except Exception as e:
            print(f"create_member_finance Exception: {repr(e)}")

    def create_reservations(self):
        pass

    # branch related tables
    def create_branches(self):
        try:
            query = """
                        CREATE TABLE IF NOT EXISTS branches (
                            branch_id SERIAL PRIMARY KEY,
                            branch_name VARCHAR(100) NOT NULL UNIQUE,
                            address TEXT NOT NULL,
                            phone_number TEXT NOT NULL UNIQUE,
                            email TEXT UNIQUE,
                            employee_count INTEGER,
                            is_operational BOOLEAN DEFAULT TRUE
                        );
                    """
            res = self._execute_query(query=query)
            print(f"create_branches response: {res}")
        except Exception as e:
            print(f"create_branches Exception: {repr(e)}")

    def create_employees(self):
        pass

    def create_job_roles(self):
        pass

    def create_job_vacency(self):
        pass

    def create_all_tables(self):
        self.create_authors()
        self.create_books()        
        self.create_book_authors()
        self.create_branches()
        self.create_book_inventory()
        self.create_members()
        self.create_transactions()
        self.create_member_finance()
        return "all tables created successfully."

    def drop_all_tables(self):
        try:
            query = """
                DROP TABLE IF EXISTS
                    member_finance,
                    transactions,
                    members,
                    book_inventory,
                    branches,
                    book_authors,
                    books,
                    authors
                CASCADE;
            """
            res = self._execute_query(query=query)
            print(f"drop_all_tables response: {res}")
        except Exception as e:
            print(f"drop_all_tables exception: {repr(e)}")
