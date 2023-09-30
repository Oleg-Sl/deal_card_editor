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
        const foundItem = items.find(item => item.ID === item_id);
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
        console.log("Products Fields = ", this.fields);
    }

    async findChaged_(oldProducts, newProducts) {
        console.log("oldProducts = ", oldProducts);
        console.log("newProducts = ", newProducts);
        let content = "";
        if (!Array.isArray(oldProducts) && !Array.isArray(newProducts)) {
            return "";
        }

        for (const oldProduct of oldProducts) {
            const newProduct = this.findProductById_(oldProduct.id, newProducts);
            if (newProduct) {
                content += this.compreProducts_(oldProduct, newProduct);
                continue;
            }
            content += this.removeProduct_(oldProduct);
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
                content += "";
            } else {
                if (oldValue != newValue) {
                    console.log("*************************");
                    console.log("oldValue = ", oldValue);
                    console.log("newValue = ", newValue);
                    content += this.getTextValue_(key, oldValue, newValue, oldFilm, newFilm);
                }
            }
        }

        if (content == "") {
            return content;
        }

        return `
            [TR]
            [CENTER]Текст[/CENTER]
                [TD][B][CENTER][COLOR=#ff0000]${oldProduct[SMART_FIELDS.TITLE]}[/COLOR][/CENTER][/B][/TD]
                [TD][B][CENTER][COLOR=#ff0000]==>[/COLOR][/CENTER][/B][/TD]
                [TD][B][CENTER][COLOR=#32CD32]${newProduct[SMART_FIELDS.TITLE]}[/COLOR][/CENTER][/B][/TD]
            [/TR]
            ${content}
        `;

    }
    
    getTextValue_(key, oldValue, newValue, oldFilm, newFilm) {
        const fieldObj = this.fields[key];
        let oldValueText = "";
        let newValueText = "";
        if (key == SMART_FIELDS.TECHNOLOGY) {
            oldValueText = this.findValueById_(oldValue, LIST_TECHNOLOGY);
            newValueText = this.findValueById_(newValue, LIST_TECHNOLOGY);
        } else if (key == SMART_FIELDS.FILM) {
            oldValueText = this.findValueById_(oldValue, LIST_FILMS);
            newValueText = this.findValueById_(newValue, LIST_FILMS);
        } else if (key == SMART_FIELDS.WIDTH_FILM) {
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
                [TD][B]Добавлен товар: [COLOR=#32CD32]${product[SMART_FIELDS.TITLE]}[/COLOR][/B][/TD]
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
        const foundItem = prouducts.find(item => item.id === productId);
        return foundItem;
    }

    findValueById_(itemId, items) {
        const foundItem = items.find(item => item.ID === itemId);
        return foundItem ? foundItem.VALUE : "";
    }

    // findChagedInProducts(oldProducts, newProducts) {
    //     // console.log("oldProducts = ", oldProducts);
    //     // console.log("newProducts = ", newProducts);
    //     if (!Array.isArray(oldProducts) && !Array.isArray(newProducts)) {
    //         return "";
    //     }
    //     const changedProductsArray = [];
    //     for (let i = 0; i < newProducts.length; i++) {
    //         const newItem = newProducts[i];
    //         const oldItem = oldProducts.find(item => item.id === newItem.id);
    //         let changeObj = {};
    //         // console.log("newItem = ", newItem);
    //         // console.log("oldItem = ", oldItem);
    //         if (oldItem) {
    //             const changedValues = this.findChangedValues(oldItem, newItem);
    //             if (Object.keys(changedValues).length > 0) {
    //                 changeObj[newItem.id] = changedValues;
    //                 changedProductsArray.push(changeObj);
    //             }
    //         } else {
    //             changeObj[newItem.id] = {};
    //             changedProductsArray.push(changeObj);
    //         }
    //     }
    //     return changedProductsArray;
    // }

}

export {DealDataComparator, ProductsDataComparator};
