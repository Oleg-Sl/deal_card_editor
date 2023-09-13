const SMART_PROCESS_NUMBER = 184;

const ID__ADD_PRODUCT = "CreateProduct";

const ADD_FILE_TO_PRODUCT = "product-choose-file-button";
const ADD_FILE_TO_PRODUCT_INPUT = "product-choose-file-input";


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
        
    }

    renderInit() {
        let contentHTML = `
            <div class="p-0 product-list__header">
                ${this.getHeaderHTML()}
            </div>
            <div class="p-0 products-list__body" id="productsListBody">
                ${this.addRow()}
            </div>
            <div class="product-list__add">
                <div class="col-1 p-0 my-2">
                    <i class="bi bi-plus-circle-fill m-0 p-2 text-success" style="cursor: pointer; " id="${ID__ADD_PRODUCT}"></i>
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
                <div><label for="" class="form-label fw-medium">Ширина пленки</label></div>
                <div><label for="" class="form-label fw-medium">П.м.</label></div>
                <div><label for="" class="form-label fw-medium">Длина, м</label></div>
                <div><label for="" class="form-label fw-medium">Высота, м</label></div>
                <div><label for="" class="form-label fw-medium">Кол-во бортов</label></div>
                <div><label for="" class="form-label fw-medium">Кол-во авто</label></div>
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
                <div class="m-0 p-0">
                    <select class="form-select" aria-label=".form-select-lg example" data-list-field="">
                        <option value="1">1</option>
                        <option value="2">1,05</option>
                        <option value="3">1,26</option>
                        <option value="4">1,37</option>
                        <option value="5">1,52</option>
                        <option value="6">1,6</option>
                    </select>
                </div>
                <div class="m-0 p-0">
                    <input type="number" step="0.01" min="0" class="form-control" placeholder="" data-field="" value="">
                </div>
                <div class="m-0 p-0">
                    <input type="number" step="0.01" min="0" class="form-control" placeholder="" data-field="" value="">
                </div>
                <div class="m-0 p-0">
                    <input type="number" step="0.01" min="0" class="form-control" placeholder="" data-field="" value="">
                </div>
                <div class="m-0 p-0">
                    <select class="form-select" aria-label=".form-select-lg example" data-list-field="">
                        <option value="1">1</option>
                        <option value="2">2</option>
                    </select>
                </div>
                <div class="m-0 p-0">
                    <input type="number" step="0.01" min="0" class="form-control" placeholder="" data-field="" value="">
                </div>
                <div class="m-0 p-0">
                    <input type="number" step="0.01" min="0" class="form-control" placeholder="" data-field="" value="">
                </div>
                <div class="m-0 p-0">
                    <input type="url" class="form-control" placeholder="" data-field="" value="">
                </div>
                <div class="m-0 p-0">
                    <div class="m-0 p-0">
                        <div class=""></div>
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


