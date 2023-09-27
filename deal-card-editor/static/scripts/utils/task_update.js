import Bitrix24 from '../bx24/requests.js'
import { SMART_FIELDS, LIST_TECHNOLOGY, LIST_FILMS, LIST_WIDTH_FILMS} from '../parameters.js';


// const RESPONSIBLE_MOS = "UF_CRM_1672839295";

// Поля в сделке
const FIELD_OBSERVERS           = "UF_CRM_1684305731";      // Список наблюдателей задачи "ЗАКАЗ"
const FIELD_ID_TASK_ORDER       = "UF_CRM_1661089895";      // ID задачи "ЗАКАЗ" (сохраненное в сделке)
const FIELD_DESC_ORDER          = "UF_CRM_1655918107";      // Что делаем по заказу в целом
const FIELD_BUSINESS_TRIP       = "UF_CRM_1668129559";      // Командировка
const FIELD_METERING            = "UF_CRM_1695664525";      // Замер
const FIELD_DISMANTLING         = "UF_CRM_1657651541";      // Демонтаж
const FIELD_PARKING             = "UF_CRM_1637861351";      // Парковка
const FIELD_COLOR_PROOF         = "UF_CRM_1640199620";      // Печать согласно ЦП?
const FIELD_INSTALL             = "UF_CRM_1637861029";      // Монтаж 24/7
const FIELD_OURDETAILS          = "UF_CRM_1637326777";      // Наши реквизиты
const FIELD_BOXING_RENTAL       = "UF_CRM_1694710116";      // Аренда бокса
const FIELD_INSTALL_ON_TERRIT   = "UF_CRM_1694710578";      // Монтаж на территории
const FIELD_CONTACT_MESURE      = "UF_CRM_1621943311";      // Контакт для Замера

// Список имен полей со свойствами заказа
const FIELD_PROPERTIES = [FIELD_BUSINESS_TRIP, FIELD_METERING, FIELD_DISMANTLING, FIELD_PARKING, FIELD_COLOR_PROOF, FIELD_INSTALL, FIELD_OURDETAILS, FIELD_BOXING_RENTAL, FIELD_INSTALL_ON_TERRIT];

async function update(dataDealNew, dataDealOld, dataProducts, fields) {
    let taskId = dataDealOld[FIELD_ID_TASK_ORDER];
    let desc = await getDescription(dataDealNew, dataDealOld, dataProducts, fields);
    let data = {
        AUDITORS: dataDealNew[FIELD_OBSERVERS],           // Наблюдатели
        DESCRIPTION: desc,
    }
    await updateTaskOrderToBx24(taskId, data);
}


function getValidData(str) {
    if (typeof str === 'string') {
        return str.replace(/<strong\b[^>]*>(.*?)<\/strong>/gi, "<b>$1</b>").replace(/<em\b[^>]*>(.*?)<\/em>/gi, "<i>$1</i>").replace(/<p>(.*?)<\/p>/gi, '\n$1');
    }
    return "";
}


async function getDescription(dataDealNew, dataDealOld, dataProducts, fields) {
    let response = await getDataFromBx24(dataDealOld.CONTACT_ID, dataDealOld.COMPANY_ID, dataDealNew.UF_CRM_1621943311);
    console.log("DATA FROM BITRIX FOR TASK UPDATE = ", response);
    let contact = (Array.isArray(response.contact) ? response.contact[0] : {}) || {};
    let company = (Array.isArray(response.company) ? response.company[0] : {}) || {};
    let contactMeasurement = Array.isArray(response.contact_measurement) ? response.contact_measurement[0] : {};
    let contactMeasurementText = typeof contactMeasurement === 'object' ? getValidPhone(contactMeasurement.PHONE) : "";
    return `
[B]Что делаем по заказу в целом:[/B]
${getValidData(dataDealNew[FIELD_DESC_ORDER])}

${getTaskPropertiesTableBBCODE(FIELD_PROPERTIES, fields, dataDealNew)}

[B]Контакт:[/B] [URL=https://007.bitrix24.ru/crm/contact/details/${dataDealOld.UF_CRM_1621943311}/]${contact.NAME} ${contact.LAST_NAME} ${contact.SECOND_NAME} ${contactMeasurementText}[/URL]
[B]Написать в Whats App[/B] [URL=https://wa.me/${contactMeasurementText}/][/URL]

${getDataTable(dataProducts, fields.UF_CRM_1625666854.items, fields.UF_CRM_1672744985962.items)}
`;
}

function getTaskPropertiesTableBBCODE(fields, fieldsData, data) {
    let content = "";
    for (let field of fields) {
        content+= `
            [TR]
                [TD][B]Командировка:[/B][/TD] 
                [TD]${getValueByKey(fieldsData[field].items, data[field])}[TD]
            [/TR]
        `;
    }
    return content;
// [B]Замер:[/B] ${                    getValueByKey(fieldsData.UF_CRM_1695664525.items, data.UF_CRM_1695664525)}
// [B]Демонтаж:[/B] ${                 getValueByKey(fieldsData.UF_CRM_1657651541.items, data.UF_CRM_1657651541)}
// [B]Парковка:[/B] ${                 getValueByKey(fieldsData.UF_CRM_1637861351.items, data.UF_CRM_1637861351)}
// [B]Печать согласно ЦП?:[/B] ${      getValueByKey(fieldsData.UF_CRM_1640199620.items, data.UF_CRM_1640199620)}
// [B]Монтаж 24/7:[/B] ${              getValueByKey(fieldsData.UF_CRM_1637861029.items, data.UF_CRM_1637861029)}
// [B]Наши реквизиты:[/B] ${           getValueByKey(fieldsData.UF_CRM_1637326777.items, data.UF_CRM_1637326777)}
// [B]Аренда бокса:[/B] ${             getValueByKey(fieldsData.UF_CRM_1694710116.items, data.UF_CRM_1694710116)}
// [B]Монтаж на территории:[/B] ${     getValueByKey(fieldsData.UF_CRM_1694710578.items, data.UF_CRM_1694710578)}`;
}

function getDataTable(products, itemsdManufactTechn, itemsFilmWidth) {
    let tbody = `[TR]
        [TD][B]Название[/B][/TD]
        [TD][B]Кол-во шт.[/B][/TD]
        [TD][B]Технология изготовления[/B][/TD]
        [TD][B]Пленка[/B][/TD]
        [TD][B]Ламинация[/B][/TD]
        [TD][B]Ширина пленки[/B][/TD]
        [TD][B]П.м. за шт.[/B][/TD]
        [TD][B]Кв. м. за шт.[/B][/TD]
        [TD][B]П.м. всего[/B][/TD]
        [TD][B]Кв.м. всего[/B][/TD]
        [TD][B]Ссылка на исходники клиента[/B][/TD]
        [TD][B]Файлы клиента[/B][/TD]
        [TD][B]Черновой препресс[/B][/TD]
        [TD][B]Комментарии[/B][/TD]
    `;
    for (let product of products) {
        console.log("product = ", product);
        tbody += `[TR]
            [TD]${product[SMART_FIELDS.TITLE] || "-"}[/TD]
            [TD]${product[SMART_FIELDS.COUNT_PIECES] || "-"}[/TD]
            [TD]${getValueByKey(LIST_TECHNOLOGY, product[SMART_FIELDS.TECHNOLOGY])}[/TD]
            [TD]${getValueByKey(LIST_FILMS, product[SMART_FIELDS.FILM])}[/TD]
            [TD]${product[SMART_FIELDS.LAMINATION] || "-"}[/TD]
            [TD]${getValueByKey(LIST_WIDTH_FILMS[product[SMART_FIELDS.FILM]] || [], product[SMART_FIELDS.WIDTH_FILM])}[/TD]
            [TD]${product[SMART_FIELDS.LINEAR_METER_PIECES] || "-"}[/TD]
            [TD]${product[SMART_FIELDS.SQUARE_METER_PIECES] || "-"}[/TD]
            [TD]${product[SMART_FIELDS.LINEAR_METER_TOTAL] || "-"}[/TD]
            [TD]${product[SMART_FIELDS.SQUARE_METER_TOTAL] || "-"}[/TD]
            [TD][URL=${product[SMART_FIELDS.LINK_SRC] || "-"}]${product[SMART_FIELDS.LINK_SRC] || "-"}[/URL][/TD]\
            [TD]${getUrlFiles(product[SMART_FIELDS.CLIENT_FILES])}[/TD]
            [TD]${getUrlFiles(product[SMART_FIELDS.PREPRESS])}[/TD]
            [TD]${product[SMART_FIELDS.COMMENT] || "-"}[/TD]
        [/TR]`;
    }
    let data = `
[TABLE]
${tbody}
[/TABLE]
    `
    return data
}


function arrToSring(lst) {
    if (Array.isArray()) {
        return lst.join()
    }
    return ""
}


function getValidPhone(items) {
    if (Array.isArray(items) && items.length > 0) {
        let phone = items[0].VALUE;
        if (phone.length >=11 && phone[0] == "8") {
            return "+7" + phone.slice(1);
        } else if (phone.length >=11 && phone[0] == "7") {
            return "+" + phone;
        } else {
            return phone;
        }

    }    
}


function getValueByKey(items, itemKey) {
    let itemValue = "-";
    for (let item of items) {
        if (item.ID == itemKey) {
            itemValue = item.VALUE;
        }
    }
    return itemValue;
}


function getUrlFiles(files_data) {
    let data = ""
    for (let file_data of files_data) {
        let tmp_ = file_data.split(";")
        data += `[URL=${tmp_[2]}]${tmp_[0]}[/URL] <br>`
    }
    return data || "-";
}


async function getDataFromBx24(contactId, companyId, contactMasurementId) {
    let bx24 = new Bitrix24();
    let reqPackage = {
        contact: ["crm.contact.list", {filter: {ID: contactId}, select: ["NAME", "LAST_NAME","SECOND_NAME"]}],
        company: ["crm.company.list", {filter: {ID: companyId}, select: ["TITLE", "PHONE"]}],
        contact_measurement: ["crm.contact.list", {filter: {ID: contactMasurementId}, select: ["PHONE"]}],
    };
    let response = await bx24.batchMethod(reqPackage);
    return response;
}


async function updateTaskOrderToBx24(taskId, data) {
    let bx24 = new Bitrix24();
    let response = await bx24.callMethod(
        "tasks.task.update",
        {
            "taskId": taskId,
            "fields": data
        }
    );
    return response;
}

export {update};