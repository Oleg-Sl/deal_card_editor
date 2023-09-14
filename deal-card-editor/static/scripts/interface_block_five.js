const SMART_PROCESS_NUMBER = 184;


const ADD_FILE_TO_PRODUCT = "product-choose-file-button";
const ADD_FILE_TO_PRODUCT_INPUT = "product-choose-file-input";

const SMART_FIELDS = {
    TECHNOLOGY:    UF_CRM_21_1694680011,  // Технология изготовления
    FILM:          UF_CRM_21_1694679978,  // Пленка
    LAMINATION:    UF_CRM_21_1694680039,  // Ламинация
    WIDTH_FILM:    UF_CRM_21_1694680085,  // Ширина пленки
    LINEAR_METER:  UF_CRM_21_1694680054,  // П.м.
    LENGTH_AREA:   UF_CRM_21_1694680115,  // Длина, м
    HEIGHT_AREA:   UF_CRM_21_1694680100,  // Высота, м
    COUNT_SIDE:    UF_CRM_21_1694680138,  // Кол-во бортов
    COUNT_CARS:    UF_CRM_21_1694680127,  // Кол-во авто
    SQUARE_METERS: UF_CRM_21_1694680155,  // Кв.м. монтажа
    LINK_SRC:      UF_CRM_21_1694680292,  // Ссылка на исходники клиента
    COMMENT:       UF_CRM_21_1694680324,  // Комментарии
    CLIENT_FILES:  UF_CRM_21_1694680404   // Файлы клиента
};

const LIST_TECHNOLOGY = [
    {ID: 0, VALUE: "печать"},
    {ID: 1, VALUE: "плоттерная резка"},
    {ID: 2, VALUE: "печать+контурная резка"},
];
const LIST_FILMS = [
    {ID: 0, VALUE: "ORAJET 3640"},
    {ID: 1, VALUE: "ORAJET 3551"},
    {ID: 2, VALUE: "Китай 010"},
    {ID: 3, VALUE: "ORACAL 641"},
    {ID: 4, VALUE: "ORACAL 551"},
    {ID: 5, VALUE: "Другое (указать в комментариях)"},
];
const LIST_LAMINATIONS = [
    {ID: 0, VALUE: "ORAJET 3640 G"},
    {ID: 1, VALUE: "ORAJET 3640 M"},
    {ID: 2, VALUE: "ORAGARD 215 G"},
    {ID: 3, VALUE: "ORAGARD 215 M"},
    {ID: 4, VALUE: "Китай G"},
    {ID: 5, VALUE: "Китай M"},
    {ID: 6, VALUE: "нет"},
];
const LIST_WIDTH_FILMS = {
    "0": [
        {ID: 0, VALUE: "1"},
        {ID: 1, VALUE: "1,05"},
        {ID: 2, VALUE: "1,26"},
        {ID: 3, VALUE: "1,37"},
        {ID: 4, VALUE: "1,52"},
        {ID: 5, VALUE: "1,6"},
    ],
    "1": [
        {ID: 0, VALUE: "1,26"},
        {ID: 1, VALUE: "1,37"},
    ],
    "2": [
        {ID: 0, VALUE: "1,07"},
        {ID: 1, VALUE: "1,27"},
        {ID: 2, VALUE: "1,37"},
        {ID: 3, VALUE: "1,52"},
    ],
    "3": [
        {ID: 0, VALUE: "1"},
        {ID: 1, VALUE: "1,26"},
    ],
    "4": [
        {ID: 0, VALUE: "1,26"},
    ],
    "5": []
};
const LIST_COUNT_SIDES = [
    {ID: 0, VALUE: 1},
    {ID: 1, VALUE: 2},
];


class ProductRow {
    constructor(parentClass, container, bx24, yaDisk, dealId, currentNumb) {
        this.parentClass = parentClass;
        this.container = container;
        this.bx24 = bx24;
        this.yaDisk = yaDisk;
        this.dealId = dealId;
        this.currentNumb = currentNumb;

        // this.checkFileUploadCompletion = true;

        // const newLocal = this;

        // HTML-элемент строки продукта 
        this.element = null;
        // идентификатор элемента смартпроцесса
        newLocal.smartProcessId = null;
        // данные хранящмеся в смарт-процессе
        this.data = {};
        // список файлов прикрепленных к продукту
        this.files = [];

        // this.removingFiles = [];

    }

    init() {

    }

    initHandler() {
        // // Событие нажатия кнопки дообавления нового файла к продукту -> вызов события добавления файла 
        // this.element.addEventListener("click", async (e) => {
        //     if (e.target.classList.contains(ADD_FILE_TO_PRODUCT)) {
        //         let elemInput = e.target.parentNode.querySelector("input");
        //         elemInput.click();
        //     }
        // })
        // // Событие добавления файла
        // this.element.addEventListener('change', async (e) => {
        //     if (e.target.classList.contains(ADD_FILE_TO_PRODUCT_INPUT)) {
        //         this.checkFileUploadCompletion = false;
        //         let elemSpinner = e.target.parentNode.parentNode.querySelector("span");
        //         // const file = e.target.files[0];
        //         elemSpinner.classList.remove("d-none");
        //         for (let file of e.target.files) {
        //             await this.addFile(this.dealId, file.name, file, file.size);
        //         }
        //         // let link = await this.yaDisk.uploadFile(this.dealId, file.name, file);
        //         // elemSpinner.classList.add("d-none");
        //         // this.files.push({
        //         //     "url": link,
        //         //     "name": file.name,
        //         //     "size": this.formatFileSize(file.size)
        //         // });
        //         // this.renderTableFilesHTML();
        //         // BX24.fitWindow();
        //         elemSpinner.classList.add("d-none");
        //         this.checkFileUploadCompletion = true;
        //     }
        // });
        // // Событие удаления файла
        // this.element.addEventListener("click", async (e) => {
        //     if (e.target.classList.contains(REMOOVE_FILE_FROM_PRODUCT)) {
        //         this.checkFileUploadCompletion = false;
        //         let rowFile = e.target.closest(".file-row");
        //         let containerFiles = rowFile.parentNode;
        //         const childIndex = Array.prototype.indexOf.call(containerFiles.children, rowFile);
                
        //         let fileData = this.files[childIndex] || {};
        //         this.removingFiles.push(fileData);
        //         // let response = await this.yaDisk.removeFile(this.dealId, fileData.name);
        //         // console.log("removeFile response = ", response);

        //         this.files.splice(childIndex, 1);
        //         this.renderTableFilesHTML();
        //         BX24.fitWindow();
        //         this.checkFileUploadCompletion = true;
        //     }
        // })
        // // Событие изменения поля "м. пог"
        // this.element.addEventListener("change", async (e) => {
        //     if (e.target.classList.contains(PRODUCTS_AREA_RUNNING_METERS)) {
        //         let containerTechonlogyItem = e.target.closest(".manufact-technology-item");
        //         let idWidth = containerTechonlogyItem.querySelector(`.${PRODUCTS_FILM_WIDTH}`).value;
        //         const found = this.itemsFilmWidth.find(item => item.ID == idWidth);
        //         if (found) {
        //             let area = parseFloat(e.target.value.replace(",", ".")) * parseFloat(found.VALUE.replace(",", "."));
        //             containerTechonlogyItem.querySelector(`.${PRODUCTS_AREA_SQUARE_METERS}`).value = this.roundToTwoDecimals(area);
        //         }
        //     }
        // })
        // // Событие изменения поля "м2"
        // this.element.addEventListener("change", async (e) => {
        //     if (e.target.classList.contains(PRODUCTS_AREA_SQUARE_METERS)) {
        //         let containerTechonlogyItem = e.target.closest(".manufact-technology-item");
        //         let idWidth = containerTechonlogyItem.querySelector(`.${PRODUCTS_FILM_WIDTH}`).value;
        //         const found = this.itemsFilmWidth.find(item => item.ID == idWidth);
        //         if (found) {
        //             let area = parseFloat(e.target.value.replace(",", ".")) / parseFloat(found.VALUE.replace(",", "."));
        //             containerTechonlogyItem.querySelector(`.${PRODUCTS_AREA_RUNNING_METERS}`).value = this.roundToTwoDecimals(area);
        //         }
        //     }
        // })
        // // Событие изменения поля "Ширина пленки"
        // this.element.addEventListener("change", async (e) => {
        //     if (e.target.classList.contains(PRODUCTS_FILM_WIDTH)) {
        //         let containerTechonlogyItem = e.target.closest(".manufact-technology-item");
        //         let idWidth = containerTechonlogyItem.querySelector(`.${PRODUCTS_FILM_WIDTH}`).value;
        //         let runningMeters = containerTechonlogyItem.querySelector(`.${PRODUCTS_AREA_RUNNING_METERS}`).value
        //         const found = this.itemsFilmWidth.find(item => item.ID == idWidth);
        //         if (found) {
        //             let area = parseFloat(runningMeters) * parseFloat(found.VALUE.replace(",", "."));
        //             containerTechonlogyItem.querySelector(`.${PRODUCTS_AREA_SQUARE_METERS}`).value = this.roundToTwoDecimals(area);
        //         }
        //     }
        // })

        // this.element.addEventListener("input", async (e) => {
        //     if (e.target.classList.contains(PRODUCTS_DESC)) {
        //         this.setHeightBlockProductDesc(e.target);
        //         // e.target.style.height = 'auto'; // Сбросить высоту до автоматического размера
        //         // e.target.style.height = String(parseInt(e.target.scrollHeight) + 5) + 'px'; // Установить высоту на основе прокрутки содержимого
        //     }
        // })
    }

    async addRow(data={}) {
        this.files = this.getFilesHTML(data.CLIENT_FILES || "");
        this.element = document.createElement('div');
        this.element.style.paddingBottom = "0px";
        this.data = data;
        this.smartProcessId = data.id;
        this.element.innerHTML = this.getRowHTML();
        this.container.append(this.element);
        this.init();
        this.renderFilesHTML();
        BX24.fitWindow();
        // if (!this.smartProcessId) {
        //     this.updateDate();
        //     await this.addSmartProcessToBx24();
        // }
        // BX24.fitWindow();
    }

    // возвращает список файлов в виде словаря преобразуя данные из сеонкатенированной строки
    getFilesHTML(filesData) {
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

    getRowHTML() {
        let contentHTML = `
            <div class="product-list__product-row product-list__header-table">
                <div class="m-0 p-1 align-middle">${this.currentNumb}</div>
                <div class="m-0 p-0">
                    <select class="form-select" aria-label=".form-select-lg example" data-list-field="">
                        ${this.getOptionsForSelectHTML(LIST_TECHNOLOGY, this.data[SMART_FIELDS.TECHNOLOGY] || 0)}
                    </select>
                </div>
                <div class="m-0 p-0">
                    <select class="form-select" aria-label=".form-select-lg example" data-list-field="">
                        ${this.getOptionsForSelectHTML(LIST_FILMS, this.data[SMART_FIELDS.FILM] || 0)}
                    </select>
                </div>
                <div class="m-0 p-0">
                    <select class="form-select" aria-label=".form-select-lg example" data-list-field="">
                        ${this.getOptionsForSelectHTML(LIST_LAMINATIONS, this.data[SMART_FIELDS.LAMINATION] || 0)}
                    </select>
                </div>

                <div class="product-list__cols-sizes">
                    <div class="product-list__cols-sizes-10">
                        <select class="form-select" aria-label=".form-select-lg example" data-list-field="">
                            ${this.getOptionsForSelectHTML(LIST_WIDTH_FILMS[this.data[SMART_FIELDS.FILM] || 0], this.data[SMART_FIELDS.WIDTH_FILM] || 0)}
                        </select>
                    </div>
                    <div class="product-list__cols-sizes-11">
                        <div class="m-0 p-0">
                            <input type="number" step="0.01" min="0" class="form-control" placeholder="" data-field="" value="${this.data[SMART_FIELDS.LINEAR_METER] || 0}">
                        </div>
                    </div>
                    <div class="product-list__cols-sizes-20">
                        <div class="m-0 p-0">
                            <input type="number" step="0.01" min="0" class="form-control" placeholder="" data-field="" value="${this.data[SMART_FIELDS.LENGTH_AREA] || 0}">
                        </div>
                    </div>
                    <div class="product-list__cols-sizes-21">
                        <div class="m-0 p-0">
                            <input type="number" step="0.01" min="0" class="form-control" placeholder="" data-field="" value="${this.data[SMART_FIELDS.HEIGHT_AREA] || 0}">
                        </div>
                    </div>
                    <div class="product-list__cols-sizes-30">
                        <div class="m-0 p-0">
                            <select class="form-select" aria-label=".form-select-lg example" data-list-field="">
                                ${this.getOptionsForSelectHTML(LIST_COUNT_SIDES, this.data[SMART_FIELDS.COUNT_SIDE] || 0)}
                            </select>
                        </div>
                    </div>
                    <div class="product-list__cols-sizes-31">
                        <div class="m-0 p-0">
                            <input type="number" step="0.01" min="0" class="form-control" placeholder="" data-field="" value="${this.data[SMART_FIELDS.COUNT_CARS] || 0}">
                        </div>
                    </div>
                </div>

                <div class="m-0 p-0">
                    <input type="number" step="0.01" min="0" class="form-control" placeholder="" data-field="" value="${this.data[SMART_FIELDS.SQUARE_METERS] || 0}">
                </div>
                <div class="m-0 p-0">
                    <input type="url" class="form-control" placeholder="" data-field="" value="${this.data[SMART_FIELDS.LINK_SRC] || "-"}">
                </div>
                <div class="m-0 p-0">
                    <div class="m-0 p-0">
                        <div class="product-list__row-files">
                        </div>
                    </div>
                    <div class="row m-0 p-0">
                        <div class="m-0 p-0"><span class="spinner-border spinner-border-sm d-none" role="status" aria-hidden="true"></span></div>
                        <div class="m-0 p-0 px-4">
                            <p class="text-primary text-decoration-underline m-0 p-0 ${ADD_FILE_TO_PRODUCT}" style="cursor: pointer;">Добавить+</p>
                            <input class="d-none product-choose-file-input ${ADD_FILE_TO_PRODUCT_INPUT}" type="file" id="" multiple>
                        </div>
                    </div>
                </div>
                <div class="m-0 p-0">
                    <textarea class="form-control" rows="1" placeholder="" data-field="">
                        ${this.data[SMART_FIELDS.COMMENT] || ""}
                    </textarea>
                </div>
            </div>
        `;
        return contentHTML;
    }

    getOptionsForSelectHTML(items, actualyId=0) {
        let contentHTML = '';
        for (let item of items) {
            if (item.ID == actualyId) {
                contentHTML += `<option value="${item.ID}" selected>${item.VALUE}</option>`;
            } else {
                contentHTML += `<option value="${item.ID}" selected>${item.VALUE}</option>`;
            }
        }
        return contentHTML;
    }

    // вставка списка файлов с информацией
    renderFilesHTML() {
        let contentHTML = "";
        for (let i in this.files) {
            let fileData = this.files[i];
            contentHTML += this.getRowTableFileHTML(+i + 1, fileData.name, fileData.size, fileData.url);
        }
        let filesContainer = this.element.querySelector(`.product-list__row-files`);
        filesContainer.innerHTML = contentHTML;
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
                let productObj = new ProductRow(this, this.containerProductList, this.bx24, this.yaDisk, this.itemsdManufactTechn, this.itemsFilmWidth, this.dealId, this.productsObj.length + 1);
                productObj.addRow();
                this.productsObj.push(productObj);
            }
        })
    }

    async render(fields, data) {
        // this.productsObj = [];
        // this.itemsdManufactTechn = fields[MANUFACTURING_TECHNOLOGY].items;
        // this.itemsFilmWidth = fields[FILM_WIDTH].items;
        // this.dealId = data.ID;
        // let productsList = await this.getProductsList(this.smartNumber, data.ID);
        // for (let product of productsList) {
        //     let productObj = new ProductRow(this, this.containerProductList, this.bx24, this.yaDisk, this.itemsdManufactTechn, this.itemsFilmWidth, this.dealId, this.productsObj.length + 1);
        //     productObj.addRow(product);
        //     this.productsObj.push(productObj);
        // }
        // this.setSummaryData();
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
                <div><label for="" class="form-label fw-medium">Технология изготовления</label></div>
                <div><label for="" class="form-label fw-medium">Пленка</label></div>
                <div><label for="" class="form-label fw-medium">Ламинация</label></div>
                <div class="product-list__cols-sizes">
                    <div class="product-list__cols-sizes-10"><label for="" class="form-label fw-medium">Ширина пленки</label></div>
                    <div class="product-list__cols-sizes-11"><label for="" class="form-label fw-medium">П.м.</label></div>
                    <div class="product-list__cols-sizes-20"><label for="" class="form-label fw-medium">Длина, м</label></div>
                    <div class="product-list__cols-sizes-21"><label for="" class="form-label fw-medium">Высота, м</label></div>
                    <div class="product-list__cols-sizes-30"><label for="" class="form-label fw-medium">Кол-во бортов</label></div>
                    <div class="product-list__cols-sizes-31"><label for="" class="form-label fw-medium">Кол-во авто</label></div>
                </div>
                <div><label for="" class="form-label fw-medium">Кв.м. монтажа</label></div>
                <div><label for="" class="form-label fw-medium">Ссылка на исходники клиента</label></div>
                <div><label for="" class="form-label fw-medium">Файлы клиента</label></div>
                <div><label for="" class="form-label fw-medium">Комментарии</label></div>
            </div>
        `;
        return contentHTML;
    }

    addRow() {
        this.element = document.createElement('div');
        this.element.style.paddingBottom = "0px";
        let contentHTML = `
            <div class="product-list__product-row product-list__header-table">
                <div class="m-0 p-1 align-middle">1</div>
                <div class="m-0 p-0">
                    <select class="form-select" aria-label=".form-select-lg example" data-list-field="">
                        <option value="1">печать</option>
                        <option value="2">плоттерная резка</option>
                        <option value="3">печать+контурная резка</option>
                    </select>
                </div>
                <div class="m-0 p-0">
                    <select class="form-select" aria-label=".form-select-lg example" data-list-field="">
                        <option value="1">ORAJET 3640</option>
                        <option value="2">ORAJET 3551</option>
                        <option value="3">Китай 010</option>
                        <option value="4">ORACAL 641</option>
                        <option value="5">ORACAL 551</option>
                        <option value="6">Другое (указать в комментариях)</option>
                    </select>
                </div>
                <div class="m-0 p-0">
                    <select class="form-select" aria-label=".form-select-lg example" data-list-field="">
                        <option value="1">ORAJET 3640 G</option>
                        <option value="2">ORAJET 3640 M</option>
                        <option value="3">ORAGARD 215 G</option>
                        <option value="4">ORAGARD 215 M</option>
                        <option value="5">Китай G</option>
                        <option value="6">Китай M</option>
                        <option value="7">нет</option>
                    </select>
                </div>

                <div class="product-list__cols-sizes">
                    <div class="product-list__cols-sizes-10">
                        <select class="form-select" aria-label=".form-select-lg example" data-list-field="">
                            <option value="1">1</option>
                            <option value="2">1,05</option>
                            <option value="3">1,26</option>
                            <option value="4">1,37</option>
                            <option value="5">1,52</option>
                            <option value="6">1,6</option>
                        </select>
                    </div>
                    <div class="product-list__cols-sizes-11">
                        <div class="m-0 p-0">
                            <input type="number" step="0.01" min="0" class="form-control" placeholder="" data-field="" value="">
                        </div>
                    </div>
                    <div class="product-list__cols-sizes-20">
                        <div class="m-0 p-0">
                            <input type="number" step="0.01" min="0" class="form-control" placeholder="" data-field="" value="">
                        </div>
                    </div>
                    <div class="product-list__cols-sizes-21">
                        <div class="m-0 p-0">
                            <input type="number" step="0.01" min="0" class="form-control" placeholder="" data-field="" value="">
                        </div>
                    </div>
                    <div class="product-list__cols-sizes-30">
                        <div class="m-0 p-0">
                            <select class="form-select" aria-label=".form-select-lg example" data-list-field="">
                                <option value="1">1</option>
                                <option value="2">2</option>
                            </select>
                        </div>
                    </div>
                    <div class="product-list__cols-sizes-31">
                        <div class="m-0 p-0">
                            <input type="number" step="0.01" min="0" class="form-control" placeholder="" data-field="" value="">
                        </div>
                    </div>
                </div>


                <div class="m-0 p-0">
                    <input type="number" step="0.01" min="0" class="form-control" placeholder="" data-field="" value="">
                </div>
                <div class="m-0 p-0">
                    <input type="url" class="form-control" placeholder="" data-field="" value="">
                </div>
                <div class="m-0 p-0">
                    <div class="m-0 p-0">
                        <div class="product-list__row-files">
                            <div class="m-0 p-0 file-row" style="">
                                <div class="text-secondary m-0 p-0 product-number-file" style="">1</div>
                                <div class="m-0 p-0 text-truncate" style=""><a href="google.com" class="link-underline-primary " target="_blank">google.com</a></div>
                                <div class="text-secondary m-0 p-0" style="">1.2MB</div>
                                <div class="m-0 p-0" style=""><button type="button" class="btn-close btn-sm m-0 p-0" aria-label="Close"></button></div>
                            </div>
                        </div>
                    </div>
                    <div class="row m-0 p-0">
                        <div class="m-0 p-0"><span class="spinner-border spinner-border-sm d-none" role="status" aria-hidden="true"></span></div>
                        <div class="m-0 p-0 px-4">
                            <p class="text-primary text-decoration-underline m-0 p-0 ${ADD_FILE_TO_PRODUCT}" style="cursor: pointer;">Добавить+</p>
                            <input class="d-none product-choose-file-input ${ADD_FILE_TO_PRODUCT_INPUT}" type="file" id="" multiple>
                        </div>
                    </div>
                </div>
                <div class="m-0 p-0">
                    <textarea class="form-control" rows="1" placeholder="" data-field="">
                    
                    </textarea>
                </div>
            </div>
        `;
        return contentHTML;
        // this.element.innerHTML = contentHTML;
    }


}


