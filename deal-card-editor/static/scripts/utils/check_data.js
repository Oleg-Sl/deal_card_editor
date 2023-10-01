import {
    FIELD_ID_TASK_PRODUCTION,
    FIELD_ID_TASK_ORDER,

    LIST_IGNORE_CHECK_FIELDS_DEAL,
    LIST_IGNORE_CHECK_FIELDS_PRODUCTS,
} from "../parameters.js"


import {
    bx24TaskGet,
} from "../bx24/api.js"


export class CheckData {
    constructor(bx24) {
        this.bx24 = bx24;
    }

    isCheckDealData(dealData) {
        console.log("dealData = ", dealData);
        return this.checkFields_(dealData, LIST_IGNORE_CHECK_FIELDS_DEAL);
    }

    isCheckProductsData(productsData) {
        for (const productData of productsData) {
            if (!this.checkFields_(productData, LIST_IGNORE_CHECK_FIELDS_PRODUCTS)) {
                return false;
            }
        }
        return true;
    }

    async isTaskOrder(dealData) {
        if (!dealData[FIELD_ID_TASK_ORDER]) {
            return false;
        }
        let taskData = NaN;
        try {
            taskData = await bx24TaskGet(this.bx24, dealData[FIELD_ID_TASK_ORDER]);
        } catch (error) {
            console.error("Произошла ошибка при получении задачи:", error);
        }
        if (Array.isArray(taskData) && taskData.length === 0) {
            return false;
        }
        return true;
    }

    isTaskProduction(dealData) {
        return !!dealData[FIELD_ID_TASK_PRODUCTION];
    }

    checkFields_(objData, ignoreFields = []) {
        for (const key in objData) {
            if (ignoreFields.includes(key)) {
                continue;
            }
            if (Number.isInteger(objData[key])) {
                continue;
            }
            if (!objData[key] || (Array.isArray(objData[key]) && objData[key].length === 0)) {
                return false;
            }
        }
        return true;
    }
}