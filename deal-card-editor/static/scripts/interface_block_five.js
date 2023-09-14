const SMART_PROCESS_NUMBER = 144;


const ADD_FILE_TO_PRODUCT = "product-choose-file-button";
const ADD_FILE_TO_PRODUCT_INPUT = "product-choose-file-input";

const SMART_FIELDS = {
    TECHNOLOGY:    "ufCrm21_1694680011",  // Технология изготовления
    FILM:          "ufCrm21_1694679978",  // Пленка
    LAMINATION:    "ufCrm21_1694680039",  // Ламинация
    WIDTH_FILM:    "ufCrm21_1694680085",  // Ширина пленки
    LINEAR_METER:  "ufCrm21_1694680054",  // П.м.
    LENGTH_AREA:   "ufCrm21_1694680115",  // Длина, м
    HEIGHT_AREA:   "ufCrm21_1694680100",  // Высота, м
    COUNT_SIDE:    "ufCrm21_1694680138",  // Кол-во бортов
    COUNT_CARS:    "ufCrm21_1694680127",  // Кол-во авто
    SQUARE_METERS: "ufCrm21_1694680155",  // Кв.м. монтажа
    LINK_SRC:      "ufCrm21_1694680292",  // Ссылка на исходники клиента
    COMMENT:       "ufCrm21_1694680324",  // Комментарии
    CLIENT_FILES:  "ufCrm21_1694680404"   // Файлы клиента
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

        this.checkFileUploadCompletion = true;

        // HTML-элемент строки продукта 
        this.element = null;
        // идентификатор элемента смартпроцесса
        this.smartProcessId = null;
        // данные хранящмеся в смарт-процессе
        this.data = {};
        // список файлов прикрепленных к продукту
        this.files = [];

        // файлы которые нужно удалить по нажатию кнопки
        this.removingFiles = [];

    }

    initHandler() {
        // Событие изменения типа пленки
        this.element.addEventListener("change", async (e) => {
            if (e.target.classList.contains(SMART_FIELDS.FILM)) {
                let selectContainer = this.container.querySelector(`.${SMART_FIELDS.WIDTH_FILM}`);
                selectContainer.innerHTML = this.getOptionsForSelectHTML(LIST_WIDTH_FILMS[e.target.value], 0);
            }
        })
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
                elemSpinner.classList.remove("d-none");
                for (let file of e.target.files) {
                    await this.addFile(this.dealId, file.name, file, file.size);
                }
                elemSpinner.classList.add("d-none");
                this.checkFileUploadCompletion = true;
            }
        });
        // Событие удаления файла
        this.element.addEventListener("click", async (e) => {
            if (e.target.classList.contains("product-list__remove-files")) {
                this.checkFileUploadCompletion = false;
                let rowFile = e.target.closest(".file-row");
                let containerFiles = rowFile.parentNode;
                const childIndex = Array.prototype.indexOf.call(containerFiles.children, rowFile);
                
                let fileData = this.files[childIndex] || {};
                this.removingFiles.push(fileData);

                this.files.splice(childIndex, 1);
                this.renderFilesHTML();
                BX24.fitWindow();
                this.checkFileUploadCompletion = true;
            }
        })
        // Событие изменения поля "м2"
        this.element.addEventListener("change", async (e) => {
            if (e.target.classList.contains(SMART_FIELDS.LENGTH_AREA)) {
                this.updateSquareMeters();
            } else if (e.target.classList.contains(SMART_FIELDS.HEIGHT_AREA)) {
                this.updateSquareMeters();
            } else if (e.target.classList.contains(SMART_FIELDS.COUNT_SIDE)) {
                this.updateSquareMeters();
            } else if (e.target.classList.contains(SMART_FIELDS.COUNT_CARS)) {
                this.updateSquareMeters();
            }
        })
        // Событие изменения значений полей 
        this.element.addEventListener("change", async (e) => {
            if (e.target.hasAttribute('data-field')) {
                this.updateDate();
            }
        })
        // Событие изменения поля "м2"
        this.element.addEventListener("input", async (e) => {
            if (e.target.classList.contains(SMART_FIELDS.COMMENT)) {
                e.target.style.height = 'auto';
                e.target.style.height = (e.target.scrollHeight) + 'px';
                BX24.fitWindow();
            }
        })
        // Событие изменения поля "м2"
        this.element.addEventListener("focus", async (e) => {
            if (e.target.classList.contains(SMART_FIELDS.COMMENT)) {
                BX24.fitWindow();
            }
        })
        this.element.addEventListener("blur", async (e) => {
            if (e.target.classList.contains(SMART_FIELDS.COMMENT)) {
                BX24.fitWindow();
            }
        })
        this.element.addEventListener("keyup", async (e) => {
            if (e.target.classList.contains(SMART_FIELDS.COMMENT)) {
                BX24.fitWindow();
            }
        })
        this.element.addEventListener("contextmenu", async (e) => {
            if (e.target.classList.contains(SMART_FIELDS.COMMENT)) {
                BX24.fitWindow();
            }
        })
    }

    getData() {
        let data = this.data;
        data[SMART_FIELDS.CLIENT_FILES] = [];
        for (let file of this.files) {
            data[SMART_FIELDS.CLIENT_FILES].push(`${file.name};${file.size};${file.url}`);
        }
        return data;
    }

    updateSquareMeters() {
        let lengthFloat = parseFloat(this.element.querySelector(`.${SMART_FIELDS.LENGTH_AREA}`).value.replace(",", "."));
        let heightFloat = parseFloat(this.element.querySelector(`.${SMART_FIELDS.HEIGHT_AREA}`).value.replace(",", "."));
        let countSideFloat = parseFloat(this.element.querySelector(`.${SMART_FIELDS.COUNT_SIDE}`).value.replace(",", ".")) + 1;
        let counCarsFloat = parseFloat(this.element.querySelector(`.${SMART_FIELDS.COUNT_CARS}`).value.replace(",", "."));
        this.element.querySelector(`.${SMART_FIELDS.SQUARE_METERS}`).value = this.roundToTwoDecimals(lengthFloat * heightFloat * countSideFloat * counCarsFloat);
    }

    async addRow(data={}) {
        console.log("smart data[SMART_FIELDS.CLIENT_FILES] = ", data[SMART_FIELDS.CLIENT_FILES]);
        this.files = this.getFilesHTML(data[SMART_FIELDS.CLIENT_FILES] || "");
        this.element = document.createElement('div');
        this.element.style.paddingBottom = "0px";
        this.data = data;
        this.smartProcessId = data.id;
        this.element.innerHTML = this.getRowHTML();
        this.container.append(this.element);
        this.renderFilesHTML();
        this.initHandler();
        BX24.fitWindow();
        if (!this.smartProcessId) {
            this.updateDate();
            await this.addSmartProcessToBx24();
        }
        // BX24.fitWindow();
    }

    updateDate() {
        let elements = this.element.querySelectorAll("[data-field]");
        for (let elem of elements) {
            this.data[elem.dataset.field] = elem.value;
        }
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
                        ${this.getOptionsForSelectHTML(LIST_LAMINATIONS, this.data[SMART_FIELDS.LAMINATION] || 0)}
                    </select>
                </div>

                <div class="product-list__cols-sizes">
                    <div class="product-list__cols-sizes-10">
                        <select class="form-select ${SMART_FIELDS.WIDTH_FILM}" aria-label=".form-select-lg example" data-field="${SMART_FIELDS.WIDTH_FILM}">
                            ${this.getOptionsForSelectHTML(LIST_WIDTH_FILMS[this.data[SMART_FIELDS.FILM] || 0], this.data[SMART_FIELDS.WIDTH_FILM] || 0)}
                        </select>
                    </div>
                    <div class="product-list__cols-sizes-11">
                        <div class="m-0 p-0">
                            <input type="number" step="0.01" min="0" class="form-control ${SMART_FIELDS.LINEAR_METER}" placeholder="" data-field="${SMART_FIELDS.LINEAR_METER}" value="${this.data[SMART_FIELDS.LINEAR_METER] || 0}">
                        </div>
                    </div>
                    <div class="product-list__cols-sizes-20">
                        <div class="m-0 p-0">
                            <input type="number" step="0.01" min="0" class="form-control ${SMART_FIELDS.LENGTH_AREA}" placeholder="" data-field="${SMART_FIELDS.LENGTH_AREA}" value="${this.data[SMART_FIELDS.LENGTH_AREA] || 0}">
                        </div>
                    </div>
                    <div class="product-list__cols-sizes-21">
                        <div class="m-0 p-0">
                            <input type="number" step="0.01" min="0" class="form-control ${SMART_FIELDS.HEIGHT_AREA}" placeholder="" data-field="${SMART_FIELDS.HEIGHT_AREA}" value="${this.data[SMART_FIELDS.HEIGHT_AREA] || 0}">
                        </div>
                    </div>
                    <div class="product-list__cols-sizes-30">
                        <div class="m-0 p-0">
                            <select class="form-select ${SMART_FIELDS.COUNT_SIDE}" aria-label=".form-select-lg example" data-field="${SMART_FIELDS.COUNT_SIDE}">
                                ${this.getOptionsForSelectHTML(LIST_COUNT_SIDES, this.data[SMART_FIELDS.COUNT_SIDE] || 0)}
                            </select>
                        </div>
                    </div>
                    <div class="product-list__cols-sizes-31">
                        <div class="m-0 p-0">
                            <input type="number" step="0.01" min="0" class="form-control ${SMART_FIELDS.COUNT_CARS}" placeholder="" data-field="${SMART_FIELDS.COUNT_CARS}" value="${this.data[SMART_FIELDS.COUNT_CARS] || 0}">
                        </div>
                    </div>
                </div>

                <div class="m-0 p-0">
                    <input type="number" step="0.01" min="0" class="form-control ${SMART_FIELDS.SQUARE_METERS}" placeholder="" data-field="${SMART_FIELDS.SQUARE_METERS}" value="${this.data[SMART_FIELDS.SQUARE_METERS] || 0}">
                </div>
                <div class="m-0 p-0">
                    <input type="url" class="form-control ${SMART_FIELDS.LINK_SRC}" placeholder="" data-field="${SMART_FIELDS.LINK_SRC}" value="${this.data[SMART_FIELDS.LINK_SRC] || "-"}">
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
                    <textarea class="form-control ${SMART_FIELDS.COMMENT}" rows="1" placeholder="" data-field="${SMART_FIELDS.COMMENT}">${this.data[SMART_FIELDS.COMMENT] || ""}</textarea>
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
                contentHTML += `<option value="${item.ID}">${item.VALUE}</option>`;
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

    async addFile(dealId, fileName, fileData, fileSize) {
        let link = await this.yaDisk.uploadFile(dealId, fileName, fileData);
        this.files.push({
            "url": link,
            "name": fileName,
            "size": this.getFormatingFileSize(fileSize)
        });
        this.renderFilesHTML();
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

    async getProductsList(smartNumber, dealId) {
        let data = await this.bx24.callMethod(
            "crm.item.list",
            {
                "entityTypeId": smartNumber,
                "filter": { "parentId2": dealId },
                "select": [
                    "id",
                    SMART_FIELDS.TECHNOLOGY,
                    SMART_FIELDS.FILM,
                    SMART_FIELDS.LAMINATION,
                    SMART_FIELDS.WIDTH_FILM,
                    SMART_FIELDS.LINEAR_METER,
                    SMART_FIELDS.LENGTH_AREA,
                    SMART_FIELDS.HEIGHT_AREA,
                    SMART_FIELDS.COUNT_SIDE,
                    SMART_FIELDS.COUNT_CARS,
                    SMART_FIELDS.SQUARE_METERS,
                    SMART_FIELDS.LINK_SRC,
                    SMART_FIELDS.COMMENT,
                    SMART_FIELDS.CLIENT_FILES,
                ]
            }
        );
        // return data.result.items;
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

