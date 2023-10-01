import {
    bx24UserGetDataByIds,
} from "../bx24/api.js"

import {
    SMART_FIELDS,
    LIST_TECHNOLOGY,
    LIST_FILMS,
    LIST_LAMINATIONS,
    LIST_WIDTH_FILMS,
} from "../parameters.js"


class DealDataComparator {
    constructor(bx24) {
        this.bx24 = bx24;
        this.fieldsDeal = NaN;
    }

    init(fields) {
        this.fieldsDeal = fields;
    }

    async getChanged(oldValues, newValues) {
        try {
            let resultString = "";
            let changedValues = this.findChanged_(oldValues, newValues);
            for (const key in changedValues) {
                if (!changedValues.hasOwnProperty(key)) {
                    continue;
                }
                const objChange = changedValues[key];
                let objChangeText = {};
                if (Array.isArray(objChange.oldValue) && Array.isArray(objChange.newValue)) {
                    objChangeText = await this.getTextChangeForMultiple_(key, objChange);
                } else {
                    objChangeText = await this.getTextChangeForSingle_(key, objChange);
                }
                resultString += `
                    [TR]
                        [TD]${objChangeText.name}[/TD]
                        [TD]${objChangeText.oldValue}[/TD]
                        [TD]${objChangeText.newValue}[/TD]
                    [/TR]
                `;
            }
    
            if (resultString == "") {
                return resultString;
            }
    
            return `
                [TABLE]
                    [TR]
                        [TD][B]Свойство[/B][/TD]
                        [TD][B]Старое[/B][/TD]
                        [TD][B]Новое[/B][/TD]
                    [/TR]
                    ${resultString}
                [/TABLE]
            `;
        } catch(err) {
            console.error(`${err.name}: ${err.message}`);
        }
    }

    findChanged_(oldValues, newValues) {
        const changedValues = {};
        for (const key in oldValues) {
            if (oldValues.hasOwnProperty(key) && newValues.hasOwnProperty(key)) {
                if (Array.isArray(oldValues[key]) && Array.isArray(newValues[key])) {
                    if (oldValues[key].length === 0 && newValues[key].length === 0) {
                        continue;
                    }
                    let oldValue = this.getArrayDifference_(oldValues[key], newValues[key]);
                    let newValue = this.getArrayDifference_(newValues[key], oldValues[key]);
                    if (oldValue.length === 0 && newValue.length === 0) {
                        continue;
                    }
                    changedValues[key] = {
                        oldValue: oldValues[key],
                        newValue: newValues[key],
                    };
                } else if (oldValues[key] != newValues[key]) {
                    changedValues[key] = {
                        oldValue: oldValues[key],
                        newValue: newValues[key],
                    };
                }
            }
        }

        return changedValues;
    }

    async getTextChangeForMultiple_(key, objChange) {
        if (!this.fieldsDeal.hasOwnProperty(key)) {
            return "";
        }
        let objChangeText = {};
        let field = this.fieldsDeal[key];
        if (field.type == "employee" || field.type == "user") {
            const usersData = await bx24UserGetDataByIds(this.bx24, [...objChange.oldValue, ...objChange.newValue]);
            objChangeText.name = field.listLabel || field.title;
            objChangeText.oldValue = this.getTextUsers_(objChange.oldValue, usersData);
            objChangeText.newValue = this.getTextUsers_(objChange.newValue, usersData);
        } else {
            objChangeText.name = field.listLabel || field.title;
            objChangeText.oldValue = objChange.oldValue.join(', ');
            objChangeText.newValue = objChange.newValue.join(', ');
        }
        return objChangeText;
    }

    getTextUsers_(userIds, usersData) {
        // let str = "";
        let userArrayText = [];
        for (let userId of userIds) {
            const users = usersData[userId] || [];
            const user = users[0] || {};
            userArrayText.push(`${user.LAST_NAME || ""} ${user.NAME || ""}\n`);
            // str += `${user.LAST_NAME || ""} ${user.NAME || ""}\n`;
        }
        return userArrayText.join(', ');
    }

    async getTextChangeForSingle_(key, objChange) {
        if (!this.fieldsDeal.hasOwnProperty(key)) {
            return "";
        }
        let objChangeText = {};
        let field = this.fieldsDeal[key];
        if (field.type == "employee" || field.type == "user") {
            const usersData = await bx24UserGetDataByIds(this.bx24, [objChange.oldValue, objChange.newValue]);
            const userOlds = usersData[objChange.oldValue] || [];
            const userNews = usersData[objChange.newValue] || [];
            const userOld = userOlds[0] || {};
            const userNew = userNews[0] || {};
            objChangeText.name = field.listLabel || field.title;
            objChangeText.oldValue = `${userOld.LAST_NAME || ""} ${userOld.NAME || ""}`;
            objChangeText.newValue = `${userNew.LAST_NAME || ""} ${userNew.NAME || ""}`;
        } else if (field.type == "enumeration") {
            objChangeText.name = field.listLabel;
            objChangeText.oldValue = this.findValueById_(objChange.oldValue, field.items);
            objChangeText.newValue = this.findValueById_(objChange.newValue, field.items);
        } else {
            objChangeText.name = field.listLabel || field.title;
            objChangeText.oldValue = objChange.oldValue;
            objChangeText.newValue = objChange.newValue;
        }
        return objChangeText;
    }

    findValueById_(item_id, items) {
        const foundItem = items.find(item => item.ID == item_id);
        return foundItem ? foundItem.VALUE : "";
    }

    getArrayDifference_(arr1, arr2) {
        const difference = [];
    
        for (const item of arr1) {
            if (!arr2.some(elem => item == elem)) {
                difference.push(item);
            }
        }
    
        return difference;
    }
}

class ProductsDataComparator {
    constructor(bx24) {
        this.bx24 = bx24;
        this.fieldsDeal = NaN;
    }

    init(fields) {
        this.fields = fields;
    }

    async getChanged(oldProducts, newProducts) {
        try {
            let content = "";
            if (!Array.isArray(oldProducts) && !Array.isArray(newProducts)) {
                return "";
            }
    
            for (const oldProduct of oldProducts) {
                const newProduct = this.findProductById_(oldProduct.id, newProducts);
                if (newProduct && !oldProduct[SMART_FIELDS.TITLE]) {
                    content += this.createProduct_(newProduct);
                } else if (newProduct) {
                    content += this.compreProducts_(oldProduct, newProduct);
                } else {
                    content += this.removeProduct_(oldProduct);
                }
            }
    
            for (const newProduct of newProducts) {
                const oldProduct = this.findProductById_(newProduct.id, oldProducts);
                if (oldProduct) {
                    continue;
                }
                content += this.createProduct_(newProduct);
            }
    
            return `
                [TABLE]
                    ${content}
                [/TABLE]
            `;
        } catch(err) {
            console.error(`${err.name}: ${err.message}`);
        }
    }

    compreProducts_(oldProduct, newProduct) {
        let content = "";
        for (const key in oldProduct) {
            if (!this.fields.hasOwnProperty(key)) {
                continue;
            }
            const oldValue = oldProduct[key];
            const newValue = newProduct[key];
            const oldFilm = oldProduct[SMART_FIELDS.FILM];
            const newFilm = newProduct[SMART_FIELDS.FILM];
            if (Array.isArray(oldValue) && Array.isArray(newValue)) {
                if (!this.isEqualArray_(oldValue, newValue)) {
                    content += this.getTextArray_(key, oldValue, newValue);
                }
            } else {
                if ((oldValue && newValue || oldValue && !newValue || !oldValue && newValue) && oldValue != newValue) {
                    content += this.getTextValue_(key, oldValue, newValue, oldFilm, newFilm);
                }
            }
        }

        if (content == "") {
            return content;
        }

        return `
            [TR]
                [TD][B][CENTER][COLOR=#ff0000]${oldProduct[SMART_FIELDS.TITLE]}[/COLOR][/CENTER][/B][/TD]
                [TD][B][CENTER][COLOR=#ff0000]==>[/COLOR][/CENTER][/B][/TD]
                [TD][B][CENTER][COLOR=#32CD32]${newProduct[SMART_FIELDS.TITLE]}[/COLOR][/CENTER][/B][/TD]
            [/TR]
            ${content}
        `;

    }
    
    getTextArray_(key, oldValue, newValue) {
        const fieldObj = this.fields[key];
        const oldValueText = this.getUrlFiles_(oldValue);
        const newValueText = this.getUrlFiles_(newValue);
        return `
        [TR]
            [TD][B]${fieldObj.title}[/B][/TD]
            [TD]${oldValueText}[/TD]
            [TD]${newValueText}[/TD]
        [/TR]
    `;
    }

    getTextValue_(key, oldValue, newValue, oldFilm, newFilm) {
        const fieldObj = this.fields[key];
        let oldValueText = "";
        let newValueText = "";
        if (key == SMART_FIELDS.TECHNOLOGY) {
            console.log("SMART_FIELDS.TECHNOLOGY OLD = ", oldValue);
            console.log("SMART_FIELDS.TECHNOLOGY NEW = ", newValue);
            oldValueText = this.findValueById_(oldValue, LIST_TECHNOLOGY);
            newValueText = this.findValueById_(newValue, LIST_TECHNOLOGY);
        } else if (key == SMART_FIELDS.FILM) {
            console.log("SMART_FIELDS.TECHNOLOGY OLD = ", oldValue);
            console.log("SMART_FIELDS.TECHNOLOGY NEW = ", newValue);
            oldValueText = this.findValueById_(oldValue, LIST_FILMS);
            newValueText = this.findValueById_(newValue, LIST_FILMS);
        } else if (key == SMART_FIELDS.WIDTH_FILM) {
            console.log("SMART_FIELDS.TECHNOLOGY OLD = ", oldValue);
            console.log("SMART_FIELDS.TECHNOLOGY NEW = ", newValue);
            oldValueText = this.findValueById_(oldValue, LIST_WIDTH_FILMS[oldFilm] || []);
            newValueText = this.findValueById_(newValue, LIST_WIDTH_FILMS[newFilm] || []);
        } else {
            oldValueText = oldValue;
            newValueText = newValue; 
        }

        return `
            [TR]
                [TD][B]${fieldObj.title}[/B][/TD]
                [TD]${oldValueText}[/TD]
                [TD]${newValueText}[/TD]
            [/TR]
        `;
    }

    createProduct_(product) {
        return `
            [TR]
                [TD][B]Добавлен товар:[/B][/TD]
                [TD][B][COLOR=#32CD32]${product[SMART_FIELDS.TITLE]}[/COLOR][/B][/TD]
                [TD][/TD]
            [/TR]
        `;
    }

    removeProduct_(product) {
        return `
            [TR]
                [TD][B]Удален товар:[COLOR=#ff0000]${product[SMART_FIELDS.TITLE]}[/COLOR][/B][/TD]
            [/TR]
        `;
    }

    changedProduct_() {

    }

    findProductById_(productId, prouducts) {
        const foundItem = prouducts.find(item => item.id == productId);
        return foundItem;
    }

    findValueById_(itemId, items) {
        const foundItem = items.find(item => item.ID == itemId);
        return foundItem ? foundItem.VALUE : "";
    }

    isEqualArray_(arr1, arr2) {    
        for (const item of arr1) {
            if (!arr2.includes(item)) {
                return false;
            }
        }
        for (const item of arr2) {
            if (!arr1.includes(item)) {
                return false;
            }
        }
        return true;
    }

    getUrlFiles_(filesDataStrings) {
        let data = [];
        for (let fileDataString of filesDataStrings) {
            try {
                let fileData = this.parseFileDataString_(fileDataString, ";");
                data.push(`[URL=${fileData.url}]${fileData.name}[/URL]`);
            } catch {
                console.error("Не удалось получить данные файла из строки");
            }
        }
        return data.join('\n');
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
}

export {DealDataComparator, ProductsDataComparator};
