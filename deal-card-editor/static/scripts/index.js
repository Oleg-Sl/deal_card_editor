import InterfaceBlockOne from './interface_block_one.js'
import InterfaceBlockTwo from './interface_block_two.js'
import InterfaceBlockThree from './interface_block_three.js'
import InterfaceBlockFour from './interface_block_four.js'
import InterfaceBlockFive from './interface_block_five.js'

// import Bitrix24 from './bx24/requests_webhook.js'
import Bitrix24 from './bx24/requests.js'
import YandexDisk from './yandex_disk/requests.js'

import {update as updateTaskOrder} from "./utils/task_update.js"


const SETTINGS__SECRETS_KEY = "yandex_secret_key";


class App {
    constructor(dealId, bx24, yaDisk) {
        this.bx24 = bx24;
        this.yaDisk = yaDisk;
        this.dealId = dealId;

        this.smartNumber = 184;

        this.data = null;
        this.fields = null;

        // Первый блок интерфейса
        let elemInterfaceBlockOne = document.querySelector('#taskeditorBoxInterfaceBlockOne');  
        this.interfaceBlockOne = new InterfaceBlockOne(elemInterfaceBlockOne, bx24);

        // Второй блок интерфейса
        let elemInterfaceBlockTwo = document.querySelector('#taskeditorBoxInterfaceBlockTwo');  
        this.interfaceBlockTwo = new InterfaceBlockTwo(elemInterfaceBlockTwo, bx24);

        // Третий блок интерфейса
        let elemInterfaceBlockThree = document.querySelector('#taskeditorBoxInterfaceBlockThree');  
        this.interfaceBlockThree = new InterfaceBlockThree(elemInterfaceBlockThree, bx24, this.windowSearchUser);

        // Четвертый блок интерфейса
        let elemInterfaceBlockFour = document.querySelector('#taskeditorBoxInterfaceBlockFour');  
        this.interfaceBlockFour = new InterfaceBlockFour(elemInterfaceBlockFour, bx24);

        // Пятый блок интерфейса
        let elemInterfaceBlockFive = document.querySelector('#taskeditorBoxInterfaceBlockFive');  
        this.interfaceBlockFive = new InterfaceBlockFive(elemInterfaceBlockFive, bx24, yaDisk, dealId);

        // Модальное окно с настройками приложения
        this.modalSettings = new bootstrap.Modal(document.getElementById('modalSettingApp'), {});
        this.modalFieldSecretKeyYandex = document.querySelector('#modalFieldSecretKeyYandex');
        this.elemBtnSaveSettingsButton = document.querySelector('#saveSettingsButton');

        // Кнопки
        this.elemBtnSaveBottom = document.querySelector('#saveButtonBottom');
        this.elemBtnRewriteBottom = document.querySelector('#rewriteButtonBottom');
        this.elemBtnCancelBottom = document.querySelector('#cancelButtonBottom');
        this.elemBtnSettingsBottom = document.querySelector('#settingsButtonBottom');

    }

    async init() {
        this.data = await this.getDealDataFromBx24(this.dealId);
        this.fields = await this.getDealFieldsFromBx24();
        this.interfaceBlockOne.init();
        this.interfaceBlockTwo.init();
        this.interfaceBlockThree.init();
        this.interfaceBlockFour.init();
        this.interfaceBlockFive.init();
        this.initHandler();
    }

    initHandler() {
        // Сохранение изменений в сделку и БП
        this.elemBtnSaveBottom.addEventListener("click", async (e) => {
            this.saveData();
        })
        // Сохранение изменений в сделку и БП, также изменение данных в задаче
        this.elemBtnRewriteBottom.addEventListener("click", async (e) => {
            console.log("elemBtnRewriteBottom");
            this.updateTask();
        })
        // Отмена изменений
        this.elemBtnCancelBottom.addEventListener("click", async (e) => {
            console.log("elemBtnCancelBottom");
            this.cancelChanging();
        })
        // Открыть модальное окно с настройками
        this.elemBtnSettingsBottom.addEventListener("click", async (e) => {
            this.modalSettings.show();
        })
        // Сохранить настройки
        this.elemBtnSaveSettingsButton.addEventListener("click", async (e) => {
            let seretKeyYandex = this.modalFieldSecretKeyYandex.value;
            // console.log(seretKeyYandex);
            BX24.appOption.set(SETTINGS__SECRETS_KEY, seretKeyYandex);
            this.yaDisk.updateSecretKey(seretKeyYandex);
        })
        // 
        // $(document.body).bind("DOMSubtreeModified", (e) => {
        //     BX24.fitWindow();
        // })
        
    }

    render() {
        this.interfaceBlockOne.render(this.fields, this.data);
        this.interfaceBlockTwo.render(this.fields, this.data);
        this.interfaceBlockThree.render(this.fields, this.data);
        this.interfaceBlockFour.render(this.fields, this.data);
        this.interfaceBlockFive.render(this.fields, this.data, );
    }

    getDataDeal() {
        let data = this.interfaceBlockTwo.getData();
        let users = this.interfaceBlockThree.getData();
        let desc = this.interfaceBlockFour.getData();
        return {...data, ...users, ...desc};
    }

    getDataSmartProcess() {
        let products = this.interfaceBlockFive.getData();
        // let productsOld = this.interfaceBlockFive.getDataOld();
        // let productsNew = this.interfaceBlockFive.getDataNew();
        // return {
        //     dataSmartProcessOld: productsOld,
        //     dataSmartProcessNew: productsNew
        // };
        return products;
    }

    saveData() {
        let dataDeal = this.getDataDeal();
        this.saveDealToBx24(dataDeal);
        let dataSmartProcess = this.getDataSmartProcess();
        this.saveSmartProcessToBx24(dataSmartProcess);
        updateTaskOrder(dataDeal, this.data, this.fields, dataSmartProcess);
    }

    updateTask() {
        let dataDeal = this.getDataDeal();
        this.saveDealToBx24(dataDeal);
        let dataSmartProcess = this.getDataSmartProcess();
        this.saveSmartProcessToBx24(dataSmartProcess);
    }

    cancelChanging() {
        BX24.reloadWindow();
    }

    async getDealDataFromBx24(dealId) {
        let data = await this.bx24.callMethod(
            "crm.deal.list",
            {
                "filter": { "ID": dealId },
                "select": ["*", "UF_*",]
            }
        );
        // console.log("crm.deal.list = ", data);
        // return data.result[0];
        return data[0];
    }

    async getDealFieldsFromBx24() {
        let data = await this.bx24.callMethod("crm.deal.fields", {});
        console.log("crm.deal.fields = ", data);
        
        // return data.result;
        return data;
    }

    async saveDealToBx24(data) {
        // let cmd = {};
        // for (let item of data) {
        //     let idSmartProcess = item.id;
        //     // delete item.id;
        //     let request = `crm.item.update?entityTypeId=${this.smartNumber}&id=${idSmartProcess}&fields[ufCrm19_1684137706]=${item.ufCrm19_1684137706}&fields[ufCrm19_1684137811]=${item.ufCrm19_1684137811}&fields[ufCrm19_1684137822]=${item.ufCrm19_1684137822}&fields[ufCrm19_1684137877]=${item.ufCrm19_1684137877}&fields[ufCrm19_1684137925]=${item.ufCrm19_1684137925}&fields[ufCrm19_1684137950]=${item.ufCrm19_1684137950}&fields[ufCrm19_1684138153]=${item.ufCrm19_1684138153}`;
        //     for (let i in item.ufCrm19_1684142357) {
        //         request += `&fields[ufCrm19_1684142357][${i}]=${encodeURIComponent(item.ufCrm19_1684142357[i])}`
        //     }
        //     cmd[idSmartProcess] = request;
        // }
        let response = await this.bx24.callMethod(
            "crm.deal.update",
            {
                "id": this.dealId,
                "fields": data
            }
        );
        // console.log({
        //     "id": this.dealId,
        //     "fields": data
        // });
        
        console.log(response);
    }

    async saveSmartProcessToBx24(data) {
        // let cmd = {};
        // for (let item of data) {
        //     let idSmartProcess = item.id;
        //     // delete item.id;
        //     let request = `crm.item.update?entityTypeId=${this.smartNumber}&id=${idSmartProcess}&fields[ufCrm19_1684137706]=${item.ufCrm19_1684137706}&fields[ufCrm19_1684137811]=${item.ufCrm19_1684137811}&fields[ufCrm19_1684137822]=${item.ufCrm19_1684137822}&fields[ufCrm19_1684137877]=${item.ufCrm19_1684137877}&fields[ufCrm19_1684137925]=${item.ufCrm19_1684137925}&fields[ufCrm19_1684137950]=${item.ufCrm19_1684137950}&fields[ufCrm19_1684138153]=${item.ufCrm19_1684138153}`;
        //     for (let i in item.ufCrm19_1684142357) {
        //         request += `&fields[ufCrm19_1684142357][${i}]=${encodeURIComponent(item.ufCrm19_1684142357[i])}`
        //     }
        //     cmd[idSmartProcess] = request;
        // }
        // let response = await this.bx24.batchMethod(cmd);
        let reqPackage = {};
        for (let item of data) {
            let tmp = {...item};
            delete tmp.id;
            let idSmartProcess = item.id;
            reqPackage[idSmartProcess] = ["crm.item.update", {
                entityTypeId: this.smartNumber, id: idSmartProcess, fields: tmp
            }];
        }
        let response = await this.bx24.batchMethod(reqPackage);
        console.log(response);
        return response;
    }
    
    
    async addSmartProcessToBx24(data) {
        // let cmd = {};
        // for (let item of data) {
        //     let idSmartProcess = item.id;
        //     let request = `crm.item.add?entityTypeId=${this.smartNumber}&fields[ufCrm19_1684137706]=${item.ufCrm19_1684137706}&fields[ufCrm19_1684137811]=${item.ufCrm19_1684137811}&fields[ufCrm19_1684137822]=${item.ufCrm19_1684137822}&fields[ufCrm19_1684137877]=${item.ufCrm19_1684137877}&fields[ufCrm19_1684137925]=${item.ufCrm19_1684137925}&fields[ufCrm19_1684137950]=${item.ufCrm19_1684137950}&fields[ufCrm19_1684138153]=${item.ufCrm19_1684138153}`;
        //     for (let i in item.ufCrm19_1684142357) {
        //         request += `&fields[ufCrm19_1684142357][${i}]=${encodeURIComponent(item.ufCrm19_1684142357[i])}`
        //     }
        //     cmd[idSmartProcess] = request;
        // }
        // let response = await this.bx24.batchMethod(cmd);
        let reqPackage = {};
        for (let item of data) {
            let idSmartProcess = item.id;
            reqPackage[idSmartProcess] = ["crm.item.update", {
                entityTypeId: this.smartNumber, fields: item
            }];
        }
        let response = await this.bx24.batchMethod(reqPackage);
        console.log(response);
        return response;
    }


}


async function main() {
    console.log("Ready!!!");
        let seretKeyYandex = await BX24.appOption.get(SETTINGS__SECRETS_KEY);
        let bx24 = new Bitrix24();
        let yaDisk = new YandexDisk(seretKeyYandex);
        // let dealId = 10133;
        let app = new App(dealId, bx24, yaDisk);
        
        await app.init();
        await app.render();
}

$(document).ready(function() {
    BX24.init(function(){
        main();
    })
});
