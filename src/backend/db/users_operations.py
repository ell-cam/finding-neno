import secrets
import string
import hashlib


def salt_and_hash(password):
    """
    This function is responsible to salt and hash the password it receives
    :Input:
    argv1: password(string)
    :return: hashed password(string)
    """


    salt = secrets.token_hex(16)
    salted_password = f"{password}{salt}"
    hasher = hashlib.sha256()
    hasher.update(salted_password.encode('utf-8'))
    hashed_password = hasher.hexdigest()

    return hashed_password,salt


def generate_access_token():
    """
    This function generates an 32 character random access token using both letters and numbers
    :return: access token(string)
    """

    alphabet = string.ascii_letters + string.digits
    token = ''.join(secrets.choice(alphabet) for i in range(32))

    return token


def insert_user_to_database(conn, email, phone, name, password):
    #
    """
    This function is used to add a new user to the database
    """

    cur = conn.cursor()

    # Generate an access token
    access_token = generate_access_token()

    # Hash the password input
    hashed_pass, salt = salt_and_hash(password)

    # Construct and INSERT query to insert this user into the DB
    query = """INSERT INTO users (email_address, phone_number, name, password, salt, access_token) VALUES (%s, %s, %s, %s, %s,
    %s);"""

    # Execute the query
    try:
        cur.execute(query, (email, phone, name, hashed_pass, salt, access_token))
        print(f"Query executed successfully: {query}")
    except Exception as e:
        print(f"Error while executing query: {e}")

    # Commit the change and close the connection
    conn.commit()
    cur.close()
