import {
    BIZPROC_CREATE_TASK,
    SMART_FIELDS,
    LIST_TECHNOLOGY,
    LIST_FILMS,
    LIST_WIDTH_FILMS,
    FIELD_OBSERVERS,
    FIELD_RESPONSIBLE_MOS,
    FIELD_DESC_ORDER,
    FIELD_BUSINESS_TRIP,
    FIELD_METERING,
    FIELD_DISMANTLING,
    FIELD_PARKING,
    FIELD_COLOR_PROOF,
    FIELD_INSTALL,
    FIELD_OURDETAILS,
    FIELD_BOXING_RENTAL,
    FIELD_INSTALL_ON_TERRIT,
} from '../parameters.js';

import {
    bx24TaskUpdate,
    bx24TaskAdd,
    bx24BizprocStartFOrDeal,
    bx24TaskAddComment,
} from '../bx24/api.js'

import {
    sleep,
} from './funcs.js'

// Список имен полей со свойствами заказа
const FIELDS_FOR_TABLE_TASK_ = [FIELD_BUSINESS_TRIP, FIELD_METERING, FIELD_DISMANTLING, FIELD_PARKING, FIELD_COLOR_PROOF, FIELD_INSTALL, FIELD_OURDETAILS, FIELD_BOXING_RENTAL, FIELD_INSTALL_ON_TERRIT];


class Task {
    constructor(bx24) {
        this.bx24 = bx24;

        // данные полей сделки
        this.fieldsData = NaN;
    }

    init(fieldsData) {
        this.fieldsData = fieldsData;
    }

    async updateTask(taskId, dataDeal, dataProducts, contactMeasure) {
        try {
            let descTask = this.getDescTask_(dataDeal, dataProducts, contactMeasure);
            let newDataTask = {
                RESPONSIBLE_ID: dataDeal[FIELD_RESPONSIBLE_MOS],
                AUDITORS: dataDeal[FIELD_OBSERVERS],           // Наблюдатели
                DESCRIPTION: descTask,
            }
            bx24TaskUpdate(this.bx24, taskId, newDataTask);
        } catch(err) {
            console.error(`${err.name}: ${err.message}`);
        }
    }

    async createTask(dealId, dataDeal, dataProducts, contactMeasure) {
        try {
            let descTask = this.getDescTask_(dataDeal, dataProducts, contactMeasure);
            let paramsBizProc = {
                description: descTask,
            };
            await bx24BizprocStartFOrDeal(this.bx24, BIZPROC_CREATE_TASK, dealId, paramsBizProc);
            await sleep(2000);
            // let data = {
            //     TITLE: `🎯 | {{№ Заказа}} | {{Название}} | Заказ (0)`,
            //     CREATED_BY: "",
            //     RESPONSIBLE_ID: "",

            // }
            // bx24TaskAdd(this.bx24, {
            // });
            // await this.createTaskIntoBX24_(taskId, newDataTask);
        } catch(err) {
            console.error(`${err.name}: ${err.message}`);
        }

    }

    async addComment(taskId, responsible, dealChanged, productsChanged) {
        let msgToUser = `[USER=${responsible.ID}]${responsible.LAST_NAME || ""} ${responsible.NAME || ""}[/USER], ВНИМАНИЕ! Задача изменена.`;
        msgToUser += dealChanged;
        msgToUser += productsChanged;
        await bx24TaskAddComment(this.bx24, taskId, msgToUser, this.currentUser.ID);
    }

    getDescTask_(dataDeal, dataProducts, contactMeasure) {
        let descTask = "";
        descTask += "[B]Что делаем по заказу в целом:[/B]";
        descTask += `\n`;
        descTask += dataDeal[FIELD_DESC_ORDER];
        descTask += `\n`;
        descTask += this.getDataTask_(FIELDS_FOR_TABLE_TASK_, dataDeal, contactMeasure);
        descTask += `\n`;
        descTask += this.getDataProductsTable_(dataProducts);
        return descTask;
    }

    getDataTask_(fields, data, contactMeasure) {
        let phoneMeasure = this.getPhoneNumber_(contactMeasure.PHONE);
        let titleContactMeasure = `${contactMeasure.NAME || ""} ${contactMeasure.LAST_NAME || ""} ${contactMeasure.SECOND_NAME || ""} ${phoneMeasure}`;
        let content = "";
        for (let field of fields) {
            content+= `
                [TR]
                    [TD][B]${this.fieldsData[field].listLabel}[/B][/TD] 
                    [TD]${this.getValueByKey_(this.fieldsData[field].items, data[field])}[/TD]
                [/TR]
            `;
        }
        content+= `
            [TR]    
                [TD][B]Контакт:[/B][/TD]
                [TD][URL=https://007.bitrix24.ru/crm/contact/details/${contactMeasure.ID || ""}/]${titleContactMeasure}[/URL][/TD]
            [/TR]
        `;
        content+= `
            [TR]    
                [TD][B]Написать в Whats App[/B][/TD]
                [TD][URL=https://wa.me/${phoneMeasure}/][/URL][/TD]
            [/TR]
        `;
        return `[TABLE]${content}[/TABLE]`;
    }

    getDataProductsTable_(productsData) {
        let contentTableBody = "";
        for (let productData of productsData) {
            contentTableBody += `
                [TR]
                    [TD]${productData[SMART_FIELDS.TITLE] || "-"}[/TD]
                    [TD]${productData[SMART_FIELDS.COUNT_PIECES] || "-"}[/TD]
                    [TD]${this.getValueByKey_(LIST_TECHNOLOGY, productData[SMART_FIELDS.TECHNOLOGY])}[/TD]
                    [TD]${this.getValueByKey_(LIST_FILMS, productData[SMART_FIELDS.FILM])}[/TD]
                    [TD]${productData[SMART_FIELDS.LAMINATION] || "-"}[/TD]
                    [TD]${this.getValueByKey_(LIST_WIDTH_FILMS[productData[SMART_FIELDS.FILM]] || [], productData[SMART_FIELDS.WIDTH_FILM])}[/TD]
                    [TD]${productData[SMART_FIELDS.LINEAR_METER_PIECES] || "-"}[/TD]
                    [TD]${productData[SMART_FIELDS.SQUARE_METER_PIECES] || "-"}[/TD]
                    [TD]${productData[SMART_FIELDS.LINEAR_METER_TOTAL] || "-"}[/TD]
                    [TD]${productData[SMART_FIELDS.SQUARE_METER_TOTAL] || "-"}[/TD]
                    [TD][URL=${productData[SMART_FIELDS.LINK_SRC] || "-"}]${productData[SMART_FIELDS.LINK_SRC] || "-"}[/URL][/TD]\
                    [TD]${this.getUrlFiles_(productData[SMART_FIELDS.CLIENT_FILES])}[/TD]
                    [TD]${this.getUrlFiles_(productData[SMART_FIELDS.PREPRESS])}[/TD]
                    [TD]${productData[SMART_FIELDS.COMMENT] || "-"}[/TD]
                [/TR]
            `;
        }
        let contentTable = `
            [TABLE]
                [TR]
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
                [/TR]
                ${contentTableBody}
            [/TABLE]
        `;
        return contentTable;
    }

    getValueByKey_(items, itemKey) {
        let itemValue = "-";
        for (let item of items) {
            if (item.ID == itemKey) {
                itemValue = item.VALUE;
            }
        }
        return itemValue;
    }

    getUrlFiles_(filesDataStrings) {
        let data = "";
        for (let fileDataString of filesDataStrings) {
            try {
                let fileData = this.parseFileDataString_(fileDataString, ";");
                data += `[URL=${fileData.url}]${fileData.name}[/URL] <br>`;
            } catch {
                console.error("Не удалось получить данные файла из строки");
            }
        }
        return data || "-";
    }

    parseFileDataString_(dataString, delimiter) {
        let parts = dataString.split(delimiter);
        if (parts.length !== 3) {
            throw new Error('Некорректный формат строки данных файла.');
        }

        let fileData = {
            name: parts[0].trim(),
            size: parts[1].trim(),
            url:  parts[2].trim()
        };

        return fileData;
    }

    getPhoneNumber_(phones) {
        if (Array.isArray(phones)) {
            for (let phone of phones) {
                let phoneNumber = this.formatPhoneNumber_(phone.VALUE);
                if (phoneNumber) {
                    return phoneNumber;
                }
            }
        }
        return "-";
    }

    formatPhoneNumber_(phoneNumber) {
        let formattedPhoneNumber = phoneNumber;
        if (phoneNumber.length >=11 && phoneNumber[0] == "8") {
            formattedPhoneNumber = "+7" + phoneNumber.slice(1);
        } else if (phoneNumber.length >=11 && phoneNumber[0] == "7") {
            formattedPhoneNumber =  "+" + phoneNumber;
        }
        return formattedPhoneNumber;
    }

}

export {Task};
