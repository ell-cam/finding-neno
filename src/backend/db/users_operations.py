import secrets
import string
import hashlib
import psycopg2
import datetime

from db.authentication import verify_access_token


def get_salt(password):
    # Convert the password to bytes
    password_bytes = password.encode()

    # Use SHA256 to generate the salt
    salt = hashlib.sha256(password_bytes).hexdigest()

    return salt

def salt_and_hash(password):
    """
    This function is responsible to salt and hash the password it receives
    :Input:
    argv1: password(string)
    :return: hashed password(string)
    """


    salt = get_salt(password)
    salted_password = f"{password}{salt}"
    hasher = hashlib.sha256()
    hasher.update(salted_password.encode('utf-8'))
    hashed_password = hasher.hexdigest()

    return hashed_password


def generate_access_token():
    """
    This function generates an 32 character random access token using both letters and numbers
    :return: access token(string)
    """

    alphabet = string.ascii_letters + string.digits
    token = ''.join(secrets.choice(alphabet) for i in range(32))

    return token


def insert_user_to_database(connection: psycopg2.extensions.connection, email: str, phone: str, name: str, password: str):
    """
    This function is used to add a new user to the database
    """

    cur = connection.cursor()

    # Generate an access token
    access_token = generate_access_token()

    # Hash the password input
    hashed_pass= salt_and_hash(password)

    # Construct an INSERT query to insert this user into the DB
    query = """INSERT INTO users (email_address, phone_number, name, password, access_token) VALUES (%s, %s, %s, %s, %s);"""

    # Execute the query
    try:
        cur.execute(query, (email, phone, name, hashed_pass, access_token))
        print(f"Query executed successfully: {query}")
    except Exception as e:
        print(f"Error while executing query: {e}")

    # Close the cursor
    connection.commit()
    cur.close()

def retrieve_user(connection: psycopg2.extensions.connection, profile_user_id: int, user_id: int, access_token: str):
    """
    This function is used to retrieve a user for the profile page.

    Returs
    """

    # Verify access token
    if not verify_access_token(connection, user_id, access_token):
        return False

    cur = connection.cursor()

    # Check if a user with this email exists in the database
    # Construct a SELECT query to retrieve the user
    query = """SELECT name, email_address, phone_number FROM users WHERE id = %s AND access_token = %s"""

    # Result is the object returned or True if no errors encountered, False if there is an error
    result = False

    # Execute the query
    try:
        cur.execute(query, (profile_user_id, access_token,))
        user = cur.fetchall()

        # If a user with the provided email could not be found
        if len(user) == 0:
            print("No user found with the provided id and access token.")
        else:  # If user is found
            result = user[0]  # returns user[1] (email), and user[2] (phone) and user[3] (name)

    except Exception as e:
        print(f"Error while executing query: {e}")

    # Close the cursor
    cur.close()
    return result


def check_user_exists_in_database(connection: psycopg2.extensions.connection, email: str, password: str):
    """
    This function is used to check if a user exists in the database and if the password match
    """

    cur = connection.cursor()

    # Hash the password input
    hashed_pass= salt_and_hash(password)

    # Check if a user with this email exists in the database
    # Construct a SELECT query to check if the user exists in the database and if its password matches
    query = """SELECT id, access_token FROM users WHERE email_address = %s AND password = %s """

    # Result is the object returned or True if no errors encountered, False if there is an error
    result = False

    # Execute the query
    try:
        cur.execute(query, (email, hashed_pass))
        user = cur.fetchall()
        if len(user) == 0:  # If a user with the provided email could not be found
            print("Invalid email or password combination.")
        else: # If login is correct
            result = user[0]
    except Exception as e:
        print(f"Error while executing query: {e}")

    # Close the cursor
    cur.close()
    return result

def insert_sighting_to_database(connection: psycopg2.extensions.connection, author_id: str, date_time_of_creation: datetime,
                                    missing_report_id: int, animal: str, breed: str, date_time: datetime, location_longitude: float,
                                        location_latitude: float, image_url: str, description: str, user_id: int, access_token: str):
    """
    This function is used to add a new sighting to the database.

    Returns False if access tokenn is invalid, True if query is executed successfully.
    """

    # Verify access token
    if not verify_access_token(connection, user_id, access_token):
        cur.close()
        return False

    cur = connection.cursor()

    # Construct and INSERT query to insert this user into the DB
    query = """INSERT INTO sightings (missing_report_id, author_id, date_time_of_creation, animal, breed, date_time, location_longitude, 
    location_latitude, image_url, description) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s);"""

    # Result is the object returned or True if no errors encountered, False if there is an error
    result = False

    # Execute the query
    try:
        cur.execute(query, (author_id, date_time_of_creation, missing_report_id, animal, breed, date_time, location_longitude, location_latitude, image_url, description))
        print(f"Query executed successfully: {query}")

        # Commit the change
        connection.commit()

        result = True # set to True only if it executes successfully 
    except Exception as e:
        print(f"Error while executing query: {e}")

    # Close the cursor
    cur.close()
    return result

def insert_missing_report_to_database(connection: psycopg2.extensions.connection, author_id: str, date_time_of_creation: datetime,
                                      pet_id: int, last_seen: datetime, location_longitude: float, location_latitude: float,
                                          description: str, user_id: int, access_token: str):
    """
    This function is used to add a new missing report to the database.

    Returns False if access token is invalid, True if query is executed successfully.
    """

    # Verify access token
    if not verify_access_token(connection, user_id, access_token):
        cur.close()
        return False

    cur = connection.cursor()

    # Result is the object returned or True if no errors encountered, False if there is an error
    result = False

    # Construct and INSERT query to insert this user into the DB
    query = """INSERT INTO missing_reports (pet_id, author_id, date_time_of_creation, date_time, location_longitude, 
    location_latitude, description, isActive) VALUES (%s, %s, %s, %s, %s, %s, %s, %s);"""

    # Execute the query
    try:
        # New reports are automatically set as active
        isActive = True
        cur.execute(query, (author_id, date_time_of_creation, pet_id, last_seen, location_longitude, location_latitude, description, isActive))
        print(f"Query executed successfully: {query}")

        # Commit the change
        connection.commit()

        result = True
    except Exception as e:
        print(f"Error while executing query: {e}")

    # CClose the cursor
    cur.close()
    return result

def update_missing_report_in_database(connection: psycopg2.extensions.connection, report_id: int,  pet_id: int, author_id: int,
                                      last_seen, location_longitude, location_latitude, description, isActive, access_token):
    """
    This function is used to update a missing report in the database.

    Returns False if access token is invalid, True if query is executed successfully.
    """

    # Verify access token
    if not verify_access_token(connection, author_id, access_token):
        cur.close()
        return False

    cur = connection.cursor()

    # UPDATE query to update missing report
    query = """
                UPDATE 
                    missing_reports 
                SET 
                    pet_id = %s, author_id = %s, date_time = %s, location_longitude = %s, 
                    location_latitude = %s, description = %s, isActive = %s 
                WHERE 
                    id = %s;
                """

    # Result is the object returned or True if no errors encountered, False if there is an error
    result = False

    # Execute the query
    try:
        cur.execute(query, (pet_id, author_id, last_seen, location_longitude, location_latitude, description, isActive, report_id))
        print(f"Query executed successfully: {query}")

        # Commit the change
        connection.commit()

        result = True
    except Exception as e:
        print(f"Error while executing query: {e}")

    # Close the cursor
    cur.close()
    return result


def archive_missing_report_in_database(connection: psycopg2.extensions.connection, reportId, isActive, user_id, access_token):
    """
    This function is used to archive a missing report.

    Returns False if access token is invalid, True if query is executed successfully.
    """

    # Verify access token
    if not verify_access_token(connection, user_id, access_token):
        return False

    cur = connection.cursor()

    # UPDATE query to archive report
    query = """UPDATE missing_reports SET isActive = %s WHERE id = %s;"""

    # Result is the object returned or True if no errors encountered, False if there is an error
    result = False

    # Execute the query
    try:
        cur.execute(query, (isActive, reportId))
        print(f"Query executed successfully: {query}")

        # Commit the change
        connection.commit()

        result = True
    except Exception as e:
        print(f"Error while executing query: {e}")

    # Close the cursor
    cur.close()
    return result


def retrieve_missing_reports_from_database(connection: psycopg2.extensions.connection, author_id: int, user_id: int, access_token: str):
    """
    This function retrieves all missing reports or missing reports of a user if user_id is provided.
    Missing report, pet, and owner information are all returned.

    Returns False if access token is invalid, empty array if no reports exist or an error is encountered, otherwise returns
    missing reports.
    """

    # Verify access token
    if not verify_access_token(connection, user_id, access_token):
        return False

    cur = connection.cursor()

    if author_id == None:
        query = """
                    SELECT 
                        mr.id AS missing_report_id, mr.date_time, mr.description, mr.location_longitude, mr.location_latitude, 
                        p.id AS pet_id, p.name AS pet_name, p.animal, p.breed, p.image_url AS pet_image_url,
                        u.id AS owner_id, u.name AS owner_name, u.email_address AS owner_email, u.phone_number AS owner_phone_number
                    FROM 
                        missing_reports AS mr
                    JOIN 
                        pets AS p ON mr.pet_id = p.id
                    JOIN 
                        users AS u ON mr.author_id = u.id
                    ORDER BY 
                        mr.date_time DESC;
                """

    else:
        query = """
                    SELECT 
                        mr.id AS missing_report_id, mr.date_time, mr.description, mr.location_longitude, mr.location_latitude,
                        p.id AS pet_id, p.name AS pet_name, p.animal, p.breed, p.image_url AS pet_image_url,
                        u.id AS owner_id, u.name AS owner_name, u.email_address AS owner_email, u.phone_number AS owner_phone_number
                    FROM 
                        missing_reports AS mr
                    JOIN 
                        pets AS p ON mr.pet_id = p.id
                    JOIN 
                        users AS u ON mr.author_id = u.id
                    WHERE 
                        u.id = %s
                    ORDER BY 
                        mr.date_time DESC;
                """

    # Result is the object returned or True if no errors encountered, False if there is an error
    result = False

    try:
        if author_id == None:
            cur.execute(query)
        else:
            cur.execute(query, (author_id, ))

        # Retrieve rows as an array
        missing_reports = cur.fetchall()

        print(f"Missing reports successfully retrieved: {missing_reports}")

        result = missing_reports
    except Exception as e:
        print(f"Error with retrieving missing reports: {e}")

    # Close the cursor
    cur.close()
    return result

def retrieve_reports_by_pet_id(connection: psycopg2.extensions.connection, pet_id: int, user_id: int, access_token: str):
    """
    This function retrieves reports based on the provided pet_id.
    Missing report, pet, and owner information are returned.

    Returns False if access token is invalid, an empty array if no reports exist for the given pet_id,
    or an error is encountered. Otherwise, returns the reports.
    """

    # Verify access token
    if not verify_access_token(connection, user_id, access_token):
        return False

    cur = connection.cursor()

    query = """
        SELECT 
            mr.id AS missing_report_id, mr.date_time, mr.description, mr.location_longitude, mr.location_latitude,
            p.id AS pet_id, p.name AS pet_name, p.animal, p.breed, p.image_url AS pet_image_url,
            u.id AS owner_id, u.name AS owner_name, u.email_address AS owner_email, u.phone_number AS owner_phone_number
        FROM 
            missing_reports AS mr
        JOIN 
            pets AS p ON mr.pet_id = p.id
        JOIN 
            users AS u ON mr.author_id = u.id
        WHERE 
            p.id = %s;
    """

    # Result is the object returned or True if no errors encountered, False if there is an error
    result = None

    try:
        cur.execute(query, (pet_id, ))

        # Retrieve the reports
        reports = cur.fetchall()

        if reports:
            print(f"Reports successfully retrieved: {reports}")
            result = reports
        else:
            print(f"No reports found for the provided pet_id")

    except Exception as e:
        print(f"Error with retrieving the reports: {e}")

    # Close the cursor
    cur.close()
    return result

def retrieve_sightings_from_database(connection: psycopg2.extensions.connection, missing_report_id: int, user_id: int, access_token: str):
    """
    This function returns all pet sightings or pet sightings for a missing report if missing_report_id is provided.

    Returns False if access token is invalid, empty array if no sightings exist or an error is encountered, otherwise returns
    sightings.
    """

    # Verify access token
    if not verify_access_token(connection, user_id, access_token):
        return False

    # Open cursor to access the connection.
    cur = connection.cursor()

    if missing_report_id == None:
        # Query returns all sightings in the database
        query = """
                    SELECT
                        s.id, s.missing_report_id, s.author_id, s.date_time, s.location_longitude, s.location_latitude, s.image_url, s.description,
                        u.name, u.email_address, u.phone_number
                    FROM
                        sightings AS s
                    JOIN
                        missing_reports AS mr ON s.missing_report_id = mr.id
                    JOIN
                        users AS u ON s.author_id = u.id
                    ORDER BY
                        s.date_time DESC;
                """
    else:
        # Query returns all sightings of a missing report
        query = """
                    SELECT
                        s.id, s.missing_report_id, s.author_id, s.date_time, s.location_longitude, s.location_latitude, s.image_url, s.description,
                        u.name, u.email_address, u.phone_number
                    FROM
                        sightings AS s
                    JOIN
                        missing_reports AS mr ON s.missing_report_id = mr.id
                    JOIN
                        users AS u ON s.author_id = u.id
                    WHERE 
                        s.missing_report_id = %s
                    ORDER BY
                        s.date_time DESC;
                """
        
    # Result is the object returned or True if no errors encountered, False if there is an error
    result = False

    try:
        if missing_report_id == None:
            cur.execute(query)
        else:
            cur.execute(query, (missing_report_id, ))

        # Retrieve rows as an array
        sightings = cur.fetchall()

        print(f"Sightings successfully retrieved")

        result = sightings
    except Exception as e:
        print(f"Error with retrieving sightings: {e}")

    # Close the cursor
    cur.close()
    return result

def change_password_in_database(connection: psycopg2.extensions.connection, email: int, new_password: str, user_id: int, access_token: str):
    """
    This function updates the password of the row in the database which matches the email provided.

    Returns False if access token is invalid, True if query is executed successfully.
    """

    # Verify access token
    if not verify_access_token(connection, user_id, access_token):
        return False

    # Open cursor to access the conection.
    cur = connection.cursor()
        
    query = """UPDATE users SET password = %s, salt = %s WHERE email_address = %s;"""

    # Hash and salt password
    hashed_password, salt = salt_and_hash(new_password)

    # Result is the object returned or True if no errors encountered, False if there is an error
    result = False

    # Execute query
    try:
        cur.execute(query, (hashed_password, salt, email))

        # Commit the change
        connection.commit()
        print(f"Password successfully changed")

        result = True
    except Exception as e:
        print(f"Error with changing password: {e}")

    # Close the cursor
    cur.close()
    return result
