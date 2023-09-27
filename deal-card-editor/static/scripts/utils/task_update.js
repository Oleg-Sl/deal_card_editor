import Bitrix24 from '../bx24/requests.js'
import { SMART_FIELDS, LIST_TECHNOLOGY, LIST_FILMS, LIST_WIDTH_FILMS} from '../parameters.js';


const RESPONSIBLE_MOS = "UF_CRM_1672839295";
const OBSERVER = "UF_CRM_1684305731";


async function update(dataDealNew, dataDealOld, dataProducts, fields) {
    let taskId = dataDealOld.UF_CRM_1661089895;
    let desc = await getDescription(dataDealNew, dataDealOld, dataProducts, fields);
    let data = {
        AUDITORS: dataDealNew[OBSERVER],           // Наблюдатели
        DESCRIPTION: desc,
    }
    await updateTaskOrderToBx24(taskId, data);
}


function getValidData(str) {
    return str.replace(/<strong\b[^>]*>(.*?)<\/strong>/gi, "<b>$1</b>").replace(/<em\b[^>]*>(.*?)<\/em>/gi, "<i>$1</i>").replace(/<p>(.*?)<\/p>/gi, '\n$1');
}


async function getDescription(dataDealNew, dataDealOld, dataProducts, fields) {
    let response = await getDataFromBx24(dataDealOld.CONTACT_ID, dataDealOld.COMPANY_ID, dataDealNew.UF_CRM_1621943311);
    console.log("DATA FROM BITRIX FOR TASK UPDATE = ", response);
    let contact = (Array.isArray(response.contact) ? response.contact[0] : {}) || {};
    let company = (Array.isArray(response.company) ? response.company[0] : {}) || {};
    let contactMeasurement = Array.isArray(response.contact_measurement) ? response.contact_measurement[0] : {};
    let contactMeasurementText = typeof contactMeasurement === 'object' ? getValidPhone(contactMeasurement.PHONE) : "";
    // ____________
    // [B]№ заказа:[/B] ${dataDealNew.UF_CRM_1633523035}
    // [B]Ссылка на тендер/CRM клиента:[/B] [URL=${dataDealNew.UF_CRM_1620918041}] ${dataDealNew.UF_CRM_1620918041 || '-'}[/URL]
    // ____
    //     ____________
    // [B]Компания:[/B] [URL=https://007.bitrix24.ru/crm/company/details/${dataDealOld.COMPANY_ID}/] ${company.TITLE} ${arrToSring(company.PHONE)}[/URL]
    return `
[B]Что делаем по заказу в целом:[/B]
${getValidData(dataDealNew.UF_CRM_1655918107 || "")}
________
[B]Командировка:[/B] ${getValueByKey(fields.UF_CRM_1668129559.items, dataDealNew.UF_CRM_1668129559)}
[B]Замер:[/B] ${getValueByKey(fields.UF_CRM_1695664525.items, dataDealNew.UF_CRM_1695664525)}
[B]Демонтаж:[/B] ${getValueByKey(fields.UF_CRM_1657651541.items, dataDealNew.UF_CRM_1657651541)}
[B]Парковка:[/B] ${getValueByKey(fields.UF_CRM_1637861351.items, dataDealNew.UF_CRM_1637861351)}
[B]Печать согласно ЦП?:[/B] ${getValueByKey(fields.UF_CRM_1640199620.items, dataDealNew.UF_CRM_1640199620)}
[B]Монтаж 24/7:[/B] ${getValueByKey(fields.UF_CRM_1637861029.items, dataDealNew.UF_CRM_1637861029)}
[B]Наши реквизиты:[/B] ${getValueByKey(fields.UF_CRM_1637326777.items, dataDealNew.UF_CRM_1637326777)}
[B]Аренда бокса:[/B] ${getValueByKey(fields.UF_CRM_1694710116.items, dataDealNew.UF_CRM_1694710116)}
[B]Монтаж на территории:[/B] ${getValueByKey(fields.UF_CRM_1694710578.items, dataDealNew.UF_CRM_1694710578)}
____________
[B]Контакт:[/B] [URL=https://007.bitrix24.ru/crm/contact/details/${dataDealOld.UF_CRM_1621943311}/]${contact.NAME} ${contact.LAST_NAME} ${contact.SECOND_NAME} ${contactMeasurementText}[/URL]
[B]Написать в Whats App[/B] [URL=https://wa.me/${contactMeasurementText}/][/URL]


${getDataTable(dataProducts, fields.UF_CRM_1625666854.items, fields.UF_CRM_1672744985962.items)}
`;
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



// Поля сделки
// UF_CRM_1668129559 - Командировка
// UF_CRM_1619441905773 - Нужен замер
// UF_CRM_1657651541 - Демонтаж
// UF_CRM_1637861351 - Парковка
// UF_CRM_1637861029 - Монтаж 24/7
// UF_CRM_1637326777 - Наши реквизиты
// UF_CRM_1619441621 - Спопоб оплаты
// UF_CRM_1619430831 - Ответственный МОП
// UF_CRM_1672839295 - Ответственный МОС
// UF_CRM_1684305731 - Наблюдатели
// UF_CRM_1655918107 - Описание

// Поля смарт процесса
// ufCrm19_1684137706 - описание
// ufCrm19_1684137811 - количество
// ufCrm19_1684137822 - технология изготовления
// ufCrm19_1684137877 - Ширина пленки
// ufCrm19_1684137925 - Площадь метерр погонный
// ufCrm19_1684137950 - Площадь м2
// ufCrm19_1684138153 - Ссылка на источник клиента
// ufCrm19_1684142357 - Файлы клиента


export {update};