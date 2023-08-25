import flask
from flask import request, jsonify
import sys

from pathlib import Path

file = Path(__file__).resolve()
package_root_directory = file.parents[1]
sys.path.append(str(package_root_directory))

from db.pets import *


def get_owner_pets_operation(conn, owner_id):
    access_token = request.headers.get('Authorization').split('Bearer ')[1]

    db_output = get_all_pets(connection=conn, owner_id=owner_id, access_token=access_token)

    print(db_output)

    if db_output is False:
        return "Authentication failed", 401
    else:
        return jsonify(db_output)


def get_pet_operation(conn, pet_id):

    db_output = get_pet(connection=conn, pet_id=pet_id)
    return jsonify(db_output)


def insert_pet_operation(conn, owner_id):
    data = request.get_json()
    token = request.headers.get('Authorization').split('Bearer ')[1]

    print(data)

    pet = add_pet(
        connection=conn,
        name=data["name"],
        animal=data["animal"],
        breed=data["breed"],
        description=data["description"],
        image_url=data["image_url"],
        is_missing = data["is_missing"],
        owner_id=owner_id,
        access_token=token
    )
    if pet:
        return "", 201
    return ""


def update_pet_operation(conn):
    data = request.get_json()
    token = request.headers.get('Authorization').split('Bearer ')[1]

    success = edit_pet(
        connection=conn,
        id=data["id"],
        name=data["name"],
        animal=data["animal"],
        breed=data["breed"],
        description=data["description"],
        image_url=data["image_url"],
        owner_id=data["owner_id"],
        access_token=token
    )
    if success:
        return "", 201
    return ""

def toggle_pet_missing_status(connection: psycopg2.extensions.connection, pet_id: int) -> bool:
    try:
        cur = connection.cursor()

        # Retrieve the current isMissing value
        cur.execute("SELECT isMissing FROM pets WHERE id = %s;", (pet_id,))
        current_status = cur.fetchone()[0]

        # Toggle the value and update the database
        new_status = not current_status
        cur.execute("UPDATE pets SET isMissing = %s WHERE id = %s;", (new_status, pet_id))

        connection.commit()
        cur.close()
        return True
    
    except Exception as e:
        print(f"Error toggling status: {e}")
        connection.rollback()
        return False


def delete_pet_operation(conn, pet_id):
    token = request.headers.get('Authorization').split('Bearer ')[1]

    success = delete_pet(
        connection=conn,
        id=pet_id,
        access_token=token
    )
    if success:
        return "", 201
    return ""



