const SMART_PROCESS_NUMBER = 184;

// const DESC_ORDER = "UF_CRM_1655918107";
const MANUFACTURING_TECHNOLOGY = "UF_CRM_1625666854";   // технология изготовления
const FILM_WIDTH = "UF_CRM_1672744985962";   // ширина пленки


// Идентификаторы полей строги - ИТОГО
const ID__SUMMARY_COUNT_POSITION = "SummaryCountPosition";
const ID__SUMMARY_COUNT_PRODUCTS = "SummaryCountProducts";
const ID__SUMMARY_AREA_RUNNING_METERS = "SummaryAreaRunningMeters";
const ID__SUMMARY_AREA_SQUARE_METERS = "SummaryAreaSquareMeters";

const ID__ADD_PRODUCT = "CreateProduct";
const ADD_FILE_TO_PRODUCT = "product-choose-file-button";
const ADD_FILE_TO_PRODUCT_INPUT = "product-choose-file-input";
const REMOOVE_FILE_FROM_PRODUCT = "button-product-remoove-file";



// Классы элементов строки продукта 
const PRODUCTS_DESC = "product-desc-item";
const PRODUCTS_COUNT = "product-count-item";
const PRODUCTS_MANUFACTURING_TECHNOLOGY = "product-manufact-technol-item";
const PRODUCTS_FILM_WIDTH = "product-film-width-item";
const PRODUCTS_AREA_RUNNING_METERS = "product-area-running-meters-item";
const PRODUCTS_AREA_SQUARE_METERS = "product-area-square-meters-item";
const PRODUCTS_LINK_SOURCES_CLIENT = "product-link-sources-client-item";
const PRODUCTS_FILES_CLIENT = "product-link-files-client-item";
const PRODUCTS_AREA = "product-area-item";

// Название полей из смартпроцесса
const FIELD_PRODUCTS_DESC = "ufCrm19_1684137706";
const FIELD_PRODUCTS_COUNT = "ufCrm19_1684137811";
const FIELD_PRODUCTS_MANUFACTURING_TECHNOLOGY = "ufCrm19_1684137822";
const FIELD_PRODUCTS_FILM_WIDTH = "ufCrm19_1684137877";
const FIELD_PRODUCTS_AREA_RUNNING_METERS = "ufCrm19_1684137925";
const FIELD_PRODUCTS_AREA_SQUARE_METERS = "ufCrm19_1684137950";
const FIELD_PRODUCTS_LINK_SOURCES_CLIENT = "ufCrm19_1684138153";
const FIELD_PRODUCTS_FILES_CLIENT = "ufCrm19_1684142357";

class ProductRow {
    constructor(parentClass, container, bx24, yaDisk, itemsManufactTechn, itemsFilmWidth, dealId) {
        this.parentClass = parentClass;
        this.container = container;
        this.bx24 = bx24;
        this.yaDisk = yaDisk;
        this.dealId = dealId;

        // Технология изготовления - список словарей [{ID: "1", VALUE: "abc"}, ...]
        this.itemsManufactTechn = itemsManufactTechn;
        // Ширина пленки - список словарей [{ID: "1", VALUE: "2.5"}, ...]
        this.itemsFilmWidth = itemsFilmWidth;

        this.element = null;    // элемент строки продукта 
        this.smartProcessId = null;
        this.data = {};
        this.files = [];    // список файлов прикрепленных к продукту
    }

    init() {
        // Событие нажатия кнопки дообавления нового файла к продукту -> вызов события добавления файла 
        this.element.addEventListener("click", async (e) => {
            if (e.target.classList.contains(ADD_FILE_TO_PRODUCT)) {
                let elemInput = e.target.parentNode.querySelector("input");
                elemInput.click();
            }
        })
        // Событие добавления файла
        this.element.addEventListener('change', async (e) => {
            if (e.target.classList.contains(ADD_FILE_TO_PRODUCT_INPUT)) {
                let elemSpinner = e.target.parentNode.parentNode.querySelector("span");
                const file = e.target.files[0];
                elemSpinner.classList.remove("d-none");
                let link = await this.yaDisk.uploadFile(this.dealId, file.name, file);
                elemSpinner.classList.add("d-none");
                this.files.push({
                    "url": link,
                    "name": file.name,
                    "size": this.formatFileSize(file.size)
                });
                this.renderTableFilesHTML();
                BX24.fitWindow();
            }
        });
        // Событие удаления файла
        this.element.addEventListener("click", async (e) => {
            if (e.target.classList.contains(REMOOVE_FILE_FROM_PRODUCT)) {
                let rowFile = e.target.closest(".file-row");
                console.log("rowFile = ", rowFile);
                let containerFiles = rowFile.parentNode;
                console.log("containerFiles = ", containerFiles);
                const childIndex = Array.prototype.indexOf.call(containerFiles.children, rowFile);
                console.log("childIndex = ", childIndex);
                // let elemTbody = e.target.closest("tbody");
                // let elemTr = e.target.closest("tr");
                // const childIndex = Array.prototype.indexOf.call(elemTbody.children, elemTr);
                this.files.splice(childIndex, 1);
                this.renderTableFilesHTML();
                console.log(this.files);
                BX24.fitWindow();
            }
        })
        // Событие изменения поля "м. пог"
        this.element.addEventListener("change", async (e) => {
            if (e.target.classList.contains(PRODUCTS_AREA_RUNNING_METERS)) {
                let idWidth = this.getProductFilmWidth();
                const found = this.itemsFilmWidth.find(item => item.ID == idWidth);
                if (found) {
                    let area = parseFloat(e.target.value.replace(",", ".")) * parseFloat(found.VALUE.replace(",", "."));
                    this.setProductAreaSquareMeters(area);
                }
            }
        })
        // Событие изменения поля "м2"
        this.element.addEventListener("change", async (e) => {
            if (e.target.classList.contains(PRODUCTS_AREA_SQUARE_METERS)) {
                let idWidth = this.getProductFilmWidth();
                const found = this.itemsFilmWidth.find(item => item.ID == idWidth);
                if (found) {
                    let area = parseFloat(e.target.value.replace(",", ".")) / parseFloat(found.VALUE.replace(",", "."));
                    this.setProductAreaRunningMeters(area);
                }
            }
        })
        // Событие изменения поля "Ширина пленки"
        this.element.addEventListener("change", async (e) => {
            if (e.target.classList.contains(PRODUCTS_FILM_WIDTH)) {
                let runningMeters = this.getProductAreaRunningMeters();
                let idWidth = this.getProductFilmWidth();
                const found = this.itemsFilmWidth.find(item => item.ID == idWidth);
                if (found) {
                    let area = parseFloat(runningMeters) * parseFloat(found.VALUE.replace(",", "."));
                    this.setProductAreaSquareMeters(area);
                }
            }
        })
        // Событие изменения значений полей
        this.element.addEventListener("change", async (e) => {
            if (e.target.hasAttribute('data-field')) {
                this.updateDate();
            }
        })
    }

    async addRow(data={}) {
        this.saveFilesHTML(data[FIELD_PRODUCTS_FILES_CLIENT] || "");
        this.element = document.createElement('div');
        this.data = data;
        this.smartProcessId = data.id;
        let contentHTML = `
            <div class="row product-row" data-smart-id="${this.smartProcessId || ''}">
                <div class="col-2 m-0 p-1">
                    <input type="text" class="form-control ${PRODUCTS_DESC}" placeholder="Не заполнено" data-field="${FIELD_PRODUCTS_DESC}" value="${data[FIELD_PRODUCTS_DESC] || ""}">
                </div>
                <div class="col-1 m-0 p-1">
                    <input type="number" step="1" min="0" class="form-control ${PRODUCTS_COUNT}" placeholder="Не заполнено" data-field="${FIELD_PRODUCTS_COUNT}" value="${data[FIELD_PRODUCTS_COUNT] || ""}">
                </div>
                <div class="col-2 m-0 p-1">
                    <select class="form-select ${PRODUCTS_MANUFACTURING_TECHNOLOGY}" aria-label=".form-select-lg example" data-field="${FIELD_PRODUCTS_MANUFACTURING_TECHNOLOGY}">
                        ${this.getOptionsManufactTechnHTML(data[FIELD_PRODUCTS_MANUFACTURING_TECHNOLOGY] || "")}
                    </select>
                </div>
                <div class="col-1 m-0 p-1">
                    <select class="form-select ${PRODUCTS_FILM_WIDTH}" aria-label=".form-select-lg example" data-field="${FIELD_PRODUCTS_FILM_WIDTH}">
                        ${this.getOptionsFilmWidthHTML(data[FIELD_PRODUCTS_FILM_WIDTH] || "")}
                    </select>
                </div>
                <div class="row col-2 m-0 p-1 ${PRODUCTS_AREA}" style="height: fit-content;">
                    <div class="col-5 m-0 p-0">
                        <input type="number" min="0" class="form-control ${PRODUCTS_AREA_RUNNING_METERS}" placeholder="" data-field="${FIELD_PRODUCTS_AREA_RUNNING_METERS}" value="${data[FIELD_PRODUCTS_AREA_RUNNING_METERS] || ""}">
                    </div>
                    <div class="col-2 m-0 p-0 d-flex align-items-center justify-content-center text-secondary">
                        <i class="bi bi-arrow-left-right" style="cursor: pointer;"
                        onmouseover="this.style.color='black';" 
                        onmouseout="this.style.color='#6c757d';"></i>
                    </div>
                    <div class="col-5 m-0 p-0">
                        <input type="number" min="0" class="form-control ${PRODUCTS_AREA_SQUARE_METERS}" placeholder="" data-field="${FIELD_PRODUCTS_AREA_SQUARE_METERS}" value="${data[FIELD_PRODUCTS_AREA_SQUARE_METERS] || ""}">
                    </div>
                </div>
                <div class="col-2 m-0 p-1">
                    <input type="url" class="form-control ${PRODUCTS_LINK_SOURCES_CLIENT}" placeholder="" data-field="${FIELD_PRODUCTS_LINK_SOURCES_CLIENT}" value="${data[FIELD_PRODUCTS_LINK_SOURCES_CLIENT] || ""}">
                </div>
                <div class="col-2 m-0 p-1">
                    <div class="m-0 p-0" style="width: 100%; font-size: 14px;">
                        <div class="${PRODUCTS_FILES_CLIENT}"  style="display: flex; width: 100%; flex-direction: column;"></div>
                    </div>
                    <div class="row m-0 p-0">
                        <div class="col-1 m-0 p-0"><span class="spinner-border spinner-border-sm d-none" role="status" aria-hidden="true"></span></div>
                        <div class="col-10 m-0 p-0">
                            <p class="m-0 p-0 ${ADD_FILE_TO_PRODUCT}" style="font-size: 14px; text-decoration: underline; color: #0d6efd; cursor: pointer;">Добавить+</p>
                            <input class="d-none product-choose-file-input ${ADD_FILE_TO_PRODUCT_INPUT}" type="file" id="">
                        </div>
                    </div>
                </div>
            </div>
        `;
        // <table class="table table-borderless table-sm m-0 p-0" style="width: 100%; font-size: 14px;">
        //                 <colgroup>
        //                     <col width="25px">
        //                     <col >
        //                     <col width="50px">
        //                     <col width="25px">
        //                 </colgroup>
        //                 <tbody class="${PRODUCTS_FILES_CLIENT}"  style="width: 100%;">
        //                 </tbody>
        //             </table>
        this.element.innerHTML = contentHTML;
        this.container.append(this.element);
        this.init();
        this.renderTableFilesHTML();
        BX24.fitWindow();
        if (!this.smartProcessId) {
            this.updateDate();
            await this.addSmartProcessToBx24();
        }
        BX24.fitWindow();
    }

    getData() {
        this.data[FIELD_PRODUCTS_FILES_CLIENT] = [];
        for (let file of this.files) {
            this.data[FIELD_PRODUCTS_FILES_CLIENT].push(`${file.name};${file.size};${file.url}`);
        }
        return this.data;
    }

    updateDate() {
        let elements = this.element.querySelectorAll("[data-field]");
        for (let elem of elements) {
            this.data[elem.dataset.field] = elem.value;
        }
        this.parentClass.setSummaryData();
    }

    getOptionsManufactTechnHTML(manufactTechnId) {
        let contentHTML = "";
        for (let item of this.itemsManufactTechn) {
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
        for (let item of this.itemsFilmWidth) {
            if (item.ID == filmWidthId) {
                contentHTML += `<option value="${item.ID}" selected>${item.VALUE}</option>`;
            } else {
                contentHTML += `<option value="${item.ID}">${item.VALUE}</option>`;
            }
        }
        return contentHTML;
    }

    saveFilesHTML(filesData) {
        for (let i in filesData) {
            let fileData = filesData[i].split(";");
            this.files.push({
                "name": fileData[0],
                "size": fileData[1],
                "url": fileData[2],
            });
        }
    }

    renderTableFilesHTML() {
        let contentHTML = "";
        for (let i in this.files) {
            let fileData = this.files[i];
            contentHTML += this.getRowTableFileHTML(+i + 1, fileData.name, fileData.size, fileData.url);
        }
        let filesContainer = this.element.querySelector(`.${PRODUCTS_FILES_CLIENT}`);
        filesContainer.innerHTML = contentHTML;
    }

    getRowTableFileHTML(number, fileName, fileSize, fileLink) {
        let contentHTML = `
            <div class="m-0 p-0 file-row" style="display: flex; width: 100%;">
                <div class="text-secondary m-0 p-0 product-number-file" style="width: 20px;">${number}</div>
                <div class="m-0 p-0 text-truncate" style="width: 100%;"><a href="${fileLink}" class="link-underline-primary " target="_blank">${fileName}</a></div>
                <div class="text-secondary m-0 p-0" style="width: 50px;">${fileSize}</div>
                <div class="m-0 p-0" style="width: 20px;"><button type="button" class="btn-close btn-sm m-0 p-0 ${REMOOVE_FILE_FROM_PRODUCT}" aria-label="Close"></button></div>
            </div>
        `;
    //     <tr class="m-0 p-0" style="width: 100%;">
    //     <td class="text-secondary m-0 p-0 product-number-file" style="width: 20px;">${number}</td>
    //     <td class="m-0 p-0 text-truncate"><a href="${fileLink}" class="link-underline-primary " target="_blank">${fileName}</a></td>
    //     <td class="text-secondary m-0 p-0" style="width: 45px;">${fileSize}</td>
    //     <td class="m-0 p-0" style="width: 20px;"><button type="button" class="btn-close btn-sm m-0 p-0 ${REMOOVE_FILE_FROM_PRODUCT}" aria-label="Close"></button></td>
    // </tr>
        return contentHTML;
    }

    formatFileSize(size) {
        const KB = 1024;
        const MB = KB * KB;
        if (size < KB) {
            return size + "B";
        } else if (size < MB) {
            return (size / KB).toFixed(2) + "KB";
        } else {
            return (size / MB).toFixed(2) + "MB";
        }
    }

    async addSmartProcessToBx24() {
        let data = this.getData();
        data["parentId2"] = this.dealId;
        let response = await this.bx24.callMethod("crm.item.add", {
            entityTypeId: SMART_PROCESS_NUMBER,
            fields: data,
        });
        // console.log("response => ", response);
        this.data.id = response.item.id;
        this.smartProcessId = response.item.id;
        return response.item;
    }

    getDesc() {
        return this.element.querySelector(`${PRODUCTS_DESC}`).value;
    }

    getProductCount() {
        return this.element.querySelector(`${PRODUCTS_COUNT}`).value;
    }

    getProductManufacturingTechnology() {
        return this.element.querySelector(`.${PRODUCTS_MANUFACTURING_TECHNOLOGY}`).value;
    }

    getProductFilmWidth() {
        return this.element.querySelector(`.${PRODUCTS_FILM_WIDTH}`).value;
    }

    getProductAreaRunningMeters() {
        return this.element.querySelector(`.${PRODUCTS_AREA_RUNNING_METERS}`).value;
    }

    getProductAreaSquareMeters() {
        return this.element.querySelector(`.${PRODUCTS_AREA_SQUARE_METERS}`).value;
    }

    getProductLinkSourceClient() {
        return this.element.querySelector(`.${PRODUCTS_LINK_SOURCES_CLIENT}`).value;
    }

    getProductFilesClient() {
        return this.element.querySelector(`.${PRODUCTS_FILES_CLIENT}`).value;
    }

    setProductManufacturingTechnology(val) {
        return this.element.querySelector(`.${PRODUCTS_MANUFACTURING_TECHNOLOGY}`).value = val;
    }

    setProductFilmWidth(val) {
        return this.element.querySelector(`.${PRODUCTS_FILM_WIDTH}`).value = val;
    }

    setProductAreaRunningMeters(val) {
        return this.element.querySelector(`.${PRODUCTS_AREA_RUNNING_METERS}`).value = val;
    }

    setProductAreaSquareMeters(val) {
        return this.element.querySelector(`.${PRODUCTS_AREA_SQUARE_METERS}`).value = val;
    }

    setProductLinkSourceClient(val) {
        return this.element.querySelector(`.${PRODUCTS_LINK_SOURCES_CLIENT}`).value = val;
    }

    setProductFilesClient(val) {
        return this.element.querySelector(`.${PRODUCTS_FILES_CLIENT}`).value = val;
    }
      
}

export default class InterfaceBlockfour {
    constructor(container, bx24, yaDisk, dealId) {
        this.container = container;
        this.bx24 = bx24;
        this.yaDisk = yaDisk;
        this.dealId = dealId;
        this.smartNumber = 184;

        this.productsObj = [];
        
        this.elemSummaryCountPosition = null;
        this.elemSummaryCountProducts = null;
        this.elemSummaryAreaRunningMeters = null;
        this.elemSummaryAreaSquareMeters = null;
        this.containerBody = null;
        
        this.dealId = null;
        this.itemsdManufactTechn = null;
        this.itemsFilmWidth = null;
        this.elemAddProduct = null;
    }

    init() {
        this.renderInit();
        this.elemSummaryCountPosition = this.container.querySelector(`#${ID__SUMMARY_COUNT_POSITION}`);
        this.elemSummaryCountProducts = this.container.querySelector(`#${ID__SUMMARY_COUNT_PRODUCTS}`);
        this.elemSummaryAreaRunningMeters = this.container.querySelector(`#${ID__SUMMARY_AREA_RUNNING_METERS}`);
        this.elemSummaryAreaSquareMeters = this.container.querySelector(`#${ID__SUMMARY_AREA_SQUARE_METERS}`);
        this.containerProductList = this.container.querySelector("#productsListBody");
        this.elemAddProduct = this.container.querySelector(`#${ID__ADD_PRODUCT}`);
        this.initHandler();
    }

    // init_() {
    //     this.renderInit();
    //     this.elemSummaryCountPosition = this.container.querySelector(`#${ID__SUMMARY_COUNT_POSITION}`);
    //     this.elemSummaryCountProducts = this.container.querySelector(`#${ID__SUMMARY_COUNT_PRODUCTS}`);
    //     this.elemSummaryAreaRunningMeters = this.container.querySelector(`#${ID__SUMMARY_AREA_RUNNING_METERS}`);
    //     this.elemSummaryAreaSquareMeters = this.container.querySelector(`#${ID__SUMMARY_AREA_SQUARE_METERS}`);
    //     this.containerProductList = this.container.querySelector("#productsListBody");
    //     this.elemAddProduct = this.container.querySelector(`#${ID__ADD_PRODUCT}`);
    // }

    // async update() {
    //     for (let i = 0; i < objects.length; i++) {
    //         productsObj[i] = null;
    //     }
    //     this.productsObj = [];
    //     let productsList = await this.getProductsList(this.smartNumber, this.dealId);
    //     this.init_();
    //     await this.render_(productsList);
    // }

    initHandler() {
        // Добавление нового продукта
        this.container.addEventListener("click", async (e) => {
            if (e.target == this.elemAddProduct) {
                let productObj = new ProductRow(this, this.containerProductList, this.bx24, this.yaDisk, this.itemsdManufactTechn, this.itemsFilmWidth, this.dealId);
                productObj.addRow();
                this.productsObj.push(productObj);
                this.setSummaryData();
            }
        })
    }

    getData() {
        let data = [];
        for (let product of this.productsObj) {
            data.push(product.getData());
        }
        return data;
    }

    getDataOld() {
        let data = [];
        for (let product of this.productsObj) {
            let productData = product.getData();
            if ("id" in productData) {
                data.push(productData);
            }
        }
        return data;
    }

    getDataNew() {
        let data = [];
        for (let product of this.productsObj) {
            let productData = product.getData();
            if ("id" in productData) {
                continue;
            }
            data.push(productData);
        }
        
        return data;
    }

    setSummaryData() {
        let countPosition = this.productsObj.length;
        let countProducts = 0;
        let areaRunningMeters = 0;
        let areaSquareMeters = 0;
        for (let product of this.productsObj) {
            let productData = product.getData();
            if (productData[FIELD_PRODUCTS_COUNT]) {
                countProducts += parseFloat(productData[FIELD_PRODUCTS_COUNT]);
            }
            if (productData[FIELD_PRODUCTS_AREA_RUNNING_METERS]) {
                areaRunningMeters += parseFloat(productData[FIELD_PRODUCTS_AREA_RUNNING_METERS]);
            }
            if (productData[FIELD_PRODUCTS_AREA_SQUARE_METERS]) {
                areaSquareMeters += parseFloat(productData[FIELD_PRODUCTS_AREA_SQUARE_METERS]);
            }
        }
        this.elemSummaryCountPosition.innerHTML = countPosition;
        this.elemSummaryCountProducts.innerHTML = countProducts;
        this.elemSummaryAreaRunningMeters.innerHTML = areaRunningMeters.toFixed(3);
        this.elemSummaryAreaSquareMeters.innerHTML = areaSquareMeters.toFixed(3);
    }

    renderInit() {
        let contentHTML = `
            <div class="product-list-header">
                ${this.getHeaderHTML()}
            </div>
            <div class="products-list-body" id="productsListBody">
                <!--  -->
            </div>
            <div class="product-list-add-element">
                <div class="col-1 p-0 my-2">
                    <i class="bi bi-plus-circle-fill m-0 p-2 text-success" style="cursor: pointer; " id="${ID__ADD_PRODUCT}"></i>
                </div>
            </div>
            <div class="product-list-footer">
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
        let data = await this.bx24.callMethod(
            "crm.item.list",
            {
                "entityTypeId": smartNumber,
                "filter": { "parentId2": dealId },
                "select": [
                    "id",
                    FIELD_PRODUCTS_DESC,
                    FIELD_PRODUCTS_COUNT,
                    FIELD_PRODUCTS_MANUFACTURING_TECHNOLOGY,
                    FIELD_PRODUCTS_FILM_WIDTH,
                    FIELD_PRODUCTS_AREA_RUNNING_METERS,
                    FIELD_PRODUCTS_AREA_SQUARE_METERS,
                    FIELD_PRODUCTS_LINK_SOURCES_CLIENT,
                    FIELD_PRODUCTS_FILES_CLIENT,
                ]
            }
        );
        // return data.result.items;
        return data.items;
    }

    async render(fields, data) {
        this.productsObj = [];
        this.itemsdManufactTechn = fields[MANUFACTURING_TECHNOLOGY].items;
        this.itemsFilmWidth = fields[FILM_WIDTH].items;
        this.dealId = data.ID;
        let productsList = await this.getProductsList(this.smartNumber, data.ID);
        for (let product of productsList) {
            let productObj = new ProductRow(this, this.containerProductList, this.bx24, this.yaDisk, this.itemsdManufactTechn, this.itemsFilmWidth, this.dealId);
            productObj.addRow(product);
            this.productsObj.push(productObj);
        }
        this.setSummaryData();
    }

    // async render_(productsList) {
    //     for (let product of productsList) {
    //         let productObj = new ProductRow(this, this.containerProductList, this.bx24, this.yaDisk, this.itemsdManufactTechn, this.itemsFilmWidth, this.dealId);
    //         productObj.addRow(product);
    //         this.productsObj.push(productObj);
    //     }
    //     this.setSummaryData();
    // }
}
