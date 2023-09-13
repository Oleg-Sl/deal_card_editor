const SMART_PROCESS_NUMBER = 184;

const ID__ADD_PRODUCT = "CreateProduct";


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
        `;
        this.container.innerHTML = contentHTML;
    }

    getHeaderHTML() {
        let contentHTML = `
            <div class="product-header-table"">
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

}


