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
        return this.checkFields_(LIST_IGNORE_CHECK_FIELDS_DEAL, dealData);
    }

    isCheckProductsData(productsData) {        
        for (let productData of productsData) {
            if (!this.checkFields_(LIST_IGNORE_CHECK_FIELDS_PRODUCTS, productData)) {
                return false;
            }   
        }
        return true;
    }

    async isTaskOrder(deal_data) {
        if (!deal_data[FIELD_ID_TASK_ORDER]) {
            return false;
        }
        let taskData = await bx24TaskGet(this.bx24, deal_data[FIELD_ID_TASK_ORDER]);
        console.log("taskData = ", taskData);
        if (taskData) {
            return true;
        }
        return false;
    }

    isTaskProduction(deal_data) {
        if (deal_data[FIELD_ID_TASK_PRODUCTION]) {
            return true;
        }
        return false;
    }

    checkFields_(listIgnore, objData) {
        for (let key in objData) {
            if (listIgnore.includes(key)) {
                continue;
            }
            if (Number.isInteger(objData[key])) {
                continue;
            }
            if (!objData[key] || Array.isArray(objData[key]) && objData[key].length === 0) {
                return false;
            }
        }

        return true;    
    }
}