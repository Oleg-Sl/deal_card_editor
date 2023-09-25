import { SMART_FIELDS, LIST_TECHNOLOGY, LIST_FILMS,
    LIST_LAMINATIONS, LIST_WIDTH_FILMS, LIST_COUNT_SIDES} from './parameters.js';


const SMART_PROCESS_NUMBER = 144;

const CONTAINER_CLIENT_FILES = "product-list__row-files";
const ADD_FILE_TO_PRODUCT = "product-choose-file-button";
const ADD_FILE_TO_PRODUCT_INPUT = "product-choose-file-input";

const CONTAINER_PREPRESS_FILES = "product-list__row-prepress";
const ADD_FILE_TO_PREPRESS = "prepress-choose-file-button";
const ADD_FILE_TO_PREPRESS_INPUT = "prepress-choose-file-input";


class ProductRow {
    constructor(parentClass, container, bx24, yaDisk, dealId, currentNumb) {
        this.parentClass = parentClass;
        this.container = container;
        this.bx24 = bx24;
        this.yaDisk = yaDisk;
        this.dealId = dealId;
        this.currentNumb = currentNumb;

        this.checkFileUploadCompletion = true;

        // HTML-элемент строки продукта 
        this.element = null;
        // идентификатор элемента смартпроцесса
        this.smartProcessId = null;
        // данные хранящмеся в смарт-процессе
        this.data = {};
        // список файлов прикрепленных к продукту
        this.clientFiles = [];
        // список файлов - черновой препресс
        this.prepressFiles = [];

        // файлы которые нужно удалить по нажатию кнопки
        this.removingFiles = [];

    }

    initHandler() {
        // Событие изменения типа пленки
        this.element.addEventListener("change", async (e) => {
            if (e.target.classList.contains(SMART_FIELDS.FILM)) {
                let selectContainerLamination = this.container.querySelector(`.${SMART_FIELDS.LAMINATION}`);
                selectContainerLamination.innerHTML = this.getOptionsFromArrayForSelectHTML(LIST_LAMINATIONS[e.target.value], LIST_LAMINATIONS[e.target.value][0]);
                selectContainerLamination.value = 0;
                let selectContainerWidth = this.container.querySelector(`.${SMART_FIELDS.WIDTH_FILM}`);
                selectContainerWidth.innerHTML = this.getOptionsForSelectHTML(LIST_WIDTH_FILMS[e.target.value], 0);
                selectContainerWidth.value = 0;
            }
        })
        // Событие нажатия кнопки дообавления нового файла к продукту -> вызов события добавления файла 
        this.element.addEventListener("click", async (e) => {
            if (e.target.classList.contains(ADD_FILE_TO_PRODUCT)) {
                let elemInput = e.target.parentNode.querySelector("input");
                elemInput.click();
                console.log("Открыли окно выбора файла - ADD_FILE_TO_PRODUCT");
            } else if (e.target.classList.contains(ADD_FILE_TO_PREPRESS)) {
                let elemInput = e.target.parentNode.querySelector("input");
                elemInput.click();
                console.log("Открыли окно выбора файла - ADD_FILE_TO_PREPRESS");
            }
        })
        // Событие добавления файла
        this.element.addEventListener('change', async (e) => {
            if (e.target.classList.contains(ADD_FILE_TO_PRODUCT_INPUT) || e.target.classList.contains(ADD_FILE_TO_PREPRESS_INPUT)) {
                let elemSpinner = e.target.parentNode.parentNode.querySelector("span");
                elemSpinner.classList.remove("d-none");
                for (let file of e.target.files) {
                    if (e.target.classList.contains(ADD_FILE_TO_PRODUCT_INPUT)) {
                        console.log("Добавление файла - ADD_FILE_TO_PRODUCT_INPUT");
                        await this.addFile(this.clientFiles, this.dealId, file.name, file, file.size);
                    } else if (e.target.classList.contains(ADD_FILE_TO_PREPRESS_INPUT)) {
                        console.log("Добавление файла - ADD_FILE_TO_PREPRESS_INPUT");
                        await this.addFile(this.prepressFiles, this.dealId, file.name, file, file.size);
                    }
                }
                elemSpinner.classList.add("d-none");
            }
        });
        // Событие удаления файла
        this.element.addEventListener("click", async (e) => {
            if (e.target.classList.contains("product-list__remove-files")) {
                console.log("product-list__remove-files = ", e.target);
                let rowFile = e.target.closest(".file-row");
                let containerFiles = rowFile.parentNode;
                const childIndex = Array.prototype.indexOf.call(containerFiles.children, rowFile);
                
                if (e.target.closest(`.${CONTAINER_CLIENT_FILES}`)) {
                    let fileData = this.clientFiles[childIndex] || {};
                    this.removingFiles.push(fileData);
                    this.clientFiles.splice(childIndex, 1);
                    this.renderFiles(CONTAINER_CLIENT_FILES, this.clientFiles)
                } else if (e.target.closest(`.${CONTAINER_PREPRESS_FILES}`)) {
                    let fileData = this.prepressFiles[childIndex] || {};
                    this.removingFiles.push(fileData);
                    this.prepressFiles.splice(childIndex, 1);
                    this.renderFiles(CONTAINER_PREPRESS_FILES, this.prepressFiles)
                }
                BX24.fitWindow();
            }
        })
        // Событие изменения полей с размерами
        this.element.addEventListener("change", async (e) => {
            if (e.target.classList.contains(SMART_FIELDS.COUNT_PIECES)) {
                this.updateArea();
            } else if (e.target.classList.contains(SMART_FIELDS.LINEAR_METER_PIECES)) {
                this.updateArea();
            } else if (e.target.classList.contains(SMART_FIELDS.SQUARE_METER_PIECES)) {
                this.updateArea();
            }
        })
        // Событие изменения значений любых полей 
        this.element.addEventListener("change", async (e) => {
            if (e.target.hasAttribute('data-field')) {
                this.updateDate();
            }
        })
        // Событие изменения полей textarea
        this.element.addEventListener("input", async (e) => {
            if (e.target.classList.contains(SMART_FIELDS.COMMENT) || e.target.classList.contains(SMART_FIELDS.TITLE)) {
                e.target.style.height = 'auto';
                e.target.style.height = (e.target.scrollHeight) + 'px';
                BX24.fitWindow();
            }
        })
        this.element.addEventListener("focus", async (e) => {
            if (e.target.classList.contains(SMART_FIELDS.COMMENT) || e.target.classList.contains(SMART_FIELDS.TITLE)) {
                BX24.fitWindow();
            }
        })
        this.element.addEventListener("blur", async (e) => {
            if (e.target.classList.contains(SMART_FIELDS.COMMENT) || e.target.classList.contains(SMART_FIELDS.TITLE)) {
                BX24.fitWindow();
            }
        })
        this.element.addEventListener("keyup", async (e) => {
            if (e.target.classList.contains(SMART_FIELDS.COMMENT) || e.target.classList.contains(SMART_FIELDS.TITLE)) {
                BX24.fitWindow();
            }
        })
        this.element.addEventListener("contextmenu", async (e) => {не
            if (e.target.classList.contains(SMART_FIELDS.COMMENT) || e.target.classList.contains(SMART_FIELDS.TITLE)) {
                BX24.fitWindow();
            }
        })
    }

    // получить текущие данные о продукте
    getData() {
        let data = this.data;
        data[SMART_FIELDS.CLIENT_FILES] = [];
        for (let file of this.clientFiles) {
            data[SMART_FIELDS.CLIENT_FILES].push(`${file.name};${file.size};${file.url}`);
        }
        data[SMART_FIELDS.PREPRESS] = [];
        for (let file of this.prepressFiles) {
            data[SMART_FIELDS.PREPRESS].push(`${file.name};${file.size};${file.url}`);
        }
        return data;
    }

    updateArea() {
        let countFloat             = parseFloat(this.element.querySelector(`.${SMART_FIELDS.COUNT_PIECES}`).value.replace(",", "."));
        let linerMeterPiecesFloat  = parseFloat(this.element.querySelector(`.${SMART_FIELDS.LINEAR_METER_PIECES}`).value.replace(",", "."));
        let squareMeterPiecesFloat = parseFloat(this.element.querySelector(`.${SMART_FIELDS.SQUARE_METER_PIECES}`).value.replace(",", "."));
        this.element.querySelector(`.${SMART_FIELDS.LINEAR_METER_TOTAL}`).value = this.roundToTwoDecimals(countFloat * linerMeterPiecesFloat);
        this.element.querySelector(`.${SMART_FIELDS.SQUARE_METER_TOTAL}`).value = this.roundToTwoDecimals(countFloat * squareMeterPiecesFloat);
    }

    async addRow(data=null) {
        if (!data) {
            data = {}
            data[SMART_FIELDS.TITLE] = "";
            data[SMART_FIELDS.COUNT_PIECES] = 0;
            data[TECHNOLOGY] = 0;
            data[FILM] = 0;
            data[LAMINATION] = 0;
            data[WIDTH_FILM] = 0;
            data[LINEAR_METER_PIECES] = 0;
            data[SQUARE_METER_PIECES] = 0;
            data[LINEAR_METER_TOTAL] = 0;
            data[SQUARE_METER_TOTAL] = 0;
            data[LINK_SRC] = "";
            data[CLIENT_FILES] = "";
            data[PREPRESS] = "";
            data[COMMENT] = "";
        };

        // разбивка строки с инормацией о файле, для получения: имени, размера и пути в облаке яндекса
        this.clientFiles = this.getFilesDataFromStr(data[SMART_FIELDS.CLIENT_FILES] || "");
        this.prepressFiles = this.getFilesDataFromStr(data[SMART_FIELDS.PREPRESS] || "");
        // создание контейнера продукта
        this.element = document.createElement('div');
        this.element.style.paddingBottom = "0px";
        this.data = data;

        this.smartProcessId = data.id;
        this.element.innerHTML = this.getRowHTML();
        // вставка HTML-кода продукта на страницу
        this.container.append(this.element);
        // вывод файлов
        this.renderFiles(CONTAINER_CLIENT_FILES, this.clientFiles);
        this.renderFiles(CONTAINER_PREPRESS_FILES, this.prepressFiles);

        // изменение размеров полей: название, комментарий
        let textareaTitle = this.element.querySelector(`.${SMART_FIELDS.TITLE}`);
        textareaTitle.style.height = 'auto';
        textareaTitle.style.height = (textareaTitle.scrollHeight) + 'px';
        let textareaComment = this.element.querySelector(`.${SMART_FIELDS.COMMENT}`);
        textareaComment.style.height = 'auto';
        textareaComment.style.height = (textareaComment.scrollHeight) + 'px';
        
        // инициализация обработчиков
        this.initHandler();
        BX24.fitWindow();
        if (!this.smartProcessId) {
            this.updateDate();
            await this.addSmartProcessToBx24();
        }
    }

    updateDate() {
        let elements = this.element.querySelectorAll("[data-field]");
        for (let elem of elements) {
            this.data[elem.dataset.field] = elem.value;
        }
    }

    // возвращает HTML строки продукта
    getRowHTML() {
        return `
            <div class="product-list__product-row product-list__header-table">
                <div class="m-0 p-1 align-middle">${this.currentNumb}</div>
                <div class="m-0 p-0">
                    <textarea class="form-control ${SMART_FIELDS.TITLE}" rows="1" placeholder="" data-field="${SMART_FIELDS.TITLE}">${this.data[SMART_FIELDS.TITLE] || ""}</textarea>
                </div>
                <div class="m-0 p-0">
                    <input type="number" step="1" min="0" class="form-control ${SMART_FIELDS.COUNT_PIECES}" placeholder="" data-field="${SMART_FIELDS.COUNT_PIECES}" value="${this.data[SMART_FIELDS.COUNT_PIECES] || 0}">
                </div>
                <div class="m-0 p-0">
                    <select class="form-select ${SMART_FIELDS.TECHNOLOGY}" aria-label=".form-select-lg example" data-field="${SMART_FIELDS.TECHNOLOGY}">
                        ${this.getOptionsForSelectHTML(LIST_TECHNOLOGY, this.data[SMART_FIELDS.TECHNOLOGY] || 0)}
                    </select>
                </div>
                <div class="m-0 p-0">
                    <select class="form-select ${SMART_FIELDS.FILM}" aria-label=".form-select-lg example" data-field="${SMART_FIELDS.FILM}">
                        ${this.getOptionsForSelectHTML(LIST_FILMS, this.data[SMART_FIELDS.FILM] || 0)}
                    </select>
                </div>
                <div class="m-0 p-0">
                    <select class="form-select ${SMART_FIELDS.LAMINATION}" aria-label=".form-select-lg example" data-field="${SMART_FIELDS.LAMINATION}">
                        ${this.getOptionsFromArrayForSelectHTML(LIST_LAMINATIONS[this.data[SMART_FIELDS.FILM] || 0], this.data[SMART_FIELDS.LAMINATION] || LIST_LAMINATIONS[this.data[SMART_FIELDS.FILM]][0])}
                    </select>
                </div>
                <div class="m-0 p-0">
                    <select class="form-select ${SMART_FIELDS.WIDTH_FILM}" aria-label=".form-select-lg example" data-field="${SMART_FIELDS.WIDTH_FILM}">
                        ${this.getOptionsForSelectHTML(LIST_WIDTH_FILMS[this.data[SMART_FIELDS.FILM] || 0], this.data[SMART_FIELDS.WIDTH_FILM] || 0)}
                    </select>
                </div>
                <div class="product-list__cols-sizes">
                    <div class="product-list__cols-sizes-10">
                        <div class="m-0 p-0">
                            <input type="number" step="0.01" min="0" class="form-control ${SMART_FIELDS.LINEAR_METER_PIECES}" placeholder="" data-field="${SMART_FIELDS.LINEAR_METER_PIECES}" value="${this.data[SMART_FIELDS.LINEAR_METER_PIECES] || 0}">
                        </div>
                    </div>
                    <div class="product-list__cols-sizes-11">
                        <div class="m-0 p-0">
                            <input type="number" step="0.01" min="0" class="form-control ${SMART_FIELDS.SQUARE_METER_PIECES}" placeholder="" data-field="${SMART_FIELDS.SQUARE_METER_PIECES}" value="${this.data[SMART_FIELDS.SQUARE_METER_PIECES] || 0}">
                        </div>
                    </div>
                    <div class="product-list__cols-sizes-20">
                        <div class="m-0 p-0">
                            <input type="number" step="0.01" min="0" class="form-control ${SMART_FIELDS.LINEAR_METER_TOTAL}" placeholder="" data-field="${SMART_FIELDS.LINEAR_METER_TOTAL}" value="${this.data[SMART_FIELDS.LINEAR_METER_TOTAL] || 0}">
                        </div>
                    </div>
                    <div class="product-list__cols-sizes-21">
                        <div class="m-0 p-0">
                            <input type="number" step="0.01" min="0" class="form-control ${SMART_FIELDS.SQUARE_METER_TOTAL}" placeholder="" data-field="${SMART_FIELDS.SQUARE_METER_TOTAL}" value="${this.data[SMART_FIELDS.SQUARE_METER_TOTAL] || 0}">
                        </div>
                    </div>
                </div>

                <div class="m-0 p-0">
                    <input type="url" class="form-control ${SMART_FIELDS.LINK_SRC}" placeholder="" data-field="${SMART_FIELDS.LINK_SRC}" value="${this.data[SMART_FIELDS.LINK_SRC] || "-"}">
                </div>
                <div class="m-0 p-0">
                    <div class="m-0 p-0">
                        <div class="${CONTAINER_CLIENT_FILES}">
                        </div>
                    </div>
                    <div class="row m-0 p-0">
                        <div class="m-0 p-0"><span class="spinner-border spinner-border-sm d-none" role="status" aria-hidden="true"></span></div>
                        <div class="m-0 p-0 px-4">
                            <p class="text-primary text-decoration-underline m-0 p-0 ${ADD_FILE_TO_PRODUCT}" style="cursor: pointer;">Добавить+</p>
                            <input class="d-none ${ADD_FILE_TO_PRODUCT_INPUT}" type="file" id="" multiple>
                        </div>
                    </div>
                </div>
                <div class="m-0 p-0">
                    <div class="m-0 p-0">
                        <div class="${CONTAINER_PREPRESS_FILES}">
                        </div>
                    </div>
                    <div class="row m-0 p-0">
                        <div class="m-0 p-0"><span class="spinner-border spinner-border-sm d-none" role="status" aria-hidden="true"></span></div>
                        <div class="m-0 p-0 px-4">
                            <p class="text-primary text-decoration-underline m-0 p-0 ${ADD_FILE_TO_PREPRESS}" style="cursor: pointer;">Добавить+</p>
                            <input class="d-none ${ADD_FILE_TO_PREPRESS_INPUT}" type="file" id="" multiple>
                        </div>
                    </div>
                </div>
                <div class="m-0 p-0">
                    <textarea class="form-control ${SMART_FIELDS.COMMENT}" rows="1" placeholder="" data-field="${SMART_FIELDS.COMMENT}">${this.data[SMART_FIELDS.COMMENT] || ""}</textarea>
                </div>
            </div>
        `;
        
    }

    // вставка списка файлов с информацией
    renderFiles(classFileContainer, files) {
        let filesContainer = this.element.querySelector(`.${classFileContainer}`);
        filesContainer.innerHTML = this.getFilesHTML(files);
    }

    // получение HTML-кода списка файлов
    getFilesHTML(files) {
        let contentHTML = "";
        for (let i in files) {
            let fileData = files[i];
            contentHTML += this.getRowTableFileHTML(+i + 1, fileData.name, fileData.size, fileData.url);
        }
        return contentHTML;
    }

    // HTML код с информацией о файле
    getRowTableFileHTML(number, fileName, fileSize, fileLink) {
        let contentHTML = `
            <div class="m-0 p-0 file-row" style="">
                <div class="text-secondary m-0 p-0 product-number-file" style="">${number}</div>
                <div class="m-0 p-0 text-truncate" style=""><a href="${fileLink}" class="link-underline-primary " target="_blank">${fileName}</a></div>
                <div class="text-secondary m-0 p-0" style="">${fileSize}</div>
                <div class="m-0 p-0" style=""><button type="button" class="btn-close btn-sm m-0 p-0 product-list__remove-files" aria-label="Close"></button></div>
            </div>
        `;
        return contentHTML;
    }
    
    // возвращает HTML списка выбора (SELECT)
    getOptionsForSelectHTML(items, actualyId=0) {
        let contentHTML = '';
        for (let item of items) {
            if (item.ID == actualyId) {
                contentHTML += `<option value="${item.ID}" selected>${item.VALUE}</option>`;
            } else {
                contentHTML += `<option value="${item.ID}">${item.VALUE}</option>`;
            }
        }
        return contentHTML;
    }

    // возвращает HTML списка выбора (SELECT)
    getOptionsFromArrayForSelectHTML(items, actualyName="") {
        let contentHTML = '';
        for (let item of items) {
            if (item == actualyName) {
                contentHTML += `<option value="${item}" selected>${item}</option>`;
            } else {
                contentHTML += `<option value="${item}">${item}</option>`;
            }
        }
        return contentHTML;
    }

    // приведение размера к короткой записи с указанием единицы размера
    getFormatingFileSize(size) {
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
        console.log("response => ", response);
        this.data.id = response.item.id;
        this.smartProcessId = response.item.id;
        return response.item;
    }

    // возвращает список файлов в виде словаря преобразуя данные из сеонкатенированной строки
    getFilesDataFromStr(filesData) {
        let files = [];
        for (let i in filesData) {
            let fileData = filesData[i].split(";");
            files.push({
                "name": fileData[0],
                "size": fileData[1],
                "url": fileData[2],
            });
        }
        return files;
    }
    
    async addFile(files, dealId, fileName, fileData, fileSize) {
        let link = await this.yaDisk.uploadFile(dealId, fileName, fileData);
        files.push({
            "url": link,
            "name": fileName,
            "size": this.getFormatingFileSize(fileSize)
        });

        this.renderFiles(CONTAINER_CLIENT_FILES, this.clientFiles);    
        this.renderFiles(CONTAINER_PREPRESS_FILES, this.prepressFiles);

        BX24.fitWindow();
    }
}


export default class InterfaceBlockfour {
    constructor(container, bx24, yaDisk, dealId) {
        this.container = container;
        this.bx24 = bx24;
        this.yaDisk = yaDisk;
        this.dealId = dealId;
        this.smartNumber = SMART_PROCESS_NUMBER;

        this.productsObj = [];

    }

    init() {
        this.renderInit();
        this.containerProductList = this.container.querySelector("#productsListBody");
        this.elemAddProduct = this.container.querySelector("#createProduct");
        this.initHandler();
    }

    initHandler() {
        // Добавление нового продукта
        this.container.addEventListener("click", async (e) => {
            if (e.target == this.elemAddProduct) {
                let productObj = new ProductRow(this, this.containerProductList, this.bx24, this.yaDisk, this.dealId, this.productsObj.length + 1);
                productObj.addRow();
                this.productsObj.push(productObj);
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

    async render(fields, data) {
        this.productsObj = [];
        let productsList = await this.getProductsList(this.smartNumber, data.ID);
        for (let product of productsList) {
            let productObj = new ProductRow(this, this.containerProductList, this.bx24, this.yaDisk, this.dealId, this.productsObj.length + 1);
            productObj.addRow(product);
            this.productsObj.push(productObj);
        }
    }

    renderInit() {
        let contentHTML = `
            <div class="p-0 product-list__header">
                ${this.getHeaderHTML()}
            </div>
            <div class="p-0 products-list__body" id="productsListBody">
            </div>
            <div class="product-list__add">
                <div class="col-1 p-0 my-2">
                    <i class="bi bi-plus-circle-fill m-0 p-2 text-success" style="cursor: pointer; " id="createProduct"></i>
                </div>
            </div>
        `;
        this.container.innerHTML = contentHTML;
    }

    getHeaderHTML() {
        let contentHTML = `
            <div class="product-list__header-table">
                <div class="m-0 p-1 align-middle"></div>
                <div><label for="" class="form-label fw-medium">Название</label></div>
                <div><label for="" class="form-label fw-medium">Кол-во шт.</label></div>
                <div><label for="" class="form-label fw-medium">Технология изготовления</label></div>
                <div><label for="" class="form-label fw-medium">Пленка</label></div>
                <div><label for="" class="form-label fw-medium">Ламинация / номер цвета</label></div>
                <div><label for="" class="form-label fw-medium">Ширина пленки</label></div>
                <div class="product-list__cols-sizes">
                    <div class="product-list__cols-sizes-10"><label for="" class="form-label fw-medium">П.м. за шт.</label></div>
                    <div class="product-list__cols-sizes-11"><label for="" class="form-label fw-medium">Кв. м. за шт.</label></div>
                    <div class="product-list__cols-sizes-20"><label for="" class="form-label fw-medium">П.м. всего</label></div>
                    <div class="product-list__cols-sizes-21"><label for="" class="form-label fw-medium">Кв.м. всего</label></div>
                </div>
                <div><label for="" class="form-label fw-medium">Ссылка на исходники клиента</label></div>
                <div><label for="" class="form-label fw-medium">Файлы клиента</label></div>
                <div><label for="" class="form-label fw-medium">Черновой препресс</label></div>
                <div><label for="" class="form-label fw-medium">Комментарии</label></div>
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
                    SMART_FIELDS.TITLE,
                    SMART_FIELDS.COUNT_PIECES,
                    SMART_FIELDS.TECHNOLOGY,
                    SMART_FIELDS.FILM,
                    SMART_FIELDS.LAMINATION,
                    SMART_FIELDS.WIDTH_FILM,
                    SMART_FIELDS.LINEAR_METER_PIECES,
                    SMART_FIELDS.SQUARE_METER_PIECES,
                    SMART_FIELDS.LINEAR_METER_TOTAL,
                    SMART_FIELDS.SQUARE_METER_TOTAL,
                    SMART_FIELDS.LINK_SRC,
                    SMART_FIELDS.CLIENT_FILES,
                    SMART_FIELDS.PREPRESS,
                    SMART_FIELDS.COMMENT,
                ]
            }
        );
        return data.items;
    }
}



// addRow() {
//     this.element = document.createElement('div');
//     this.element.style.paddingBottom = "0px";
//     let contentHTML = `
//         <div class="product-list__product-row product-list__header-table">
//             <div class="m-0 p-1 align-middle">1</div>
//             <div class="m-0 p-0">
//                 <select class="form-select" aria-label=".form-select-lg example" data-list-field="">
//                     <option value="1">печать</option>
//                     <option value="2">плоттерная резка</option>
//                     <option value="3">печать+контурная резка</option>
//                 </select>
//             </div>
//             <div class="m-0 p-0">
//                 <select class="form-select" aria-label=".form-select-lg example" data-list-field="">
//                     <option value="1">ORAJET 3640</option>
//                     <option value="2">ORAJET 3551</option>
//                     <option value="3">Китай 010</option>
//                     <option value="4">ORACAL 641</option>
//                     <option value="5">ORACAL 551</option>
//                     <option value="6">Другое (указать в комментариях)</option>
//                 </select>
//             </div>
//             <div class="m-0 p-0">
//                 <select class="form-select" aria-label=".form-select-lg example" data-list-field="">
//                     <option value="1">ORAJET 3640 G</option>
//                     <option value="2">ORAJET 3640 M</option>
//                     <option value="3">ORAGARD 215 G</option>
//                     <option value="4">ORAGARD 215 M</option>
//                     <option value="5">Китай G</option>
//                     <option value="6">Китай M</option>
//                     <option value="7">нет</option>
//                 </select>
//             </div>

//             <div class="product-list__cols-sizes">
//                 <div class="product-list__cols-sizes-10">
//                     <select class="form-select" aria-label=".form-select-lg example" data-list-field="">
//                         <option value="1">1</option>
//                         <option value="2">1,05</option>
//                         <option value="3">1,26</option>
//                         <option value="4">1,37</option>
//                         <option value="5">1,52</option>
//                         <option value="6">1,6</option>
//                     </select>
//                 </div>
//                 <div class="product-list__cols-sizes-11">
//                     <div class="m-0 p-0">
//                         <input type="number" step="0.01" min="0" class="form-control" placeholder="" data-field="" value="">
//                     </div>
//                 </div>
//                 <div class="product-list__cols-sizes-20">
//                     <div class="m-0 p-0">
//                         <input type="number" step="0.01" min="0" class="form-control" placeholder="" data-field="" value="">
//                     </div>
//                 </div>
//                 <div class="product-list__cols-sizes-21">
//                     <div class="m-0 p-0">
//                         <input type="number" step="0.01" min="0" class="form-control" placeholder="" data-field="" value="">
//                     </div>
//                 </div>
//                 <div class="product-list__cols-sizes-30">
//                     <div class="m-0 p-0">
//                         <select class="form-select" aria-label=".form-select-lg example" data-list-field="">
//                             <option value="1">1</option>
//                             <option value="2">2</option>
//                         </select>
//                     </div>
//                 </div>
//                 <div class="product-list__cols-sizes-31">
//                     <div class="m-0 p-0">
//                         <input type="number" step="0.01" min="0" class="form-control" placeholder="" data-field="" value="">
//                     </div>
//                 </div>
//             </div>


//             <div class="m-0 p-0">
//                 <input type="number" step="0.01" min="0" class="form-control" placeholder="" data-field="" value="">
//             </div>
//             <div class="m-0 p-0">
//                 <input type="url" class="form-control" placeholder="" data-field="" value="">
//             </div>
//             <div class="m-0 p-0">
//                 <div class="m-0 p-0">
//                     <div class="product-list__row-files">
//                         <div class="m-0 p-0 file-row" style="">
//                             <div class="text-secondary m-0 p-0 product-number-file" style="">1</div>
//                             <div class="m-0 p-0 text-truncate" style=""><a href="google.com" class="link-underline-primary " target="_blank">google.com</a></div>
//                             <div class="text-secondary m-0 p-0" style="">1.2MB</div>
//                             <div class="m-0 p-0" style=""><button type="button" class="btn-close btn-sm m-0 p-0" aria-label="Close"></button></div>
//                         </div>
//                     </div>
//                 </div>
//                 <div class="row m-0 p-0">
//                     <div class="m-0 p-0"><span class="spinner-border spinner-border-sm d-none" role="status" aria-hidden="true"></span></div>
//                     <div class="m-0 p-0 px-4">
//                         <p class="text-primary text-decoration-underline m-0 p-0 ${ADD_FILE_TO_PRODUCT}" style="cursor: pointer;">Добавить+</p>
//                         <input class="d-none product-choose-file-input ${ADD_FILE_TO_PRODUCT_INPUT}" type="file" id="" multiple>
//                     </div>
//                 </div>
//             </div>
//             <div class="m-0 p-0">
//                 <textarea class="form-control" rows="1" placeholder="" data-field="">
                
//                 </textarea>
//             </div>
//         </div>
//     `;
//     return contentHTML;
//     // this.element.innerHTML = contentHTML;
// }

