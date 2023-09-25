import Bitrix24 from '../bx24/requests.js'
import { SMART_FIELDS, LIST_TECHNOLOGY, LIST_FILMS,
    LIST_LAMINATIONS, LIST_WIDTH_FILMS, LIST_COUNT_SIDES} from '../parameters.js';


const RESPONSIBLE_MOS = "UF_CRM_1672839295";    //"UF_CRM_1619700503";
const OBSERVER = "UF_CRM_1684305731";


// const SMART_FIELDS = {
//     TECHNOLOGY:    "ufCrm21_1694680011",  // Технология изготовления
//     FILM:          "ufCrm21_1694679978",  // Пленка
//     LAMINATION:    "ufCrm21_1694680039",  // Ламинация
//     WIDTH_FILM:    "ufCrm21_1694680085",  // Ширина пленки
//     LINEAR_METER:  "ufCrm21_1694680054",  // П.м.
//     LENGTH_AREA:   "ufCrm21_1694680115",  // Длина, м
//     HEIGHT_AREA:   "ufCrm21_1694680100",  // Высота, м
//     COUNT_SIDE:    "ufCrm21_1694680138",  // Кол-во бортов
//     COUNT_CARS:    "ufCrm21_1694680127",  // Кол-во авто
//     SQUARE_METERS: "ufCrm21_1694680155",  // Кв.м. монтажа
//     LINK_SRC:      "ufCrm21_1694680292",  // Ссылка на исходники клиента
//     COMMENT:       "ufCrm21_1694680324",  // Комментарии
//     CLIENT_FILES:  "ufCrm21_1694680404"   // Файлы клиента
// };

// const LIST_TECHNOLOGY = [
//     {ID: 0, VALUE: "печать"},
//     {ID: 1, VALUE: "плоттерная резка"},
//     {ID: 2, VALUE: "печать+контурная резка"},
// ];
// const LIST_FILMS = [
//     {ID: 0, VALUE: "ORAJET 3640"},
//     {ID: 1, VALUE: "ORAJET 3551"},
//     {ID: 2, VALUE: "Китай 010"},
//     {ID: 3, VALUE: "ORACAL 641"},
//     {ID: 4, VALUE: "ORACAL 551"},
//     {ID: 5, VALUE: "Другое (указать в комментариях)"},
// ];
// const LIST_LAMINATIONS = [
//     {ID: 0, VALUE: "ORAJET 3640 G"},
//     {ID: 1, VALUE: "ORAJET 3640 M"},
//     {ID: 2, VALUE: "ORAGARD 215 G"},
//     {ID: 3, VALUE: "ORAGARD 215 M"},
//     {ID: 4, VALUE: "Китай G"},
//     {ID: 5, VALUE: "Китай M"},
//     {ID: 6, VALUE: "нет"},
// ];
// const LIST_WIDTH_FILMS = {
//     "0": [
//         {ID: 0, VALUE: "1"},
//         {ID: 1, VALUE: "1,05"},
//         {ID: 2, VALUE: "1,26"},
//         {ID: 3, VALUE: "1,37"},
//         {ID: 4, VALUE: "1,52"},
//         {ID: 5, VALUE: "1,6"},
//     ],
//     "1": [
//         {ID: 0, VALUE: "1,26"},
//         {ID: 1, VALUE: "1,37"},
//     ],
//     "2": [
//         {ID: 0, VALUE: "1,07"},
//         {ID: 1, VALUE: "1,27"},
//         {ID: 2, VALUE: "1,37"},
//         {ID: 3, VALUE: "1,52"},
//     ],
//     "3": [
//         {ID: 0, VALUE: "1"},
//         {ID: 1, VALUE: "1,26"},
//     ],
//     "4": [
//         {ID: 0, VALUE: "1,26"},
//     ],
//     "5": []
// };
// const LIST_COUNT_SIDES = [
//     {ID: 0, VALUE: 1},
//     {ID: 1, VALUE: 2},
// ];



async function update(dataDealNew, dataDealOld, dataProducts, fields) {
    let taskId = dataDealOld.UF_CRM_1661089895;
    console.log("dataDealNew = ", dataDealNew);
    console.log("dataDealOld = ", dataDealOld);
    let desc = await getDescription(dataDealNew, dataDealOld, dataProducts, fields);
    let data = {
        // RESPONSIBLE_ID: dataDealNew[RESPONSIBLE_MOS],     // Исполнитель МОС
        AUDITORS: dataDealNew[OBSERVER],           // Наблюдатели
        DESCRIPTION: desc,
    }
    // if (dataDealNew[RESPONSIBLE_MOS]) {
    //     // Исполнитель МОС
    //     data["RESPONSIBLE_ID"] = dataDealNew[RESPONSIBLE_MOS];
    // }
    // console.log("taskId = ", taskId);
    // console.log("taskData =", data);
    await updateTaskOrderToBx24(taskId, data);
}


function getValidData(str) {
    return str.replace(/<strong\b[^>]*>(.*?)<\/strong>/gi, "<b>$1</b>").replace(/<em\b[^>]*>(.*?)<\/em>/gi, "<i>$1</i>").replace(/<p>(.*?)<\/p>/gi, '\n$1');
}


async function getDescription(dataDealNew, dataDealOld, dataProducts, fields) {
    let response = await getDataFromBx24(dataDealOld.CONTACT_ID, dataDealOld.COMPANY_ID, dataDealNew.UF_CRM_1621943311);
    let contact = (Array.isArray(response.contact) ? response.contact[0] : {}) || {};
    let company = (Array.isArray(response.company) ? response.company[0] : {}) || {};
    let contactMeasurement = Array.isArray(response.contact_measurement) ? response.contact_measurement[0] : {};
    let contactMeasurementText = typeof contactMeasurement === 'object' ? getValidPhone(contactMeasurement.PHONE) : "";
    
    // ${getValidData(dataDealNew.UF_CRM_1655918107 || "")}
    // ${getValidData(dataDealNew.UF_CRM_1687857777 || "")}
    let desc = `
${getValidData(dataDealNew.UF_CRM_1655918107 || "")}
____________
Согласно ЦП:${getValueByKey(fields.UF_CRM_1640199620.items, dataDealNew.UF_CRM_1640199620)}
Нужен Замер: ${getValueByKey(fields.UF_CRM_1619441905773.items, dataDealNew.UF_CRM_1619441905773)}
Демонтаж: ${getValueByKey(fields.UF_CRM_1657651541.items, dataDealNew.UF_CRM_1657651541)}
____________

____________
Ссылки: ${dataDealOld.UF_CRM_1625591420}
CRM / Тендер: ${dataDealNew.UF_CRM_1620918041 || ""}
____________
Контакт: [URL=https://007.bitrix24.ru/crm/contact/details/${dataDealOld.UF_CRM_1621943311}/]${contact.NAME} ${contact.LAST_NAME} ${contact.SECOND_NAME} ${contactMeasurementText}[/URL]
Написать в Whats App [URL=https://wa.me/${contactMeasurementText}/][/URL]
____________
Компания: [URL=https://007.bitrix24.ru/crm/company/details/${dataDealOld.COMPANY_ID}/] ${company.TITLE} ${arrToSring(company.PHONE)}[/URL]

${getDataTable(dataProducts, fields.UF_CRM_1625666854.items, fields.UF_CRM_1672744985962.items)}
`
    return desc
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
            [TD]${product[SMART_FIELDS.TITLE]}[/TD]
            [TD]${product[SMART_FIELDS.COUNT_PIECES]}[/TD]
            [TD]${getValueByKey(LIST_TECHNOLOGY, product[SMART_FIELDS.TECHNOLOGY])}[/TD]
            [TD]${getValueByKey(LIST_FILMS, product[SMART_FIELDS.FILM])}[/TD]
            [TD]${product[SMART_FIELDS.LAMINATION]}[/TD]
            [TD]${getValueByKey(LIST_WIDTH_FILMS[product[SMART_FIELDS.FILM]] || [], product[SMART_FIELDS.WIDTH_FILM])}[/TD]
            [TD]${product[SMART_FIELDS.LINEAR_METER_PIECES] || ""}[/TD]
            [TD]${product[SMART_FIELDS.SQUARE_METER_PIECES] || ""}[/TD]
            [TD]${product[SMART_FIELDS.LINEAR_METER_TOTAL] || ""}[/TD]
            [TD]${product[SMART_FIELDS.SQUARE_METER_TOTAL] || ""}[/TD]
            [TD][URL=${product[SMART_FIELDS.LINK_SRC] || "-"}]${product[SMART_FIELDS.LINK_SRC] || "-"}[/URL][/TD]\
            [TD]${getUrlFiles(product[SMART_FIELDS.CLIENT_FILES])}[/TD]
            [TD]${getUrlFiles(product[SMART_FIELDS.PREPRESS])}[/TD]
            [TD]${product[SMART_FIELDS.COMMENT] || ""}[/TD]
        [/TR]`;
    }
    let data = `
[TABLE]
${tbody}
[/TABLE]
    `
    return data
}



// const FIELD_PRODUCTS_MANUFACTURING_TECHNOLOGY = "ufCrm19_1689155340";
// const FIELD_PRODUCTS_FILM_WIDTH = "ufCrm19_1689155449";
// const FIELD_PRODUCTS_AREA_RUNNING_METERS = "ufCrm19_1689155525";
// const FIELD_PRODUCTS_AREA_SQUARE_METERS = "ufCrm19_1689155598";
// function listToStr(lst) {
//     let str = "";
//     for (let item of lst) {
//         str += `${item}\n`;
//     }
//     return str;
// }
// function getManufactTechnById(itemsdManufactTechn, idsListManufactTechn) {
//     let str = "";
//     for (let idManufactTechn of idsListManufactTechn) {
//         str += `${getValueByKey(itemsdManufactTechn, idManufactTechn)}\n`;
//     }
//     return str;
// }

// function getFilmWidthById(itemsFilmWidth, idsListFilmWidth) {
//     let str = "";
//     for (let idFilmWidth of idsListFilmWidth) {
//         str += `${getValueByKey(itemsFilmWidth, idFilmWidth)}\n`;
//     }
//     return str;
// }

// function getDataTable(products, itemsdManufactTechn, itemsFilmWidth) {
//     let tbody = "[TR][TD][B]Описание[/B][/TD][TD][B]Количество[/B][/TD][TD][B]Технология изготовления[/B][/TD][TD][B]Ширина пленки[/B][/TD][TD][B]Площадь м.пог.[/B][/TD][TD][B]Площадь м2[/B][/TD][TD][B]Ссылка на источник клиента[/B][/TD][TD][B]Файлы клиента[/B][/TD][/TR]"
//     for (let product of products) {
//         tbody += `[TR]
// [TD]${product.ufCrm19_1684137706 || ""}[/TD]
// [TD]${product.ufCrm19_1684137811 || ""}[/TD]
// [TD]${getManufactTechnById(itemsdManufactTechn, product[FIELD_PRODUCTS_MANUFACTURING_TECHNOLOGY])}[/TD]
// [TD]${getFilmWidthById(itemsFilmWidth, product[FIELD_PRODUCTS_FILM_WIDTH])}[/TD]
// [TD]${listToStr(product[FIELD_PRODUCTS_AREA_RUNNING_METERS])}[/TD]
// [TD]${listToStr(product[FIELD_PRODUCTS_AREA_SQUARE_METERS])}[/TD]
// [TD][URL=${product.ufCrm19_1684138153 || "-"}]${product.ufCrm19_1684138153 || "-"}[/URL][/TD]
// [TD]${getUrlFiles(product.ufCrm19_1684142357)}[/TD][/TR]`
//     }
//     let data = `
// [TABLE]
// ${tbody}
// [/TABLE]
//     `
//     return data
// }


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
    let itemValue = "";
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
        // let {name, size, url} = file_data.split(";")
        data += `[URL=${tmp_[2]}]${tmp_[0]}[/URL] <br>`
    }
    return data
}


async function getDataFromBx24(contactId, companyId, contactMasurementId) {
    let bx24 = new Bitrix24();
    // let reqPackage = {
    //     contact: `crm.contact.list?filter[ID]=${contactId}&select[]=NAME&select[]=LAST_NAME&select[]=SECOND_NAME`,
    //     company: `crm.company.list?filter[ID]=${companyId}&select[]=TITLE&select[]=PHONE`,
    //     contact_measurement: `crm.contact.list?filter[ID]=${contactMasurementId}&select[]=PHONE`,
    // };
    let reqPackage = {
        contact: ["crm.contact.list", {filter: {ID: contactId}, select: ["NAME", "LAST_NAME","SECOND_NAME"]}],
        company: ["crm.company.list", {filter: {ID: companyId}, select: ["TITLE", "PHONE"]}],
        contact_measurement: ["crm.contact.list", {filter: {ID: contactMasurementId}, select: ["PHONE"]}],
    };
    // console.log(reqPackage);
    let response = await bx24.batchMethod(reqPackage);
    // console.log(response);
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
    // console.log(response);
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