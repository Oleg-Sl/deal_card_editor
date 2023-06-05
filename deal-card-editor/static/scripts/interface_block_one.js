
export default class InterfaceBlockOne {
    constructor(container, bx24) {
        this.container = container;
        this.bx24 = bx24;
    }

    init() {}

    initHandler() {
        this.btnTenderChange.addEventListener("click", async (e) => {
            let value = this.tenderlink.innerHTML;
            this.tenderInput.value = value;
            this.wrapTenderLink.classList.add("d-none");
            this.wrapTenderInput.classList.remove("d-none");
        })
        this.tenderInput.addEventListener("change", async (e) => {
            let value = this.tenderInput.value;
            this.tenderlink.innerHTML = value;
            this.wrapTenderLink.classList.remove("d-none");
            this.wrapTenderInput.classList.add("d-none");
        })
    }

    initPostRender() {
        this.wrapTenderLink = this.container.querySelector(".wrap-tender-link");
        this.btnTenderChange = this.wrapTenderLink.querySelector(".btn-tender-change");
        this.tenderlink = this.wrapTenderLink.querySelector(".btn-tender-link");
        this.wrapTenderInput = this.container.querySelector(".wrap-tender-input");
        this.tenderInput = this.wrapTenderInput.querySelector("input");
        this.numberTaskInput = this.container.querySelector(".wrap-number-task");
        // console.log("this.wrapTenderLink = ", this.wrapTenderLink);
        // console.log("this.btnTenderChange = ", this.btnTenderChange);
        // console.log("this.tenderlink = ", this.tenderlink);
        // console.log("this.wrapTenderInput = ", this.wrapTenderInput);
        // console.log("this.tenderInput = ", this.tenderInput);
        // console.log("this.numberTaskInput = ", this.numberTaskInput);
        this.initHandler();
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
                        <a class="link-opacity-100-hover btn-tender-link" href="${linkTender}" target="_blank">${linkTender}</a>
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
}
