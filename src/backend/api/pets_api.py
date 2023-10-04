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
    user_id = request.headers["User-ID"]

    db_output = get_all_pets(connection=conn, owner_id=owner_id, access_token=access_token)

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
    user_id = request.headers["User-ID"]

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
    # user_id = request.headers["User-ID"]

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

def toggle_missing_status_operation(conn):
    data = request.get_json()
    token = request.headers.get('Authorization').split('Bearer ')[1]
    user_id = request.headers["User-ID"]

    success = update_pet_missing_status(
        connection=conn,
        pet_id=data["pet_id"],
        new_status=data["isMissing"],
        #access_token=token
    )
    if success:
        return "", 200
    return "", 400


def delete_pet_operation(conn, pet_id):
    token = request.headers.get('Authorization').split('Bearer ')[1]
    user_id = request.headers["User-ID"]

    success = delete_pet(
        connection=conn,
        id=pet_id,
        access_token=token, user_id=user_id
    )
    if success:
        return jsonify({'message': 'Pet deleted successfully'}), 201
    else:
        return jsonify({'message': 'Failed to delete pet'}), 500



