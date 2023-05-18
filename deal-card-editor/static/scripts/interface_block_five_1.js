// const DESC_ORDER = "UF_CRM_1655918107";
const MANUFACTURING_TECHNOLOGY = "UF_CRM_1625666854";   // технология изготовления
const FILM_WIDTH = "UF_CRM_1672744985962";   // ширина пленки


// Идентификаторы полей строги - ИТОГО
const ID__SUMMARY_COUNT_POSITION = "SummaryCountPosition";
const ID__SUMMARY_COUNT_PRODUCTS = "SummaryCountProducts";
const ID__SUMMARY_AREA_RUNNING_METERS = "SummaryAreaRunningMeters";
const ID__SUMMARY_AREA_SQUARE_METERS = "SummaryAreaSquareMeters";

const ID__ADD_PRODUCT = "CreateProduct";
const ADD_FILE_TO_PRODUCT = "product-choose-file-input";

// Классы элементов строки продукта 
const PRODUCTS_DESC = "product-desc-item";
const PRODUCTS_COUNT = "product-count-item";
const PRODUCTS_MANUFACTURING_TECHNOLOGY = "product-manufact-technol-item";
const PRODUCTS_FILM_WIDTH = "product-film-width-item";
const PRODUCTS_AREA_RUNNING_METERS = "product-area-running-meters-item";
const PRODUCTS_AREA_SQUARE_METERS = "product-area-square-meters-item";
const PRODUCTS_LINK_SOURCES_CLIENT = "product-linc-sources-client-item";
const PRODUCTS_FILES_CLIENT = "product-linc-sources-client-item";


const FIELD_PRODUCTS_DESC = "ufCrm19_1684137706";
const FIELD_PRODUCTS_COUNT = "ufCrm19_1684137811";
const FIELD_PRODUCTS_MANUFACTURING_TECHNOLOGY = "ufCrm19_1684137822";
const FIELD_PRODUCTS_FILM_WIDTH = "ufCrm19_1684137877";
const FIELD_PRODUCTS_AREA_RUNNING_METERS = "ufCrm19_1684137925";
const FIELD_PRODUCTS_AREA_SQUARE_METERS = "ufCrm19_1684137950";
const FIELD_PRODUCTS_LINK_SOURCES_CLIENT = "ufCrm19_1684138153";
const FIELD_PRODUCTS_FILES_CLIENT = "ufCrm19_1684142357";


export default class InterfaceBlockfour {
    constructor(container, bx24) {
        this.container = container;
        this.bx24 = bx24;
        this.smartNumber = 184;

        this.elemSummaryCountPosition = null;
        this.elemSummaryCountProducts = null;
        this.elemSummaryAreaRunningMeters = null;
        this.elemSummaryAreaSquareMeters = null;
        this.containerBody = null;

        this.fieldsItemsdManufactTechn = null;
        this.fieldItemsFilmWidth = null;
        this.elemAddProduct = null;
    }

    init() {
        this.renderInit();
        this.elemSummaryCountPosition = this.container.querySelector(`#${ID__SUMMARY_COUNT_POSITION}`);
        this.elemSummaryCountProducts = this.container.querySelector(`#${ID__SUMMARY_COUNT_PRODUCTS}`);
        this.elemSummaryAreaRunningMeters = this.container.querySelector(`#${ID__SUMMARY_AREA_RUNNING_METERS}`);
        this.elemSummaryAreaSquareMeters = this.container.querySelector(`#${ID__SUMMARY_AREA_SQUARE_METERS}`);
        this.containerBody = this.container.querySelector("#productsListBody");
        this.elemAddProduct = this.container.querySelector(`#${ID__ADD_PRODUCT}`);
        console.log(this.elemAddProduct);
        this.initHandler();
    }

    initHandler() {
        // Добавление нового продукта
        this.container.addEventListener("click", async (e) => {
            if (e.target == this.elemAddProduct) {
                this.addRowProductHTML();
            }
        })
        // Добавление нового файла к продукту
        this.container.addEventListener("click", async (e) => {
            if (e.target.classList.contains(ADD_FILE_TO_PRODUCT)) {
                let elemInput = e.target.parentNode.querySelector("input");
                elemInput.click();
                // let numFile = 0;
                // let elemTbody = e.target.parentNode.querySelector("tbody");
                // let elemRow = elemTbody.lastElementChild
                // if (elemRow) {
                //     let elemNumberRow = elemRow.querySelector(".product-number-file");
                //     if (elemNumberRow) {
                //         numFile = +elemNumberRow.innerText;
                //     }
                // }
                // console.log(numFile);
                // this.getRowTableFileHTML(numFile + 1, `${};${};${}`);
            }
        })

    }

    renderInit() {
        let contentHTML = `
            <div class="product-list-header">
                ${this.getHeaderHTML()}
            </div>
            <div class="products-list-body" id="productsListBody">
                
            </div>
            <div class="product-list-add-element">
                <div class="col-1 p-0 my-2">
                    <i class="bi bi-plus-circle-fill m-0 p-2 text-success" style="cursor: pointer; " id="${ID__ADD_PRODUCT}"></i>
                </div>
            </div>
            <div class="product-list-header">
                ${this.getFooterHTML()}
            </div>
        `;
        this.container.innerHTML = contentHTML;
    }

    getHeaderHTML() {
        let contentHTML = `
            <div class="row">
                <div class="col-2">
                    <label for="exampleFormControlInput1" class="form-label">Описание</label>
                </div>
                <div class="col-1">
                    <label for="exampleFormControlInput1" class="form-label">Кол-во</label>
                </div>
                <div class="col-2">
                    <label for="exampleFormControlInput1" class="form-label">Технология изготовления</label>
                </div>
                <div class="col-1">
                    <label for="" class="form-label">Ширина пленки</label>
                </div>
                <div class="col-2">
                    <div class="row">
                        <div class="col-5">
                            <label for="" class="form-label">м.пог</label>
                        </div>
                        <div class="col-2">
                        </div>
                        <div class="col-5">
                            <label for="" class="form-label">м2</label>
                        </div>
                    </div>
                </div>
                
                <div class="col-2">
                    <label for="" class="form-label">Ссылка на исходники клиента</label>
                </div>
                <div class="col-2">
                    <label for="" class="form-label">Файлы клиента</label>
                </div>
            </div>
        `;
        return contentHTML;
    }

    getFooterHTML() {
        let contentHTML = `
            <div class="row p-0 m-0 border-top border-bottom">
                <div class="col-1">
                    Итого:
                </div>
                <div class="d-flex justify-content-end col-1">
                    Позиций: &nbsp;<span id="${ID__SUMMARY_COUNT_POSITION}">&ndash;</span>
                </div>
                <div class="d-flex justify-content-end col-1">
                    Кол-во: &nbsp;<span id="${ID__SUMMARY_COUNT_PRODUCTS}">&ndash;</span>
                </div>
                <div class="col-3">
                </div>
                <div class="col-2">
                    <div class="row">
                        <div class="d-flex justify-content-end col-5">
                            м.пог: &nbsp;<span id="${ID__SUMMARY_AREA_RUNNING_METERS}">&ndash;</span>
                        </div>
                        <div class="col-2"></div>
                        <div class="d-flex justify-content-end col-5">
                            м2: &nbsp;<span id="${ID__SUMMARY_AREA_SQUARE_METERS}">&ndash;</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        return contentHTML;
    }

    async getProductsList(smartNumber, dealId) {
        let data = listData;
        // let data = await this.bx24.callMethod(
        //     "crm.item.list",
        //     {
        //         "entityTypeId": smartNumber,
        //         "fields": {
        //             "filter": { "parentId2": dealId }
        //         },
        //         "select": [
        //             "id",
        //             FIELD_PRODUCTS_DESC,
        //             FIELD_PRODUCTS_COUNT,
        //             FIELD_PRODUCTS_MANUFACTURING_TECHNOLOGY,
        //             FIELD_PRODUCTS_FILM_WIDTH,
        //             FIELD_PRODUCTS_AREA_RUNNING_METERS,
        //             FIELD_PRODUCTS_AREA_SQUARE_METERS,
        //             FIELD_PRODUCTS_LINK_SOURCES_CLIENT,
        //             FIELD_PRODUCTS_FILES_CLIENT,
        //         ]
        //     }
        // );

        return data.result.items;
    }

    async render(fields, data) {
        this.fieldsItemsdManufactTechn = fields[MANUFACTURING_TECHNOLOGY].items;
        this.fieldItemsFilmWidth = fields[FILM_WIDTH].items;
        let productsList = await this.getProductsList(this.smartNumber, data.ID);
        for (let product of productsList) {
            this.addRowProductHTML(product);
        }
    }

    addRowProductHTML(product={}) {
        let smartId = product.ID || "";
        let productDesc = product[FIELD_PRODUCTS_DESC] || "";
        let productCount = product[FIELD_PRODUCTS_COUNT] || "";
        let productManufacturingTechnology = product[FIELD_PRODUCTS_MANUFACTURING_TECHNOLOGY] || "";
        let productFilmWidth = product[FIELD_PRODUCTS_FILM_WIDTH] || "";
        let productAreaRunningMeters = product[FIELD_PRODUCTS_AREA_RUNNING_METERS] || "";
        let productAreaSquareMeters = product[FIELD_PRODUCTS_AREA_SQUARE_METERS] || "";
        let productLinkSourcesClietnt = product[FIELD_PRODUCTS_LINK_SOURCES_CLIENT] || "";
        let productsFilesClient = product[FIELD_PRODUCTS_FILES_CLIENT] || "";

        let contentHTML = `
            <div class="row" data-smart-id="${smartId}">
                <div class="col-2 m-0 p-1">
                    <input type="text" class="form-control ${PRODUCTS_DESC}" id="" placeholder="Не заполнено" value="${productDesc}">
                </div>
                <div class="col-1 m-0 p-1">
                    <input type="number" step="1" min="0" class="form-control ${PRODUCTS_COUNT}" id="" placeholder="Не заполнено" value="${productCount}">
                </div>
                <div class="col-2 m-0 p-1">
                    <select class="form-select ${PRODUCTS_MANUFACTURING_TECHNOLOGY}" aria-label=".form-select-lg example">
                        ${this.getOptionsManufactTechnHTML(productManufacturingTechnology)}
                    </select>
                </div>
                <div class="col-1 m-0 p-1">
                    <select class="form-select ${PRODUCTS_FILM_WIDTH}" aria-label=".form-select-lg example">
                        ${this.getOptionsFilmWidthHTML(productFilmWidth)}
                    </select>
                </div>
                <div class="row col-2 m-0 p-1" style="height: fit-content;">
                    <div class="col-5 m-0 p-0">
                        <input type="number" min="0" class="form-control ${PRODUCTS_AREA_RUNNING_METERS}" id="" placeholder="" value="${productAreaRunningMeters}">
                    </div>
                    <div class="col-2 m-0 p-0 d-flex align-items-center justify-content-center text-secondary">
                        <i class="bi bi-arrow-left-right" style="cursor: pointer;"
                        onmouseover="this.style.color='black';" 
                        onmouseout="this.style.color='#6c757d';"></i>
                    </div>
                    <div class="col-5 m-0 p-0">
                        <input type="number" min="0" class="form-control ${PRODUCTS_AREA_SQUARE_METERS}" id="" placeholder="" value="${productAreaSquareMeters}">
                    </div>
                </div>
                <div class="col-2 m-0 p-1">
                    <input type="url" class="form-control ${PRODUCTS_LINK_SOURCES_CLIENT}" id="" placeholder="" value="${productLinkSourcesClietnt}">
                </div>
                <div class="col-2 m-0 p-1">
                    <table class="table table-borderless table-sm m-0 p-0" style="font-size: 14px;">
                        <tbody class="${PRODUCTS_FILES_CLIENT}">
                            ${this.getTableFilesHTML(productsFilesClient)}
                        </tbody>
                    </table>
                    <div>
                        <p class="m-0 p-0 ${ADD_FILE_TO_PRODUCT}" style="font-size: 14px; text-decoration: underline; color: #0d6efd; cursor: pointer;">Добавить+</p>
                        <input class="d-none product-choose-file-input" type="file" id="">
                    </div>
                </div>
            </div>
        `;
                    // <p class="m-0 p-0 ${ADD_FILE_TO_PRODUCT}" style="font-size: 14px; text-decoration: underline; color: #0d6efd; cursor: pointer;">Добавить+</p>
                    // <p class="m-0 p-0"><a href="#" class="link-underline-primary ${ADD_FILE_TO_PRODUCT}" style="font-size: 14px;">+Добавить</a></p>
        this.containerBody.insertAdjacentHTML('beforeend', contentHTML);
    }

    getOptionsManufactTechnHTML(manufactTechnId) {
        let contentHTML = "";
        for (let item of this.fieldsItemsdManufactTechn) {
            if (item.ID == manufactTechnId) {
                contentHTML += `<option value="${item.ID}" selected>${item.VALUE}</option>`;
            } else {
                contentHTML += `<option value="${item.ID}">${item.VALUE}</option>`;
            }
        }
        return contentHTML;
    }

    getOptionsFilmWidthHTML(filmWidthId) {
        let contentHTML = "";
        for (let item of this.fieldItemsFilmWidth) {
            if (item.ID == filmWidthId) {
                contentHTML += `<option value="${item.ID}" selected>${item.VALUE}</option>`;
            } else {
                contentHTML += `<option value="${item.ID}">${item.VALUE}</option>`;
            }
        }
        return contentHTML;
    }

    getTableFilesHTML(filesData) {
        let contentHTML = "";
        for (let i in filesData) {
            let fileData = filesData[i].split(";");
            contentHTML += this.getRowTableFileHTML(+i + 1, fileData);
            // `
            //     <tr>
            //         <td scope="row" class="text-secondary m-0 p-0">${i}</td>
            //         <td class="m-0 p-0"><a href="${fileData[2]}" class="link-underline-primary">${fileData[0]}</a></td>
            //         <td class="text-secondary m-0 p-0">${fileData[1]}</td>
            //         <td class="m-0 p-0"><button type="button" class="btn-close btn-sm m-0 p-0" aria-label="Close"></button></td>
            //     </tr>
            // `;
        }
        return contentHTML;
    }

    getRowTableFileHTML(number, fileData) {
        let contentHTML = `
            <tr>
                <td scope="row" class="text-secondary m-0 p-0 product-number-file">${number}</td>
                <td class="m-0 p-0"><a href="${fileData[2]}" class="link-underline-primary">${fileData[0]}</a></td>
                <td class="text-secondary m-0 p-0">${fileData[1]}</td>
                <td class="m-0 p-0"><button type="button" class="btn-close btn-sm m-0 p-0" aria-label="Close"></button></td>
            </tr>
        `;
        return contentHTML;
    }

}


let listData = {
    "result": {
        "items": [
            {
                "id": 1,
                "xmlId": "",
                "title": "СП для приложения \"Передача заказа #1",
                "createdBy": 255,
                "updatedBy": 255,
                "movedBy": 255,
                "createdTime": "2023-05-15T11:21:31+03:00",
                "updatedTime": "2023-05-15T11:21:31+03:00",
                "movedTime": null,
                "categoryId": 25,
                "opened": "N",
                "previousStageId": "",
                "begindate": "2023-05-15T03:00:00+03:00",
                "closedate": "2023-05-22T03:00:00+03:00",
                "companyId": 0,
                "contactId": 0,
                "opportunity": 0,
                "isManualOpportunity": "N",
                "taxValue": 0,
                "currencyId": "RUB",
                "opportunityAccount": 0,
                "taxValueAccount": 0,
                "accountCurrencyId": "RUB",
                "mycompanyId": 33,
                "sourceId": "CALL",
                "sourceDescription": "",
                "webformId": 0,
                "ufCrm19_1684137706": "",
                "ufCrm19_1684137811": null,
                "ufCrm19_1684137822": null,
                "ufCrm19_1684137877": null,
                "ufCrm19_1684137925": null,
                "ufCrm19_1684137950": null,
                "ufCrm19_1684138153": "",
                "ufCrm19_1684142357": [],
                "assignedById": 255,
                "lastActivityBy": 255,
                "lastActivityTime": "2023-05-15T11:21:31+03:00",
                "parentId2": 10133,
                "utmSource": null,
                "utmMedium": null,
                "utmCampaign": null,
                "utmContent": null,
                "utmTerm": null,
                "observers": [],
                "contactIds": [],
                "entityTypeId": 184
            },
            {
                "id": 3,
                "xmlId": "",
                "title": "СП для приложения \"Передача заказа #3",
                "createdBy": 255,
                "updatedBy": 255,
                "movedBy": 255,
                "createdTime": "2023-05-15T11:25:27+03:00",
                "updatedTime": "2023-05-15T11:25:27+03:00",
                "movedTime": null,
                "categoryId": 25,
                "opened": "N",
                "previousStageId": "",
                "begindate": "2023-05-15T03:00:00+03:00",
                "closedate": "2023-05-22T03:00:00+03:00",
                "companyId": 0,
                "contactId": 0,
                "opportunity": 0,
                "isManualOpportunity": "N",
                "taxValue": 0,
                "currencyId": "RUB",
                "opportunityAccount": 0,
                "taxValueAccount": 0,
                "accountCurrencyId": "RUB",
                "mycompanyId": 33,
                "sourceId": "CALL",
                "sourceDescription": "",
                "webformId": 0,
                "ufCrm19_1684137706": "",
                "ufCrm19_1684137811": null,
                "ufCrm19_1684137822": null,
                "ufCrm19_1684137877": null,
                "ufCrm19_1684137925": null,
                "ufCrm19_1684137950": null,
                "ufCrm19_1684138153": "",
                "ufCrm19_1684142357": [],
                "assignedById": 255,
                "lastActivityBy": 255,
                "lastActivityTime": "2023-05-15T11:25:27+03:00",
                "parentId2": 10133,
                "utmSource": null,
                "utmMedium": null,
                "utmCampaign": null,
                "utmContent": null,
                "utmTerm": null,
                "observers": [],
                "contactIds": [],
                "entityTypeId": 184
            },
            {
                "id": 5,
                "xmlId": "",
                "title": "СП для приложения \"Передача заказа #5",
                "createdBy": 255,
                "updatedBy": 255,
                "movedBy": 255,
                "createdTime": "2023-05-15T11:31:08+03:00",
                "updatedTime": "2023-05-15T11:31:08+03:00",
                "movedTime": null,
                "categoryId": 25,
                "opened": "N",
                "previousStageId": "",
                "begindate": "2023-05-15T03:00:00+03:00",
                "closedate": "2023-05-22T03:00:00+03:00",
                "companyId": 0,
                "contactId": 0,
                "opportunity": 0,
                "isManualOpportunity": "N",
                "taxValue": 0,
                "currencyId": "RUB",
                "opportunityAccount": 0,
                "taxValueAccount": 0,
                "accountCurrencyId": "RUB",
                "mycompanyId": 33,
                "sourceId": "CALL",
                "sourceDescription": "",
                "webformId": 0,
                "ufCrm19_1684137706": "Bla-bla-bla",
                "ufCrm19_1684137811": null,
                "ufCrm19_1684137822": null,
                "ufCrm19_1684137877": null,
                "ufCrm19_1684137925": null,
                "ufCrm19_1684137950": null,
                "ufCrm19_1684138153": "",
                "ufCrm19_1684142357": [],
                "assignedById": 255,
                "lastActivityBy": 255,
                "lastActivityTime": "2023-05-15T11:31:08+03:00",
                "parentId2": 10133,
                "utmSource": null,
                "utmMedium": null,
                "utmCampaign": null,
                "utmContent": null,
                "utmTerm": null,
                "observers": [],
                "contactIds": [],
                "entityTypeId": 184
            },
            {
                "id": 7,
                "xmlId": "",
                "title": "СП для приложения \"Передача заказа #7",
                "createdBy": 255,
                "updatedBy": 255,
                "movedBy": 255,
                "createdTime": "2023-05-15T11:31:38+03:00",
                "updatedTime": "2023-05-15T11:31:38+03:00",
                "movedTime": null,
                "categoryId": 25,
                "opened": "N",
                "previousStageId": "",
                "begindate": "2023-05-15T03:00:00+03:00",
                "closedate": "2023-05-22T03:00:00+03:00",
                "companyId": 0,
                "contactId": 0,
                "opportunity": 0,
                "isManualOpportunity": "N",
                "taxValue": 0,
                "currencyId": "RUB",
                "opportunityAccount": 0,
                "taxValueAccount": 0,
                "accountCurrencyId": "RUB",
                "mycompanyId": 33,
                "sourceId": "CALL",
                "sourceDescription": "",
                "webformId": 0,
                "ufCrm19_1684137706": "Bla-bla-bla",
                "ufCrm19_1684137811": 5,
                "ufCrm19_1684137822": 456,
                "ufCrm19_1684137877": 24,
                "ufCrm19_1684137925": 1.5431999999999999,
                "ufCrm19_1684137950": 9.8765000000000001,
                "ufCrm19_1684138153": "http://google.com",
                "ufCrm19_1684142357": [],
                "assignedById": 255,
                "lastActivityBy": 255,
                "lastActivityTime": "2023-05-15T11:31:38+03:00",
                "parentId2": 10133,
                "utmSource": null,
                "utmMedium": null,
                "utmCampaign": null,
                "utmContent": null,
                "utmTerm": null,
                "observers": [],
                "contactIds": [],
                "entityTypeId": 184
            },
            {
                "id": 9,
                "xmlId": "",
                "title": "СП для приложения \"Передача заказа #9",
                "createdBy": 255,
                "updatedBy": 255,
                "movedBy": 255,
                "createdTime": "2023-05-15T12:04:19+03:00",
                "updatedTime": "2023-05-15T12:04:19+03:00",
                "movedTime": null,
                "categoryId": 25,
                "opened": "N",
                "previousStageId": "",
                "begindate": "2023-05-15T03:00:00+03:00",
                "closedate": "2023-05-22T03:00:00+03:00",
                "companyId": 0,
                "contactId": 0,
                "opportunity": 0,
                "isManualOpportunity": "N",
                "taxValue": 0,
                "currencyId": "RUB",
                "opportunityAccount": 0,
                "taxValueAccount": 0,
                "accountCurrencyId": "RUB",
                "mycompanyId": 33,
                "sourceId": "CALL",
                "sourceDescription": "",
                "webformId": 0,
                "ufCrm19_1684137706": "Bla-bla-bla",
                "ufCrm19_1684137811": 5,
                "ufCrm19_1684137822": 456,
                "ufCrm19_1684137877": 24,
                "ufCrm19_1684137925": 1.5431999999999999,
                "ufCrm19_1684137950": 9.8765000000000001,
                "ufCrm19_1684138153": "http://google.com",
                "ufCrm19_1684142357": [],
                "assignedById": 255,
                "lastActivityBy": 255,
                "lastActivityTime": "2023-05-15T12:04:19+03:00",
                "parentId2": 10133,
                "utmSource": null,
                "utmMedium": null,
                "utmCampaign": null,
                "utmContent": null,
                "utmTerm": null,
                "observers": [],
                "contactIds": [],
                "entityTypeId": 184
            },
            {
                "id": 11,
                "xmlId": "",
                "title": "СП для приложения \"Передача заказа #11",
                "createdBy": 255,
                "updatedBy": 255,
                "movedBy": 255,
                "createdTime": "2023-05-15T12:21:32+03:00",
                "updatedTime": "2023-05-15T12:21:32+03:00",
                "movedTime": null,
                "categoryId": 25,
                "opened": "N",
                "previousStageId": "",
                "begindate": "2023-05-15T03:00:00+03:00",
                "closedate": "2023-05-22T03:00:00+03:00",
                "companyId": 0,
                "contactId": 0,
                "opportunity": 0,
                "isManualOpportunity": "N",
                "taxValue": 0,
                "currencyId": "RUB",
                "opportunityAccount": 0,
                "taxValueAccount": 0,
                "accountCurrencyId": "RUB",
                "mycompanyId": 33,
                "sourceId": "CALL",
                "sourceDescription": "",
                "webformId": 0,
                "ufCrm19_1684137706": "Bla-bla-bla",
                "ufCrm19_1684137811": 5,
                "ufCrm19_1684137822": 456,
                "ufCrm19_1684137877": 24,
                "ufCrm19_1684137925": 1.5431999999999999,
                "ufCrm19_1684137950": 9.8765000000000001,
                "ufCrm19_1684138153": "http://google.com",
                "ufCrm19_1684142357": [
                    "123;tryu;345tyuhjiuy87",
                    "Ula-la;Panda;zilu"
                ],
                "assignedById": 255,
                "lastActivityBy": 255,
                "lastActivityTime": "2023-05-15T12:21:32+03:00",
                "parentId2": 10133,
                "utmSource": null,
                "utmMedium": null,
                "utmCampaign": null,
                "utmContent": null,
                "utmTerm": null,
                "observers": [],
                "contactIds": [],
                "entityTypeId": 184
            }
        ]
    },
    "total": 6,
    "time": {
        "start": 1684149512.7757471,
        "finish": 1684149513.066793,
        "duration": 0.2910459041595459,
        "processing": 0.2115778923034668,
        "date_start": "2023-05-15T14:18:32+03:00",
        "date_finish": "2023-05-15T14:18:33+03:00",
        "operating_reset_at": 1684150112,
        "operating": 0.21154594421386719
    }
}