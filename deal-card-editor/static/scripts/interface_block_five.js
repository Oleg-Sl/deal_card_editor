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
// const FIELD_PRODUCTS_MANUFACTURING_TECHNOLOGY = "ufCrm19_1684137822";
// const FIELD_PRODUCTS_FILM_WIDTH = "ufCrm19_1684137877";
// const FIELD_PRODUCTS_AREA_RUNNING_METERS = "ufCrm19_1684137925";
// const FIELD_PRODUCTS_AREA_SQUARE_METERS = "ufCrm19_1684137950";
const FIELD_PRODUCTS_MANUFACTURING_TECHNOLOGY = "ufCrm19_1689155340";
const FIELD_PRODUCTS_FILM_WIDTH = "ufCrm19_1689155449";
const FIELD_PRODUCTS_AREA_RUNNING_METERS = "ufCrm19_1689155525";
const FIELD_PRODUCTS_AREA_SQUARE_METERS = "ufCrm19_1689155598";
const FIELD_PRODUCTS_LINK_SOURCES_CLIENT = "ufCrm19_1684138153";
const FIELD_PRODUCTS_FILES_CLIENT = "ufCrm19_1684142357";


class ProductRow {
    constructor(parentClass, container, bx24, yaDisk, itemsManufactTechn, itemsFilmWidth, dealId, currentNumb) {
        this.parentClass = parentClass;
        this.container = container;
        this.bx24 = bx24;
        this.yaDisk = yaDisk;
        this.dealId = dealId;
        this.currentNumb = currentNumb;

        this.checkFileUploadCompletion = true;

        // Технология изготовления - список словарей [{ID: "1", VALUE: "abc"}, ...]
        this.itemsManufactTechn = itemsManufactTechn;
        // Ширина пленки - список словарей [{ID: "1", VALUE: "2.5"}, ...]
        this.itemsFilmWidth = itemsFilmWidth;

        this.element = null;    // элемент строки продукта 
        this.smartProcessId = null;
        this.data = {};
        this.files = [];    // список файлов прикрепленных к продукту
        this.removingFiles = [];
    }

    init() {
        this.setHeightBlockProductDesc(this.element.querySelector(`.${PRODUCTS_DESC}`));
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
                this.checkFileUploadCompletion = false;
                let elemSpinner = e.target.parentNode.parentNode.querySelector("span");
                // const file = e.target.files[0];
                elemSpinner.classList.remove("d-none");
                for (let file of e.target.files) {
                    await this.addFile(this.dealId, file.name, file, file.size);
                }
                // let link = await this.yaDisk.uploadFile(this.dealId, file.name, file);
                // elemSpinner.classList.add("d-none");
                // this.files.push({
                //     "url": link,
                //     "name": file.name,
                //     "size": this.formatFileSize(file.size)
                // });
                // this.renderTableFilesHTML();
                // BX24.fitWindow();
                elemSpinner.classList.add("d-none");
                this.checkFileUploadCompletion = true;
            }
        });
        // Событие удаления файла
        this.element.addEventListener("click", async (e) => {
            if (e.target.classList.contains(REMOOVE_FILE_FROM_PRODUCT)) {
                this.checkFileUploadCompletion = false;
                let rowFile = e.target.closest(".file-row");
                let containerFiles = rowFile.parentNode;
                const childIndex = Array.prototype.indexOf.call(containerFiles.children, rowFile);
                
                let fileData = this.files[childIndex] || {};
                this.removingFiles.push(fileData);
                // let response = await this.yaDisk.removeFile(this.dealId, fileData.name);
                // console.log("removeFile response = ", response);

                this.files.splice(childIndex, 1);
                this.renderTableFilesHTML();
                BX24.fitWindow();
                this.checkFileUploadCompletion = true;
            }
        })
        // Событие изменения поля "м. пог"
        this.element.addEventListener("change", async (e) => {
            if (e.target.classList.contains(PRODUCTS_AREA_RUNNING_METERS)) {
                let containerTechonlogyItem = e.target.closest(".manufact-technology-item");
                let idWidth = containerTechonlogyItem.querySelector(`.${PRODUCTS_FILM_WIDTH}`).value;
                const found = this.itemsFilmWidth.find(item => item.ID == idWidth);
                if (found) {
                    let area = parseFloat(e.target.value.replace(",", ".")) * parseFloat(found.VALUE.replace(",", "."));
                    containerTechonlogyItem.querySelector(`.${PRODUCTS_AREA_SQUARE_METERS}`).value = this.roundToTwoDecimals(area);
                }
            }
        })
        // Событие изменения поля "м2"
        this.element.addEventListener("change", async (e) => {
            if (e.target.classList.contains(PRODUCTS_AREA_SQUARE_METERS)) {
                let containerTechonlogyItem = e.target.closest(".manufact-technology-item");
                let idWidth = containerTechonlogyItem.querySelector(`.${PRODUCTS_FILM_WIDTH}`).value;
                const found = this.itemsFilmWidth.find(item => item.ID == idWidth);
                if (found) {
                    let area = parseFloat(e.target.value.replace(",", ".")) / parseFloat(found.VALUE.replace(",", "."));
                    containerTechonlogyItem.querySelector(`.${PRODUCTS_AREA_RUNNING_METERS}`).value = this.roundToTwoDecimals(area);
                }
            }
        })
        // Событие изменения поля "Ширина пленки"
        this.element.addEventListener("change", async (e) => {
            if (e.target.classList.contains(PRODUCTS_FILM_WIDTH)) {
                let containerTechonlogyItem = e.target.closest(".manufact-technology-item");
                let idWidth = containerTechonlogyItem.querySelector(`.${PRODUCTS_FILM_WIDTH}`).value;
                let runningMeters = containerTechonlogyItem.querySelector(`.${PRODUCTS_AREA_RUNNING_METERS}`).value
                const found = this.itemsFilmWidth.find(item => item.ID == idWidth);
                if (found) {
                    let area = parseFloat(runningMeters) * parseFloat(found.VALUE.replace(",", "."));
                    containerTechonlogyItem.querySelector(`.${PRODUCTS_AREA_SQUARE_METERS}`).value = this.roundToTwoDecimals(area);
                }
            }
        })
        // Событие изменения значений полей 
        this.element.addEventListener("change", async (e) => {
            if (e.target.hasAttribute('data-field')) {
                this.updateDate();
            }
        })
        // Событие изменения значений полей - технология изготовления, ширина и площади
        this.element.addEventListener("change", async (e) => {
            if (e.target.hasAttribute('data-list-field')) {
                this.updateManufactorTechnology();
            }
        })
        // 
        this.element.addEventListener("input", async (e) => {
            if (e.target.classList.contains(PRODUCTS_DESC)) {
                this.setHeightBlockProductDesc(e.target);
                // e.target.style.height = 'auto'; // Сбросить высоту до автоматического размера
                // e.target.style.height = String(parseInt(e.target.scrollHeight) + 5) + 'px'; // Установить высоту на основе прокрутки содержимого
            }
        })
        // Добавление новой технологии изготовления
        this.element.addEventListener("click", async (e) => {
            if (e.target.classList.contains("create-manufacturing-technology")) {
                let containerTechonlogiesList = e.target.closest(".product-techonlogies-list");
                containerTechonlogiesList.insertAdjacentHTML("beforeend", this.getTechnologyHTML(null, null, null, null));
            }
        })
    }

    setHeightBlockProductDesc(elem) {
        elem.style.height = 'auto'; // Сбросить высоту до автоматического размера
        elem.style.height = String(parseInt(elem.scrollHeight) + 5) + 'px'; // Установить высоту на основе прокрутки содержимого
    }

    async addRow(data={}) {
        this.saveFilesHTML(data[FIELD_PRODUCTS_FILES_CLIENT] || "");
        this.element = document.createElement('div');
        this.element.style.paddingBottom = "0px";
        this.data = data;
        this.smartProcessId = data.id;
        console.log("this.data = ", this.data);
        console.log("FIELD_PRODUCTS_MANUFACTURING_TECHNOLOGY = ", this.data[FIELD_PRODUCTS_MANUFACTURING_TECHNOLOGY]);
        if (!this.data[FIELD_PRODUCTS_MANUFACTURING_TECHNOLOGY] || this.data[FIELD_PRODUCTS_MANUFACTURING_TECHNOLOGY].length == 0) {
            if (!this.data[FIELD_PRODUCTS_MANUFACTURING_TECHNOLOGY]) {
                this.data[FIELD_PRODUCTS_MANUFACTURING_TECHNOLOGY] = [];
            }
            if (!this.data[FIELD_PRODUCTS_FILM_WIDTH]) {
                this.data[FIELD_PRODUCTS_FILM_WIDTH] = [];
            }
            if (!this.data[FIELD_PRODUCTS_AREA_RUNNING_METERS]) {
                this.data[FIELD_PRODUCTS_AREA_RUNNING_METERS] = [];
            }
            if (!this.data[FIELD_PRODUCTS_AREA_SQUARE_METERS]) {
                this.data[FIELD_PRODUCTS_AREA_SQUARE_METERS] = [];
            }
            this.data[FIELD_PRODUCTS_MANUFACTURING_TECHNOLOGY].push(this.itemsManufactTechn[0].ID);
            this.data[FIELD_PRODUCTS_FILM_WIDTH].push(this.itemsFilmWidth[0].ID);
            this.data[FIELD_PRODUCTS_AREA_RUNNING_METERS].push(0);
            this.data[FIELD_PRODUCTS_AREA_SQUARE_METERS].push(0);
        }
        let contentHTML = `
            <div class="product-row" data-smart-id="${this.smartProcessId || ''}">
                <div class="m-0 p-0">
                    <p class="m-0 text-center" style="padding-top: 7px;">${this.currentNumb}</p>
                </div>
                <div class="m-0 p-0">
                    <textarea class="form-control ${PRODUCTS_DESC}" rows="1" placeholder="Не заполнено" data-field="${FIELD_PRODUCTS_DESC}">${data[FIELD_PRODUCTS_DESC] || ""}</textarea>
                </div>
                <div class="m-0 p-0">
                    <input type="number" step="1" min="0" class="form-control ${PRODUCTS_COUNT}" placeholder="Не заполнено" data-field="${FIELD_PRODUCTS_COUNT}" value="${data[FIELD_PRODUCTS_COUNT] || ""}">
                </div>
                <div class="product-techonlogies-list m-0 p-0" data-smart-id="1" data-field="">
                    ${this.getProductTechnologiesHTML(data)}
                </div>
                <div class="m-0 p-0">
                    <input type="url" class="form-control ${PRODUCTS_LINK_SOURCES_CLIENT}" placeholder="" data-field="${FIELD_PRODUCTS_LINK_SOURCES_CLIENT}" value="${data[FIELD_PRODUCTS_LINK_SOURCES_CLIENT] || ""}">
                </div>
                <div class="m-0 p-0">
                    <div class="m-0 p-0">
                        <div class="${PRODUCTS_FILES_CLIENT}"></div>
                    </div>
                    <div class="row m-0 p-0">
                        <div class="m-0 p-0"><span class="spinner-border spinner-border-sm d-none" role="status" aria-hidden="true"></span></div>
                        <div class="m-0 p-0 px-4">
                            <p class="text-primary text-decoration-underline m-0 p-0 ${ADD_FILE_TO_PRODUCT}" style="cursor: pointer;">Добавить+</p>
                            <input class="d-none product-choose-file-input ${ADD_FILE_TO_PRODUCT_INPUT}" type="file" id="" multiple>
                        </div>
                    </div>
                </div>
            </div>
        `;
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

    getProductTechnologiesHTML(dataProduct) {
        // console.log("dataProduct = ", dataProduct);
        let manufactTechnologyList = dataProduct[FIELD_PRODUCTS_MANUFACTURING_TECHNOLOGY] || [];
        let filmWidthsList = dataProduct[FIELD_PRODUCTS_FILM_WIDTH] || [];
        let areaRunningMetersList = dataProduct[FIELD_PRODUCTS_AREA_RUNNING_METERS] || [];
        let areaSquareMetersList = dataProduct[FIELD_PRODUCTS_AREA_SQUARE_METERS] || [];
        
        let contentHTML = "";
        for (let i = 0; i < manufactTechnologyList.length; ++i) {
            let areaRunningMeters = this.roundToTwoDecimals(parseFloat(areaRunningMetersList[i]));
            let areaSquareMeters = this.roundToTwoDecimals(parseFloat(areaSquareMetersList[i]));
            contentHTML += this.getTechnologyHTML(manufactTechnologyList[i], filmWidthsList[i], areaRunningMeters, areaSquareMeters);
        }
        
        return contentHTML;
    }

    getTechnologyHTML(idManufactTechnology, idFilmWidths, areaRunningMeters, areaSquareMeters) {
        return `
            <div class="m-0 p-0 manufact-technology-item" >
                <div class="m-0 p-0">
                    <select class="form-select ${PRODUCTS_MANUFACTURING_TECHNOLOGY}" aria-label=".form-select-lg example" data-list-field="${FIELD_PRODUCTS_MANUFACTURING_TECHNOLOGY}">
                        ${this.getOptionsManufactTechnHTML(idManufactTechnology || "")}
                    </select>
                </div>
                <div class="m-0 p-0 products-film-width">
                    <select class="form-select ${PRODUCTS_FILM_WIDTH}" aria-label=".form-select-lg example" data-list-field="${FIELD_PRODUCTS_FILM_WIDTH}">
                        ${this.getOptionsFilmWidthHTML(idFilmWidths) || ""}
                    </select>
                </div>
                <div class="row m-0 p-0 ${PRODUCTS_AREA}">
                    <div class="m-0 p-0">
                        <input type="number" min="0" class="form-control ${PRODUCTS_AREA_RUNNING_METERS}" placeholder="" data-list-field="${FIELD_PRODUCTS_AREA_RUNNING_METERS}" value="${areaRunningMeters || ""}">
                    </div>
                    <div class="m-0 p-0 d-flex align-items-center justify-content-center text-secondary">
                        <i class="bi bi-arrow-left-right" style="cursor: pointer;"
                        onmouseover="this.style.color='black';" 
                        onmouseout="this.style.color='#6c757d';"></i>
                    </div>
                    <div class="m-0 p-0">
                        <input type="number" min="0" class="form-control ${PRODUCTS_AREA_SQUARE_METERS}" placeholder="" data-list-field="${FIELD_PRODUCTS_AREA_SQUARE_METERS}" value="${areaSquareMeters || ""}">
                    </div>
                </div>
                <div class="col-1 p-0 my-2">
                    <i class="bi bi-plus-circle-fill create-manufacturing-technology m-0 p-2 text-success" style="cursor: pointer; " id="createManufacturingTechnology"></i>
                </div>
            </div>
        `;
    }

    async addFile(dealId, fileName, fileData, fileSize) {
        let link = await this.yaDisk.uploadFile(dealId, fileName, fileData);
        this.files.push({
            "url": link,
            "name": fileName,
            "size": this.formatFileSize(fileSize)
        });
        this.renderTableFilesHTML();
        BX24.fitWindow();
    }

    getData() {
        this.data[FIELD_PRODUCTS_FILES_CLIENT] = [];
        for (let file of this.files) {
            this.data[FIELD_PRODUCTS_FILES_CLIENT].push(`${file.name};${file.size};${file.url}`);
        }
        return this.data;
    }

    readyState() {
        return this.checkFileUploadCompletion;
    }

    updateDate() {
        let elements = this.element.querySelectorAll("[data-field]");
        for (let elem of elements) {
            this.data[elem.dataset.field] = elem.value;
        }
        this.parentClass.setSummaryData();
    }

    updateManufactorTechnology() {
        this.data[FIELD_PRODUCTS_MANUFACTURING_TECHNOLOGY] = [];
        this.data[FIELD_PRODUCTS_FILM_WIDTH] = [];
        this.data[FIELD_PRODUCTS_AREA_RUNNING_METERS] = [];
        this.data[FIELD_PRODUCTS_AREA_SQUARE_METERS] = [];
        let rowsTechnologies = this.element.querySelectorAll(".manufact-technology-item");
        for (let rowTechnoloy of rowsTechnologies) {
            let elementsFields = rowTechnoloy.querySelectorAll("[data-list-field]");
            for (let elementField of elementsFields) {
                this.data[elementField.dataset.listField].push(elementField.value);
            }
        }
        this.parentClass.setSummaryData();
    }

    // HTML код опций - технология изготовления
    getOptionsManufactTechnHTML(manufactTechnId=null) {
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

    // HTML код опций - ширина пленки
    getOptionsFilmWidthHTML(filmWidthId=null) {
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

    // сохранение данных файла на диск
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

    // вставка списка файлов с информацией
    renderTableFilesHTML() {
        let contentHTML = "";
        for (let i in this.files) {
            let fileData = this.files[i];
            contentHTML += this.getRowTableFileHTML(+i + 1, fileData.name, fileData.size, fileData.url);
        }
        let filesContainer = this.element.querySelector(`.${PRODUCTS_FILES_CLIENT}`);
        filesContainer.innerHTML = contentHTML;
    }

    // HTML код с информацией о файле
    getRowTableFileHTML(number, fileName, fileSize, fileLink) {
        let contentHTML = `
            <div class="m-0 p-0 file-row" style="">
                <div class="text-secondary m-0 p-0 product-number-file" style="">${number}</div>
                <div class="m-0 p-0 text-truncate" style=""><a href="${fileLink}" class="link-underline-primary " target="_blank">${fileName}</a></div>
                <div class="text-secondary m-0 p-0" style="">${fileSize}</div>
                <div class="m-0 p-0" style=""><button type="button" class="btn-close btn-sm m-0 p-0 ${REMOOVE_FILE_FROM_PRODUCT}" aria-label="Close"></button></div>
            </div>
        `;
        return contentHTML;
    }

    // приведение размера к короткой записи с указанием единицы размера
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

    // приведение числа к строке с двумя знаками после запятой
    roundToTwoDecimals(number) {
        if (isNaN(number) || number == "") {
            return "";
        }
        let roundedNumber = Math.round(number * 100) / 100;
        return roundedNumber.toFixed(2);
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

    initHandler() {
        // Добавление нового продукта
        this.container.addEventListener("click", async (e) => {
            if (e.target == this.elemAddProduct) {
                let productObj = new ProductRow(this, this.containerProductList, this.bx24, this.yaDisk, this.itemsdManufactTechn, this.itemsFilmWidth, this.dealId, this.productsObj.length + 1);
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
        console.log("data 5 = ", data);
        return data;
    }

    async deleteRemovingFiles() {
        let data = [];
        for (let product of this.productsObj) {
            for (let file of product.removingFiles) {
                let response = await this.yaDisk.removeFile(this.dealId, file.name);
                console.log("removeFile response = ", response);
            }
            product.removingFiles = [];
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
                for (let area of productData[FIELD_PRODUCTS_AREA_RUNNING_METERS]) {
                    areaRunningMeters += parseFloat(area);
                }
            }
            if (productData[FIELD_PRODUCTS_AREA_SQUARE_METERS]) {
                for (let area of productData[FIELD_PRODUCTS_AREA_SQUARE_METERS]) {
                    areaSquareMeters += parseFloat(area);
                }
            }
        }
        this.elemSummaryCountPosition.innerHTML = countPosition;
        this.elemSummaryCountProducts.innerHTML = countProducts;
        this.elemSummaryAreaRunningMeters.innerHTML = areaRunningMeters.toFixed(3);
        this.elemSummaryAreaSquareMeters.innerHTML = areaSquareMeters.toFixed(3);
    }

    renderInit() {
        let contentHTML = `
            <div class="p-0 product-list-header">
                ${this.getHeaderHTML()}
            </div>
            <div class="p-0 products-list-body" id="productsListBody">
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
            <div class="product-header-table"">
                <div class="m-0 p-1 align-middle"></div>
                <div><label for="exampleFormControlInput1" class="form-label fw-medium">Описание</label></div>
                <div><label for="exampleFormControlInput1" class="form-label fw-medium">Кол-во</label></div>
                <div><label for="exampleFormControlInput1" class="form-label fw-medium">Технология изготовления</label></div>
                <div><label for="" class="form-label fw-medium">Ширина пленки</label></div>
                <div>
                    <div class="row m-0 p-0 product-manufact-technology-header-table">
                        <div class="row m-0 p-0">
                            <label for="" class="form-label fw-medium">м.пог</label>
                        </div>
                        <div class="row m-0 p-0">
                        </div>
                        <div class="row m-0 p-0">
                            <label for="" class="form-label fw-medium">м2</label>
                        </div>
                    </div>
                </div>
                <div><label for="" class="form-label fw-medium">Ссылка на исходники клиента</label></div>
                <div><label for="" class="form-label fw-medium">Файлы клиента</label></div>
            </div>
        `;
        return contentHTML;
    }

    getFooterHTML() {
        let contentHTML = `
            <div class="p-0 m-0 border-top border-bottom" style="display: flex;">
                <div class="m-0 p-1 align-middle" style="width: 30px;"></div>
                <div class="fw-medium" style="flex-grow: 1;">
                    Итого:
                </div>
                <div class="d-flex justify-content-end col-1 fw-medium">
                    Позиций: &nbsp;<span id="${ID__SUMMARY_COUNT_POSITION}" class="fw-normal">&ndash;</span>
                </div>
                <div class="d-flex justify-content-end col-1 fw-medium">
                    Кол-во: &nbsp;<span id="${ID__SUMMARY_COUNT_PRODUCTS}" class="fw-normal">&ndash;</span>
                </div>
                <div class="col-3"></div>
                <div style="height: fit-content; width: fit-content;">
                    <div class="row">
                        <div class="d-flex justify-content-end col-5 fw-medium">
                            м.пог: &nbsp;<span id="${ID__SUMMARY_AREA_RUNNING_METERS}" class="fw-normal">&ndash;</span>
                        </div>
                        <div class="col-2"></div>
                        <div class="d-flex justify-content-end col-5 fw-medium">
                            м2:  &nbsp;<span id="${ID__SUMMARY_AREA_SQUARE_METERS}" class="fw-normal">&ndash;</span>
                        </div>
                    </div>
                </div>
                                
                <div style="width: 15%; min-width: 200px; max-width: 300px;"></div>
                <div style="width: 20%; min-width: 250px; max-width: 400px;"></div>
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
            let productObj = new ProductRow(this, this.containerProductList, this.bx24, this.yaDisk, this.itemsdManufactTechn, this.itemsFilmWidth, this.dealId, this.productsObj.length + 1);
            productObj.addRow(product);
            this.productsObj.push(productObj);
        }
        this.setSummaryData();
    }

    readyState() {
        let state = true;
        for (let product of this.productsObj) {
            state = state && !product.readyState();
        }
        return state;
    }
}


