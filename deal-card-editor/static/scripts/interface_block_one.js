
export default class InterfaceBlockOne {
    constructor(container, bx24) {
        this.container = container;
        this.bx24 = bx24;
    }

    init() {}

    initHandler() {
        btnTenderChange.addEventListener("click", async (e) => {
            let value = tenderlink.innerHTML;
            tenderInput.value = value;
            wrapTenderLink.classList.add("d-none");
            wrapTenderInput.classList.remove("d-none");
        })
        tenderInput.addEventListener("change", async (e) => {
            let value = tenderInput.value;
            tenderlink.innerHTML = value;
            wrapTenderLink.classList.remove("d-none");
            wrapTenderInput.classList.add("d-none");
        })
    }

    initPostRender() {
        this.wrapTenderLink = this.container.querySelector(".wrap-tender-link");
        this.btnTenderChange = this.wrapTenderLink.querySelector(".btn-tender-change");
        this.tenderlink = this.wrapTenderLink.querySelector(".btn-tender-link");
        this.wrapTenderInput = this.container.querySelector(".wrap-tender-input");
        this.tenderInput = this.wrapTenderInput.querySelector("input");
        this.numberTaskInput = this.container.querySelector(".wrap-number-task input");
        
    }

    getData() {
        let data = {
            "UF_CRM_1633523035": this.numberTaskInput.value,
            "UF_CRM_1620918041": this.tenderInput.value,
        };
        // console.log("data = ", data);
        return data;
    }

    render(fields, data) {
        let titleDeal = data.TITLE;
        let numberOrder = data.UF_CRM_1633523035;
        let linkTender = data.UF_CRM_1620918041;
        let contentHTML = `
            <div class="col-6">
                <label for="titleDeal">Название сделки</label>
                <div id="titleDeal" class="alert alert-light" role="alert">
                    ${titleDeal}
                </div>
            </div>
            <div class="col-3">
                <label for="numberOrder">№ заказа (автоматически)</label>
                <div id="numberOrder" class="alert alert-light wrap-number-task" role="alert">
                    <input class="form-control form-control-lg" type="text" value="${numberOrder}" aria-label=".form-control-lg example">
                </div>
            </div> 
            <div class="col-3">
                <label for="linkTender">Ссылка на тендер/CRM клиента</label>
                <div class="row wrap-tender-link">
                    <div id="linkTender" class="alert alert-light col-11" role="alert">
                        <a class="link-opacity-100-hover btn-tender-link" href="${linkTender}" target="_blank">${linkTender}</a>
                    </div>
                    <div class="col-1 row align-items-center change-tender-url" style="margin-bottom: 16px;">
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
        this.initHandler();
    }
}
