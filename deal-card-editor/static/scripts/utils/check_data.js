import {
    FIELD_ID_TASK_PRODUCTION,

    LIST_IGNORE_CHECK_FIELDS_DEAL,
    LIST_IGNORE_CHECK_FIELDS_PRODUCTS,
} from "../parameters.js"


export class CheckData {
    constructor() {

    }

    isCheckDealData(dealData) {
        console.log("dealData = ", dealData);
        return this.checkFields_(LIST_IGNORE_CHECK_FIELDS_DEAL, dealData);
    }

    isCheckProductsData(productsData) {        
        for (let productData of productsData) {
            console.log("productData = ", productData);
            if (!this.checkFields_(LIST_IGNORE_CHECK_FIELDS_PRODUCTS, productData)) {
                return true;
            }   
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
            console.log(key, " = ", objData[key]);
            if (Number.isInteger(objData[key])) {
                continue;
            }
            if (!objData[key] || Array.isArray(objData[key]) && objData[key].length === 0) {
                console.log(false);
                return false;
            }
        }

        return true;    
    }
}