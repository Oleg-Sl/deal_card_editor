// UF_CRM_1694710116
// UF_CRM_1694710578

export class InterfaceBlockTwo {
    constructor(container, bx24) {
        this.container = container;
        this.bx24 = bx24;
    }

    init() {

    }

    getData() {
        let data = {
            "UF_CRM_1668129559": this.container.querySelector("#taskeditor__UF_CRM_1668129559").value,
            "UF_CRM_1695664525": this.container.querySelector("#taskeditor__UF_CRM_1695664525").value,
            "UF_CRM_1657651541": this.container.querySelector("#taskeditor__UF_CRM_1657651541").value,
            "UF_CRM_1637861351": this.container.querySelector("#taskeditor__UF_CRM_1637861351").value,
            "UF_CRM_1637861029": this.container.querySelector("#taskeditor__UF_CRM_1637861029").value,
            "UF_CRM_1637326777": this.container.querySelector("#taskeditor__UF_CRM_1637326777").value,
            // "UF_CRM_1619441621": this.container.querySelector("#taskeditor__UF_CRM_1619441621").value,
            "UF_CRM_1694710116": this.container.querySelector("#taskeditor__UF_CRM_1694710116").value,
            "UF_CRM_1694710578": this.container.querySelector("#taskeditor__UF_CRM_1694710578").value,
        };
        // console.log("data = ", data);
        return data;
    }

    render(fields, data) {
        let contentHTML = "";

        contentHTML += this.getSelectHTML(fields.UF_CRM_1668129559.items, data.UF_CRM_1668129559, "UF_CRM_1668129559", "Командировка", 1, );   // isBusinessTrip 
        contentHTML += this.getSelectHTML(fields.UF_CRM_1695664525.items, data.UF_CRM_1695664525, "UF_CRM_1695664525", "Замер", 1);  // isMeasuring
        contentHTML += this.getSelectHTML(fields.UF_CRM_1657651541.items, data.UF_CRM_1657651541, "UF_CRM_1657651541", "Демонтаж", 1);   // isDismantling
        contentHTML += this.getSelectHTML(fields.UF_CRM_1637861351.items, data.UF_CRM_1637861351, "UF_CRM_1637861351", "Парковка", 1);   // isParking
        // !!! Неизвестно поле !!!
        contentHTML += this.getSelectHTML(fields.UF_CRM_1637861029.items, data.UF_CRM_1637861029, "UF_CRM_1637861029", "Монтаж 24/7", 1);    // isMounting24
        contentHTML += this.getSelectHTML(fields.UF_CRM_1637326777.items, data.UF_CRM_1637326777, "UF_CRM_1637326777", "Наши реквизиты", 2); // ourRequisite
        // contentHTML += this.getSelectHTML(fields.UF_CRM_1619441621.items, data.UF_CRM_1619441621, "UF_CRM_1619441621", "Спопоб оплаты", 2);  // paymentMethod
        contentHTML += this.getSelectHTML(fields.UF_CRM_1694710116.items, data.UF_CRM_1694710116, "UF_CRM_1694710116", "Аренда бокса", 2);  // paymentMethod
        contentHTML += this.getSelectHTML(fields.UF_CRM_1694710578.items, data.UF_CRM_1694710578, "UF_CRM_1694710578", "Монтаж на территории", 2);  // paymentMethod

        this.container.innerHTML = contentHTML;
    }

    getSelectHTML(itemsSelects, itemKey, titleEng, titleRus, widthCols) {
        let contentSelectHTML = "";
        for (let item of itemsSelects) {
            if (item.ID == itemKey) {
                contentSelectHTML += `<option value="${item.ID}" selected>${item.VALUE}</option>`;
            } else {
                contentSelectHTML += `<option value="${item.ID}">${item.VALUE}</option>`;
            }
        }
        let contentHTML = `
            <div class="col-${widthCols}" id="${titleEng}">
                <label for="taskeditor__${titleEng}" class="text-truncate">${titleRus}</label>
                <select id="taskeditor__${titleEng}" class="form-select" aria-label=".form-select-lg example">
                    ${contentSelectHTML}
                </select>
            </div>
        `;
        return contentHTML;
    }

}

