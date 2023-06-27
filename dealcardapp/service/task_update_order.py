import re

from pprint import pprint
from .bitrix24 import bitrix as bx24


SMART_PROCESS_ID = 184


def run(task_id, deal_id):
    cmd = {
        "deal": f"crm.deal.list?filter[ID]={deal_id}&select[]=*&select[]=UF_*",
        "fields": f"crm.deal.fields"
    }
    response = bx24.requests_bath(cmd)
    fields = response.get("result", {}).get("fields", {})
    deal = response.get("result", {}).get("deal", [])
    deal = deal[0] if deal else {}
    # task = response.get("result", {}).get("task", {}).get("task", {})

    task_data = {
        # "RESPONSIBLE_ID": deal.get("UF_CRM_1619700503"),    # Исполнитель МОС
        # "AUDITORS": deal.get("UF_CRM_1684305731"),          # Наблюдатели
        "DESCRIPTION": get_description(deal, fields),
    }

    response = bx24.request_bx("tasks.task.update", {
        "taskId": task_id,
        "fields": task_data
    })
    # pprint(response)


def get_text_print_according_to_cp(code):
    """ Печать согласно ЦП?"""
    print_according_to_cp = ""

    if code == "717":
        print_according_to_cp = "Да"
    elif code == "719":
        print_according_to_cp = "Нет"

    return print_according_to_cp


def get_text_required_measurement(code):
    data = ""
    if code == "99":
        data = "Да"
    elif code == "101":
        data = "Нет"
    return data


def get_text_required_dismantling(code):
    data = ""
    if code == "1121":
        data = "Да"
    elif code == "1123":
        data = "Нет"
    return data


def get_text_phone(items):
    data = ""
    for item in items:
        data += item.get("VALUE", "")
        data += ", "
    return data


def get_valid_phone(items):
    if not items:
        return
    phone = items[0].get("VALUE")
    if len(phone) >=11 and phone.startswith("8"):
        return "+7" + phone[1:]
    elif len(phone) >=11 and phone.startswith("7"):
        return "+" + phone
    else:
        return phone


def get_text_from_list(items):
    data = ""
    for item in items:
        data += item
    return data

def get_url_files(files_data):
    data = ""
    for file_data in files_data:
        name, _, url = file_data.split(";")
        data += f"[URL={url}]{name}[/URL] <br>"
    return data


def get_value_by_key(items, item_key):
    item_value = ""
    for item in items:
        if item.get("ID") == item_key:
            item_value = item.get("VALUE")
    return item_value;


def get_data_table(products, items_manufact_techn, items_film_width):
    tbody = "[TR][TD]Описание[/TD][TD]Количество[/TD][TD]Технология изготовления[/TD][TD]Ширина пленки[/TD][TD]Площадь м.пог.[/TD][TD]Площадь м2[/TD][TD]Ссылка на источник клиента[/TD][TD]Файлы клиента[/TD][/TR]"

    for product in products:
        manufact_techn = get_value_by_key(items_manufact_techn, product.get('ufCrm19_1684137822'))
        film_width = get_value_by_key(items_film_width, product.get('ufCrm19_1684137877'))
        tbody += f"[TR][TD]{product.get('ufCrm19_1684137706')}[/TD][TD]{product.get('ufCrm19_1684137811')}[/TD][TD]{manufact_techn}[/TD]" \
                 f"[TD]{film_width}[/TD][TD]{product.get('ufCrm19_1684137925')}[/TD][TD]{product.get('ufCrm19_1684137950')}[/TD]" \
                 f"[TD]{product.get('ufCrm19_1684138153')}[/TD][TD]{get_url_files(product.get('ufCrm19_1684142357', []))}[/TD][/TR]"
    data = f"""
[TABLE]
{tbody}
[/TABLE]
    """
    return data


def getValidData(string):
    string = re.sub(r'<strong\b[^>]*>(.*?)<\/strong>', r'<b>\1</b>', string)
    string = re.sub(r'<em\b[^>]*>(.*?)<\/em>', r'<i>\1</i>', string)
    string = re.sub(r'<p>(.*?)<\/p>', r'\n\1', string)
    return string


def get_description(deal, fields):
    # print("itemsdManufactTechn = ", fields.get("UF_CRM_1625666854", {}).get("items", {}))
    # print("itemsFilmWidth = ", fields.get("UF_CRM_1672744985962", {}).get("items", {}))
    cmd = {
        "contact": f"crm.contact.list?filter[ID]={deal.get('CONTACT_ID')}&select[]=NAME&select[]=LAST_NAME&select[]=SECOND_NAME",
        "company": f"crm.company.list?filter[ID]={deal.get('COMPANY_ID')}&select[]=TITLE&select[]=PHONE",
        "contact_measurement": f"crm.contact.list?filter[ID]={deal.get('UF_CRM_1621943311')}&select[]=PHONE",
        "products": f"crm.item.list?entityTypeId=184&filter[parentId2]={deal.get('ID')}&select[]=ufCrm19_1684137706&select[]=ufCrm19_1684137811&select[]=ufCrm19_1684137822&select[]=ufCrm19_1684137877&select[]=ufCrm19_1684137925&select[]=ufCrm19_1684137950&select[]=ufCrm19_1684138153&select[]=ufCrm19_1684142357"
    }
    response = bx24.requests_bath(cmd)

    contact = response.get("result", {}).get("contact", {})
    company = response.get("result", {}).get("company", {})
    contact_measurement = response.get("result", {}).get("contact_measurement", [])
    products = response.get("result", {}).get("products", {}).get("items", [])
    contact = contact[0] if contact else {}
    company = company[0] if company else {}
    contact_measurement = contact_measurement[0] if contact_measurement else {}
    contact_measurment_text = get_valid_phone(contact_measurement.get("PHONE"))

    desc = f"""
{getValidData(deal.get("UF_CRM_1687857777", "-"))}
{getValidData(deal.get("UF_CRM_1655918107", "-"))}

____________
Согласно ЦП:{get_text_print_according_to_cp(deal.get("UF_CRM_1640199620"))}
Нужен Замер: {get_text_required_measurement(deal.get("UF_CRM_1619441905773"))}
Демонтаж: {get_text_required_dismantling(deal.get("UF_CRM_1657651541"))}
____________

____________
Ссылки: {get_text_from_list(deal.get("UF_CRM_1625591420"))}
CRM / Тендер: {deal.get("UF_CRM_1620918041")}
____________
Контакт: [URL=https://007.bitrix24.ru/crm/contact/details/{deal.get("UF_CRM_1621943311")}/]{contact.get("NAME")} {contact.get("LAST_NAME")} {contact.get("SECOND_NAME")} {contact_measurment_text}[/URL]
Написать в Whats App [URL=https://wa.me/{contact_measurment_text}/][/URL]
____________
Компания: [URL=https://007.bitrix24.ru/crm/company/details/{deal.get("COMPANY_ID")}/] {company.get("TITLE")} {get_text_phone(company.get("PHONE", []))}[/URL]

{get_data_table(products, fields.get("UF_CRM_1625666854", {}).get("items", {}), fields.get("UF_CRM_1672744985962", {}).get("items", {}))}
"""
    # print(desc)
    return desc


# update(50741, 10133)


# Поля сделки
# UF_CRM_1668129559 - Командировка
# UF_CRM_1619441905773 - Нужен замер
# UF_CRM_1657651541 - Демонтаж
# UF_CRM_1637861351 - Парковка
# UF_CRM_1637861029 - Монтаж 24/7
# UF_CRM_1637326777 - Наши реквизиты
# UF_CRM_1619441621 - Спопоб оплаты
# UF_CRM_1619430831 - Ответственный МОП
# UF_CRM_1619700503 - Ответственный МОС
# UF_CRM_1684305731 - Наблюдатели
# UF_CRM_1655918107 - Описание

# Поля смарт процесса
# ufCrm19_1684137706 - описание
# ufCrm19_1684137811 - количество
# ufCrm19_1684137822 - технология изготовления
# ufCrm19_1684137877 - Ширина пленки
# ufCrm19_1684137925 - Площадь метерр погонный
# ufCrm19_1684137950 - Площадь м2
# ufCrm19_1684138153 - Ссылка на источник клиента
# ufCrm19_1684142357 - Файлы клиента

"""
{{Описание Заказа (Что делаем, сколько, требования, особенности)}}
____________
Согласно ЦП:{{Печать согласно ЦП? (текст)}}
Нужен Замер: {{Требуется Замер (текст)}}
Демонтаж: {{Требуется демонтаж}}
____________

____________
Ссылки: {{Ссылка на исходники Клиента}}
CRM / Тендер: {{Ссылка  рабочую таблицу / тендер / CRM Клиента}}
____________
Контакт: [URL=https://007.bitrix24.ru/crm/contact/details/{{Контакт для Замера}}/]{=A30970_27440_98786_18774:NAME} {=A30970_27440_98786_18774:LAST_NAME} {=A30970_27440_98786_18774:SECOND_NAME} {=Variable:Variable1}[/URL]
Написать в Whats App [URL=https://wa.me/{=Variable:Variable1}/][/URL]
____________
Компания: [URL=https://007.bitrix24.ru/crm/contact/details/{{Компания: ID}}/] {{Компания: Название компании}} {{Компания: Телефон}}[/URL]
"""
