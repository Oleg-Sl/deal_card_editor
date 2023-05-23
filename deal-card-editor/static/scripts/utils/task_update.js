import Bitrix24 from '../bx24/requests.js'


async function update(dataDealNew, dataDealOld, dataProducts, fields) {
    let taskId = dataDealOld.UF_CRM_1661089895;
    let desc = await getDescription(dataDealNew, dataDealOld, dataProducts, fields);
    let data = {
        RESPONSIBLE_ID: dataDealNew.UF_CRM_1619700503,     // Исполнитель МОС
        AUDITORS: dataDealNew.UF_CRM_1684305731,           // Наблюдатели
        DESCRIPTION: desc,
    }
    // console.log("taskId = ", taskId);
    // console.log("taskData =", data);
    await updateTaskOrderToBx24(taskId, data);
}


async function getDescription(dataDealNew, dataDealOld, dataProducts, fields) {
    let response = await getDataFromBx24(dataDealOld.CONTACT_ID, dataDealOld.COMPANY_ID, dataDealNew.UF_CRM_1621943311);
    let contact = (Array.isArray(response.contact) ? response.contact[0] : {}) || {};
    let company = (Array.isArray(response.company) ? response.company[0] : {}) || {};
    let contactMeasurement = Array.isArray(response.contact_measurement) ? response.contact_measurement[0] : {};
    let contactMeasurementText = typeof contactMeasurement === 'object' ? getValidPhone(contactMeasurement.PHONE) : "";
    let desc = `
${dataDealNew.UF_CRM_1655918107 || ""}
____________
Согласно ЦП:${getValueByKey(fields.UF_CRM_1640199620.items, dataDealNew.UF_CRM_1640199620)}
Нужен Замер: ${getValueByKey(fields.UF_CRM_1619441905773.items, dataDealNew.UF_CRM_1619441905773)}
Демонтаж: ${getValueByKey(fields.UF_CRM_1657651541.items, dataDealNew.UF_CRM_1657651541)}
____________

____________
Ссылки: ${arrToSring(dataDealOld.UF_CRM_1625591420)}
CRM / Тендер: ${dataDealOld.UF_CRM_1620918041}
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
    let tbody = "[TR][TD][B]Описание[/B][/TD][TD][B]Количество[/B][/TD][TD][B]Технология изготовления[/B][/TD][TD][B]Ширина пленки[/B][/TD][TD][B]Площадь м.пог.[/B][/TD][TD][B]Площадь м2[/B][/TD][TD][B]Ссылка на источник клиента[/B][/TD][TD][B]Файлы клиента[/B][/TD][/TR]"
    for (let product of products) {
        tbody += `[TR][TD]${product.ufCrm19_1684137706}[/TD][TD]${product.ufCrm19_1684137811}[/TD][TD]${getValueByKey(itemsdManufactTechn, product.ufCrm19_1684137822)}[/TD]
[TD]${getValueByKey(itemsFilmWidth, product.ufCrm19_1684137877)}[/TD][TD]${product.ufCrm19_1684137925}[/TD][TD]${product.ufCrm19_1684137950}[/TD]
[TD][URL=${product.ufCrm19_1684138153}]${product.ufCrm19_1684138153}[/URL][/TD][TD]${getUrlFiles(product.ufCrm19_1684142357)}[/TD][/TR]`
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
// UF_CRM_1619700503 - Ответственный МОС
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