
export default class InterfaceBlockOne {
    constructor(container, bx24) {
        this.container = container;
        this.bx24 = bx24;
    }

    init() {}

    render(fields, data) {
        let titleDeal = data.TITLE;
        let numberOrder = data.UF_CRM_1633523035;
        let linkTender = data.UF_CRM_1620918041;
        let contentHTML = `
            <div class="col-8">
                <label for="titleDeal">Название сделки</label>
                <div id="titleDeal" class="alert alert-light" role="alert">
                    ${titleDeal}
                </div>
            </div>
            <div class="col-2">
                <label for="numberOrder">№ заказа (автоматически)</label>
                <div id="numberOrder" class="alert alert-light" role="alert">
                    ${numberOrder}
                </div>
            </div> 
            <div class="col-2">
                <label for="linkTender">Ссылка на тендер/CRM клиента</label>
                <div id="linkTender" class="alert alert-light" role="alert">
                    <a class="link-opacity-100-hover" href="${linkTender}" target="_blank">${linkTender}</a>
                </div>
            </div> 
        `;
        this.container.innerHTML = contentHTML;
    }
}
