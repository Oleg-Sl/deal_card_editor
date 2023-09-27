import InterfaceBlockOne from './interface_block_one.js'
import { InterfaceBlockTwo } from './interface_block_two.js'
import InterfaceBlockThree from './interface_block_three.js'
import InterfaceBlockFour from './interface_block_four.js'
import InterfaceBlockFive from './interface_block_five.js'

import Bitrix24 from './bx24/requests.js'
import YandexDisk from './yandex_disk/requests.js'

// import {update as updateTaskOrder} from "./utils/task_update.js"
import {Task} from "./utils/task.js"

import {
    FIELD_ID_TASK_ORDER,
    FIELD_CONTACT_MESURE,
} from "./parameters.js"


const SETTINGS__SECRETS_KEY = "yandex_secret_key";


class App {
    constructor(dealId, bx24, yaDisk) {
        this.bx24 = bx24;
        this.yaDisk = yaDisk;
        this.dealId = dealId;
        this.taskId = NaN;
        
        this.smartNumber = 144;
        
        this.data = NaN;
        this.currentUser = NaN;
        this.fields = NaN;

        this.task = Task(this.bx24);

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
        this.containerButtonsBottom = document.querySelector('#containerSaveChangesBottom');
        this.elemBtnSaveBottom = this.containerButtonsBottom.querySelector('#saveButtonBottom');
        this.elemBtnRewriteBottom = this.containerButtonsBottom.querySelector('#rewriteButtonBottom');
        this.elemBtnCancelBottom = this.containerButtonsBottom.querySelector('#cancelButtonBottom');

    }

    async init() {
        this.currentUser = await this.getCurrentUserFromBx24();
        this.data        = await this.getDealDataFromBx24(this.dealId);
        this.fields      = await this.getDealFieldsFromBx24();
        this.taskId = this.data[FIELD_ID_TASK_ORDER];

        this.task.init(this.fields);
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
            let spinner = this.elemBtnSaveBottom.querySelector("span");
            spinner.classList.remove("d-none");
            let dataDeal = this.getDataDeal();
            await this.saveDealToBx24(dataDeal);
            let dataSmartProcess = this.getDataSmartProcess();
            await this.saveSmartProcessToBx24(dataSmartProcess);
            await this.interfaceBlockFive.deleteRemovingFiles();
            spinner.classList.add("d-none");
        })

        // Сохранение изменений в сделку и БП, также изменение данных в задаче
        this.elemBtnRewriteBottom.addEventListener("click", async (e) => {
            let spinner = this.elemBtnRewriteBottom.querySelector("span");
            spinner.classList.remove("d-none");
            let dataDeal = this.getDataDeal();
            await this.saveDealToBx24(dataDeal);
            let dataSmartProcess = this.getDataSmartProcess();
            await this.saveSmartProcessToBx24(dataSmartProcess);
            // await updateTaskOrder(dataDeal, this.data, dataSmartProcess, this.fields);
            let contactMeasure = await this.getContactDataFromBx24(this.data[FIELD_CONTACT_MESURE]);
            this.task.updateTask(this.taskId, dataDeal, dataSmartProcess, contactMeasure || {});
            await this.interfaceBlockFive.deleteRemovingFiles();
            let responsible = this.interfaceBlockThree.getResponsible();
            let msgToUser = `[USER=${responsible.ID}]${responsible.LAST_NAME} ${responsible.NAME}[/USER], ВНИМАНИЕ! Задача изменена.`;
            await this.sendMessageToResponsible(this.taskId, msgToUser, this.currentUser.ID);
            spinner.classList.add("d-none");
        })

        // Отмена изменений
        this.elemBtnCancelBottom.addEventListener("click", async (e) => {
            // BX24.reloadWindow();
            let spinner = this.elemBtnCancelBottom.querySelector("span");
            spinner.classList.remove("d-none");
            this.data = await this.getDealDataFromBx24(this.dealId);
            this.fields = await this.getDealFieldsFromBx24();
            this.interfaceBlockFive.init();
            this.render();
            spinner.classList.add("d-none");
        })

        // Открыть модальное окно с настройками
        if (this.currentUser.ID == 1) {
            this.elemBtnSettingsBottom.addEventListener("click", async (e) => {
                this.modalSettings.show();
            })
        }

        // Сохранить настройки
        this.elemBtnSaveSettingsButton.addEventListener("click", async (e) => {
            let seretKeyYandex = this.modalFieldSecretKeyYandex.value;
            BX24.appOption.set(SETTINGS__SECRETS_KEY, seretKeyYandex);
            this.yaDisk.updateSecretKey(seretKeyYandex);
        })
    }

    render() {
        if (this.currentUser.ID == 1) {
            this.elemBtnSettingsBottom.insertAdjacentHTML('beforeend', '<button type="button" class="btn btn-secondary question-settings-data-btn-cancel" id="settingsButtonBottom">Настройки</button>');
        }
        this.interfaceBlockOne.render(this.fields, this.data);
        this.interfaceBlockTwo.render(this.fields, this.data);
        this.interfaceBlockThree.render(this.fields, this.data);
        this.interfaceBlockFour.render(this.fields, this.data);
        this.interfaceBlockFive.render(this.fields, this.data);
    }

    getDataDeal() {
        let deal_data = this.interfaceBlockOne.getData();
        let data = this.interfaceBlockTwo.getData();
        let users = this.interfaceBlockThree.getData();
        let desc = this.interfaceBlockFour.getData();
        return {...deal_data, ...data, ...users, ...desc};
    }

    getDataSmartProcess() {
        let products = this.interfaceBlockFive.getData();
        // console.log("products = ", products);
        return products;
    }

    async sendMessageToResponsible(taskId, msg, authorId) {
        let data = await this.bx24.callMethod(
            "task.commentitem.add",
            {
                "taskId": taskId,
                "fields": {
                    "AUTHOR_ID": authorId,
                    "POST_MESSAGE": msg
                }
            }
        );
        console.log("Отправлен комментарий, овет от Битрикс: ", data);
        return data;
    }

    async getCurrentUserFromBx24() {
        let data = await this.bx24.callMethod("user.current", {});
        return data;
    }

    async getDealDataFromBx24(dealId) {
        let data = await this.bx24.callMethod(
            "crm.deal.list",
            {
                "filter": { "ID": dealId },
                "select": ["*", "UF_*",]
            }
        );
        return data[0];
    }

    async getDealFieldsFromBx24() {
        let data = await this.bx24.callMethod("crm.deal.fields", {});
        return data;
    }

    async getContactDataFromBx24(contactId) {
        let data = await this.bx24.callMethod(
            "crm.contact.list",
            {
                "filter": { "ID": contactId },
                "select": ["NAME", "LAST_NAME","SECOND_NAME", "PHONE"]
            }
        );
        return data[0];
    }

    async saveDealToBx24(data) {
        console.log("saveDealToBx24 = ", data);
        let response = await this.bx24.callMethod(
            "crm.deal.update",
            {
                "id": this.dealId,
                "fields": data
            }
        );
    }

    async saveSmartProcessToBx24(data) {
        if (data.length == 0) {
            return;
        }
        let reqPackage = {};
        // console.log("DATA = ", data);
        for (let item of data) {
            let tmp = {...item};
            delete tmp.id;
            let idSmartProcess = item.id;
            reqPackage[idSmartProcess] = ["crm.item.update", {
                entityTypeId: this.smartNumber, id: idSmartProcess, fields: tmp
            }];
        }
        // console.log("REQ_METHOD = ", reqPackage);
        let response = await this.bx24.batchMethod(reqPackage);
        return response;
    }
    
    async addSmartProcessToBx24(data) {
        let reqPackage = {};
        for (let item of data) {
            let idSmartProcess = item.id;
            reqPackage[idSmartProcess] = ["crm.item.update", {
                entityTypeId: this.smartNumber, fields: item
            }];
        }
        let response = await this.bx24.batchMethod(reqPackage);
        return response;
    }
}


async function main() {
    console.log("Ready!!!");
    let seretKeyYandex = await BX24.appOption.get(SETTINGS__SECRETS_KEY);
    let bx24 = new Bitrix24();
    let yaDisk = new YandexDisk(seretKeyYandex);
    let app = new App(dealId, bx24, yaDisk);
    await app.init();
    await app.render();
}


$(document).ready(function() {
    BX24.init(function(){
        main();
    })
});
