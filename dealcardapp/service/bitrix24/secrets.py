#!/usr/bin/python
# -*- coding: utf-8 -*-

import os
import json
from pathlib import Path

# BASE_DIR = r""
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
PATTERN_DATE = "%Y-%m-%dT%H:%M:%S"
PATH_SECRET_FILE = os.path.join(BASE_DIR, 'secrets.json')



# Получение данных из файла секрета
def get_secrets():
    if not os.path.exists(PATH_SECRET_FILE):
        return None

    data = None
    with open(PATH_SECRET_FILE) as secrets_file:
        data = json.load(secrets_file)

    return data


# Получение вебхука для обращения к Битрикс из файла секрета
def get_webhook():
    if not os.path.exists(PATH_SECRET_FILE):
        return None

    webhook = None
    with open(PATH_SECRET_FILE) as secrets_file:
        data = json.load(secrets_file)
        webhook = data.get("webhook", None)

    return webhook


# Получение значения из файла секрета по его ключу
def get_secrets_value(key):
    if not os.path.exists(PATH_SECRET_FILE):
        return None

    value = None
    with open(PATH_SECRET_FILE) as secrets_file:
        data = json.load(secrets_file)
        value = data.get(key, None)

    return value


# Сохранение значение в файл секрета
def save_secrets_value(key, value):
    data = {}
    with open(PATH_SECRET_FILE, 'r') as secrets_file:
        data = json.load(secrets_file)
        data[key] = value

    # запись новых токенов в файл
    with open(PATH_SECRET_FILE, 'w+') as secrets_file:
        json.dump(data, secrets_file)