import InterfaceBlockOne from './interface_block_one.js'
import { InterfaceBlockTwo } from './interface_block_two.js'
import InterfaceBlockThree from './interface_block_three.js'
import InterfaceBlockFour from './interface_block_four.js'
import InterfaceBlockFive from './interface_block_five.js'

import Bitrix24 from './bx24/requests.js'
import YandexDisk from './yandex_disk/requests.js'

// import {update as updateTaskOrder} from "./utils/task_update.js"
import {Task} from "./utils/task.js"
import {DataComparator} from "./utils/data_comparator.js"

import {
    bx24TaskAddComment,
    bx24UserGetCurrent,
    bx24DealGetFields,
    bx24DealGetData,
    bx24DealUpdate,
    bx24ContactGetData,
    bx24SmartProcessUpdate,
    bx24SmartProcessGetList,
} from "./bx24/api.js"

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
        
        this.productData = NaN;
        this.currentUser = NaN;
        this.fieldsData = NaN;

        this.task = new Task(this.bx24);
        this.dataComparator = new DataComparator();

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
        this.elemBtnSaveBottom      = this.containerButtonsBottom.querySelector('#saveButtonBottom');
        this.elemBtnRewriteBottom   = this.containerButtonsBottom.querySelector('#rewriteButtonBottom');
        this.elemBtnCancelBottom    = this.containerButtonsBottom.querySelector('#cancelButtonBottom');
    }

    async init() {
        this.currentUser = await bx24UserGetCurrent(this.bx24);
        this.productData = await bx24DealGetData(this.bx24, this.dealId);
        this.fieldsData  = await bx24DealGetFields(this.bx24);
        this.taskId      = this.productData[FIELD_ID_TASK_ORDER];

        this.task.init(this.fieldsData);
        this.dataComparator.init(this.fieldsData);
        this.interfaceBlockOne.init(this.fieldsData, this.productData);
        this.interfaceBlockTwo.init(this.fieldsData, this.productData);
        this.interfaceBlockThree.init(this.fieldsData, this.productData);
        this.interfaceBlockFour.init(this.fieldsData, this.productData);
        this.interfaceBlockFive.init(this.fieldsData, this.productData);

        this.initHandler();
    }

    initHandler() {
        // Сохранение изменений в сделку и БП
        this.elemBtnSaveBottom.addEventListener("click", async (e) => {
            let spinner = this.elemBtnSaveBottom.querySelector("span");
            spinner.classList.remove("d-none");
            await this.handleSaveDealData();
            // let dataDeal = this.getDataDeal();
            // await bx24DealUpdate(this.bx24, this.dealId, dataDeal);
            // let dataSmartProcess = this.getDataSmartProcess();
            // await bx24SmartProcessUpdate(this.bx24, this.smartNumber, dataSmartProcess);
            // await this.interfaceBlockFive.deleteRemovingFiles();
            spinner.classList.add("d-none");
        })

        // Сохранение изменений в сделку и БП, также изменение данных в задаче
        this.elemBtnRewriteBottom.addEventListener("click", async (e) => {
            let spinner = this.elemBtnRewriteBottom.querySelector("span");
            spinner.classList.remove("d-none");
            await this.handleSaveDealData();
            await this.handleUpdateTask();
            // let dataDeal = this.getDataDeal();
            // await bx24DealUpdate(this.bx24, this.dealId, dataDeal);
            // let dataSmartProcess = this.getDataSmartProcess();
            // await bx24SmartProcessUpdate(this.bx24, this.smartNumber, dataSmartProcess);
            // await this.interfaceBlockFive.deleteRemovingFiles();

            // let contactMeasure = await bx24ContactGetData(this.bx24, this.productData[FIELD_CONTACT_MESURE]);
            // this.task.updateTask(this.taskId, dataDeal, dataSmartProcess, contactMeasure || {});
            // let responsible = this.interfaceBlockThree.getResponsible();
            // let msgToUser = `[USER=${responsible.ID}]${responsible.LAST_NAME || ""} ${responsible.NAME || ""}[/USER], ВНИМАНИЕ! Задача изменена.`;
            // await bx24TaskAddComment(this.bx24, this.taskId, msgToUser, this.currentUser.ID);
            
            spinner.classList.add("d-none");
        })

        // Отмена изменений
        this.elemBtnCancelBottom.addEventListener("click", async (e) => {
            let spinner = this.elemBtnCancelBottom.querySelector("span");
            spinner.classList.remove("d-none");
            await this.handleCancelChanging();
            // this.productData = await bx24DealGetData(this.bx24, this.dealId);
            // this.fieldsData = await bx24DealGetFields(this.bx24);
            // this.interfaceBlockFive.init();
            // this.render();
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

    async handleSaveDealData() {
        let dataDeal = this.getDataDeal();
        await bx24DealUpdate(this.bx24, this.dealId, dataDeal);

        let dataSmartProcess = this.getDataSmartProcess();
        await bx24SmartProcessUpdate(this.bx24, this.smartNumber, dataSmartProcess);

        await this.interfaceBlockFive.deleteRemovingFiles();
    }

    async handleUpdateTask() {
        let contactMeasure = await bx24ContactGetData(this.bx24, this.productData[FIELD_CONTACT_MESURE]);
        this.task.updateTask(this.taskId, dataDeal, dataSmartProcess, contactMeasure || {});

        let oldDealData = await bx24DealGetData(this.bx24, this.dealId);
        let newDealData = this.getDataDeal();
        let dealChanged = this.dataComparator.findChangedValues(oldDealData, newDealData);
        console.log("dealChanged = ", dealChanged);

        let oldProductsData = bx24SmartProcessGetList(this.bx24, this.smartNumber, this.dealId);
        let newProductsData = this.getDataSmartProcess();
        let productsChanged = this.dataComparator.findChagedInProducts(oldProductsData, newProductsData);
        console.log("productsChanged = ", productsChanged);

        let responsible = this.interfaceBlockThree.getResponsible();
        
        let msgToUser = `[USER=${responsible.ID}]${responsible.LAST_NAME || ""} ${responsible.NAME || ""}[/USER], ВНИМАНИЕ! Задача изменена.`;
        
        await bx24TaskAddComment(this.bx24, this.taskId, msgToUser, this.currentUser.ID);
        
    }

    async handleCancelChanging() {
        this.productData = await bx24DealGetData(this.bx24, this.dealId);
        this.fieldsData = await bx24DealGetFields(this.bx24);
        this.interfaceBlockFive.init();
        this.render();
    }

    render() {
        if (this.currentUser.ID == 1) {
            this.elemBtnSettingsBottom.insertAdjacentHTML('beforeend', '<button type="button" class="btn btn-secondary question-settings-data-btn-cancel" id="settingsButtonBottom">Настройки</button>');
        }
        this.interfaceBlockOne.render();
        this.interfaceBlockTwo.render();
        this.interfaceBlockThree.render();
        this.interfaceBlockFour.render();
        this.interfaceBlockFive.render();
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
        return products;
    }
}


async function main() {
    console.log("Ready!!!");
    let seretKeyYandex = await BX24.appOption.get(SETTINGS__SECRETS_KEY);
    let bx24   = new Bitrix24();
    let yaDisk = new YandexDisk(seretKeyYandex);
    let app    = new App(dealId, bx24, yaDisk);
    await app.init();
    await app.render();
}


$(document).ready(function() {
    BX24.init(function(){
        main();
    })
});
