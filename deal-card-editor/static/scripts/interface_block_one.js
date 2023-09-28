
export default class InterfaceBlockOne {
    constructor(container, bx24) {
        this.container = container;
        this.bx24 = bx24;

        this.fields = NaN;
        this.data = NaN;
    }

    init(fields, data) {
        this.fields = fields;
        this.data = data;
    }

    initHandler() {
        this.btnTenderChange.addEventListener("click", async (e) => {
            let value = this.tenderlink.innerHTML;
            this.tenderInput.value = value;
            this.wrapTenderLink.classList.add("d-none");
            this.wrapTenderInput.classList.remove("d-none");
        })

        this.tenderInput.addEventListener("change", async (e) => {
            let value = this.tenderInput.value || "";
            this.tenderlink.innerHTML = value;
            this.tenderlink.href = this.addHttpsPrefixIfMissing(value);
            this.wrapTenderLink.classList.remove("d-none");
            this.wrapTenderInput.classList.add("d-none");
        })
    }

    initPostRender() {
        this.wrapTenderLink  = this.container.querySelector(".wrap-tender-link");
        this.btnTenderChange = this.wrapTenderLink.querySelector(".btn-tender-change");
        this.tenderlink      = this.wrapTenderLink.querySelector(".btn-tender-link");
        this.wrapTenderInput = this.container.querySelector(".wrap-tender-input");
        this.tenderInput     = this.wrapTenderInput.querySelector("input");
        this.numberTaskInput = this.container.querySelector(".wrap-number-task");
        this.initHandler();
    }

    getData() {
        return {
            FIELD_NUMBER_ORDER: this.numberTaskInput.value,
            FIELD_LINK_TENDER:  this.tenderInput.value,
        };
    }

    render() {
        let titleDeal   = this.data.TITLE;
        let numberOrder = this.data[FIELD_NUMBER_ORDER] || "";
        let linkTender  = this.data[FIELD_LINK_TENDER] || "";
        let contentHTML = `
            <div class="col-6">
                <label for="titleDeal">Название сделки</label>
                <div id="titleDeal" class="alert alert-light p-2 m-0" role="alert" style="height: 48px;">
                    ${titleDeal}
                </div>
            </div>
            <div class="col-3">
                <label for="numberOrder">№ заказа (автоматически)</label>
                <input class="form-control form-control-lg wrap-number-task" type="text" value="${numberOrder}" aria-label=".form-control-lg example">
            </div> 
            <div class="col-3">
                <label for="linkTender">Ссылка на тендер/CRM клиента</label>
                <div class="row wrap-tender-link">
                    <div id="linkTender" class="alert alert-light col-11 p-2 m-0" role="alert" style="height: 48px;">
                        <a class="link-opacity-100-hover btn-tender-link" href="${this.addHttpsPrefixIfMissing(linkTender)}" target="_blank">${linkTender}</a>
                    </div>
                    <div class="col-1 row align-items-center change-tender-url">
                        <i class="bi bi-pencil-square btn-tender-change"></i>
                    </div>
                </div>
                <div class="d-none wrap-tender-input">
                    <input class="form-control form-control-lg" type="text" value="${linkTender}" aria-label=".form-control-lg example">
                </div>
            </div> 
        `;
        this.container.innerHTML = contentHTML;
        this.initPostRender();
    }

    addHttpsPrefixIfMissing(url) {
        if (url && !url.startsWith("https://") && !url.startsWith("http://")) {
            return "https://" + url;
        }
        return url;
    }
}
