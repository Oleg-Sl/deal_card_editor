import InterfaceBlockOne from './interface_block_one.js'
import { InterfaceBlockTwo } from './interface_block_two.js'
import InterfaceBlockThree from './interface_block_three.js'
import InterfaceBlockFour from './interface_block_four.js'
import InterfaceBlockFive from './interface_block_five.js'

import Bitrix24 from './bx24/requests.js'
import YandexDisk from './yandex_disk/requests.js'

// import {update as updateTaskOrder} from "./utils/task_update.js"
import { Task } from "./utils/task.js"
import { CheckData } from "./utils/check_data.js"
import { DealDataComparator, ProductsDataComparator } from "./utils/data_comparator.js"

import {
    bx24TaskAddComment,
    bx24UserGetCurrent,
    bx24DealGetFields,
    bx24DealGetData,
    bx24DealUpdate,
    bx24ContactGetData,
    bx24SmartProcessUpdate,
    bx24SmartProcessGetList,
    bx24ProductGetFields,
    bx24GetStartData,
    bx24GetContactsData,
    bx24BatchGetDealAndProducts,
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

        this.savingProcess = false;

        this.dealData = NaN;
        this.productsData = NaN;
        this.currentUser = NaN;
        this.fieldsDealData = NaN;
        this.fieldsProductData = NaN;
        this.dealContacts = NaN;
        this.departments = NaN;

        this.task = new Task(this.bx24);
        this.dataComparator = new DealDataComparator(this.bx24);
        this.productComparator = new ProductsDataComparator(this.bx24);
        this.checkData = new CheckData(this.bx24);
        
        
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
        this.elemBtnCreateBottom    = this.containerButtonsBottom.querySelector('#createTaskButtonBottom');

    }

    async init() {
        await this.initializeData();
        this.initializeUI();
        this.initHandler();
    }

    async initializeData() {
        const result = await bx24GetStartData(this.bx24, this.smartNumber, this.dealId);
        this.currentUser = result?.currentUser;
        this.fieldsDealData = result?.fieldsDealData;
        this.fieldsProductData = result?.fieldsProductData?.fields;
        this.departments = result?.departments
        let dealContacts = result?.dealContacts;
        
        this.dealContacts = await bx24GetContactsData(this.bx24, dealContacts.map(item => item.CONTACT_ID));

        await this.getDataFromBx24();
    }

    initializeUI() {
        this.task.init(this.fieldsDealData);
        this.dataComparator.init(this.fieldsDealData);
        this.productComparator.init(this.fieldsProductData);

        this.interfaceBlockOne.init(this.fieldsDealData, this.dealData);
        this.interfaceBlockTwo.init(this.fieldsDealData, this.dealData);
        this.interfaceBlockThree.init(this.fieldsDealData, this.dealData, this.departments);
        this.interfaceBlockFour.init(this.fieldsDealData, this.dealData);
        this.interfaceBlockFive.init(this.fieldsDealData, this.dealData, this.productsData.map(obj => ({ ...obj })));
    }

    initHandler() {
        // Сохранение изменений в сделку и БП
        this.elemBtnSaveBottom.addEventListener("click", async (e) => {
            let spinner = this.elemBtnSaveBottom.querySelector("span");
            spinner.classList.remove("d-none");
            await this.handleSaveDealData();
            await this.getDataFromBx24();
            spinner.classList.add("d-none");
        })

        // Сохранение изменений в сделку и БП, также изменение данных в задаче
        this.elemBtnRewriteBottom.addEventListener("click", async (e) => {
            let spinner = this.elemBtnRewriteBottom.querySelector("span");
            spinner.classList.remove("d-none");
            // await this.getDataFromBx24();
            await this.handleSaveDealData();
            let res = await this.handleUpdateTask();
            if (res) {
                await this.getDataFromBx24();
            }
            spinner.classList.add("d-none");
        })

        // Отмена изменений
        this.elemBtnCancelBottom.addEventListener("click", async (e) => {
            let spinner = this.elemBtnCancelBottom.querySelector("span");
            spinner.classList.remove("d-none");
            await this.getDataFromBx24();
            // await this.handleCancelChanging();
            this.initializeUI();
            this.render();
            spinner.classList.add("d-none");
        })

        // Создание задачи
        this.elemBtnCreateBottom.addEventListener("click", async (e) => {
            if (!this.savingProcess) {
                this.savingProcess = true;
                let spinner = this.elemBtnCreateBottom.querySelector("span");
                spinner.classList.remove("d-none");
                try {
                    await this.handleSaveDealData();
                    await this.handleCreateTask();
                    await this.getDataFromBx24();
                } catch (error) {
                    console.error("Произошла ошибка при создании задачи: ", error?.ex?.error_description);
                }
                spinner.classList.add("d-none");
                this.savingProcess = false;
            }
        })

        // Открыть модальное окно с настройками
        // if (this.currentUser.ID == 255000) {
        //     this.elemBtnSettingsBottom.addEventListener("click", async (e) => {
        //         this.modalSettings.show();
        //     })
        // }

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
        const isTaskOrder = await this.checkData.isTaskOrder(this.dealData);
        const newDealData = this.getDataDeal();
        const newProductsData = this.getDataSmartProcess();
        if (!isTaskOrder) {
            alert('Задача "ЗАКАЗ" не создана или удалена');
            return false;
        }
        if (!this.checkData.isCheckDealData(newDealData)) {
            alert("Заполните все поля заказа");
            return false;
        }
        if (!this.checkData.isCheckProductsData(newProductsData)) {
            alert("Заполните все поля в товарах заказа");
            return false;
        }
        if (this.checkData.isTaskProduction(this.dealData)) {
            alert('Сделка в производстве, изменять задачу заказ нельзя, создай новую сделку!');
            return false;
        }
        try {
            let dealChanged = await this.dataComparator.getChanged(this.dealData, newDealData);
            let productsChanged = await this.productComparator.getChanged(this.productsData, newProductsData);
            // const contactMeasure = await bx24ContactGetData(this.bx24, this.dealData[FIELD_CONTACT_MESURE]);
            let responsible = this.interfaceBlockThree.getResponsible();
            await this.task.updateTask(this.taskId, newDealData, newProductsData, this.dealContacts || {});
            await this.task.addComment(this.taskId, responsible, dealChanged, productsChanged, this.currentUser);
        } catch (error) {
            console.error("Произошла ошибка при обновлении задачи:", error);
            alert("Произошла ошибка при обновлении задачи: " + error);
            return false;
        }
        return true;
        
    }

    async handleCreateTask() {
        const newDealData = this.getDataDeal();
        const newProductsData = this.getDataSmartProcess();

        console.log("newDealData = ", newDealData);

        if (!this.checkData.isCheckDealData(newDealData)) {
            alert("Заполните все поля заказа");
            return false;
        }
        if (!this.checkData.isCheckProductsData(newProductsData)) {
            alert("Заполните все поля в товарах заказа");
            return false;
        }

        const isTaskOrder = await this.checkData.isTaskOrder(this.dealData);
        if (isTaskOrder) {
            alert('Задача "ЗАКАЗ" уже была создана');
            return;
        }
        try {
            // const contactMeasure = await bx24ContactGetData(this.bx24, this.dealData[FIELD_CONTACT_MESURE]);
            await this.task.createTask(this.dealId, newDealData, newProductsData, this.dealContacts || {});
        } catch (error) {
            console.error("Произошла ошибка при создании задачи:", error);
            alert("Произошла ошибка при создании задачи: " + error);
        }
        
    }

    async getDataFromBx24() {
        try {
            const result = await bx24BatchGetDealAndProducts(this.bx24, this.smartNumber, this.dealId);
            this.dealData = result?.deal[0];
            this.productsData = result?.products?.items;
            // this.dealData = await bx24DealGetData(this.bx24, this.dealId);
            // this.productsData = await bx24SmartProcessGetList(this.bx24, this.smartNumber, this.dealId);
            this.taskId = this.dealData[FIELD_ID_TASK_ORDER];
        } catch (error) {
            console.error("Произошла ошибка при получении данных из BX24:", error);
        }
    }

    render() {
        // if (this.currentUser.ID == 255000) {
        //     this.elemBtnSettingsBottom.insertAdjacentHTML('beforeend', '<button type="button" class="btn btn-secondary question-settings-data-btn-cancel" id="settingsButtonBottom">Настройки</button>');
        // }
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
