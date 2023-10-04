import {
    FIELD_BUSINESS_TRIP,
    FIELD_METERING,
    FIELD_DISMANTLING,
    FIELD_PARKING,
    FIELD_COLOR_PROOF,
    FIELD_INSTALL,
    FIELD_OURDETAILS,
    FIELD_BOXING_RENTAL,
    FIELD_INSTALL_ON_TERRIT,
} from "./parameters.js"



export class InterfaceBlockTwo {
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

    getData() {
        let data = {};
        data[FIELD_BUSINESS_TRIP]     = this.container.querySelector(`#taskeditor__${FIELD_BUSINESS_TRIP}`).value;
        data[FIELD_METERING]          = this.container.querySelector(`#taskeditor__${FIELD_METERING}`).value;
        data[FIELD_DISMANTLING]       = this.container.querySelector(`#taskeditor__${FIELD_DISMANTLING}`).value;
        data[FIELD_PARKING]           = this.container.querySelector(`#taskeditor__${FIELD_PARKING}`).value;
        data[FIELD_COLOR_PROOF]       = this.container.querySelector(`#taskeditor__${FIELD_COLOR_PROOF}`).value;
        data[FIELD_INSTALL]           = this.container.querySelector(`#taskeditor__${FIELD_INSTALL}`).value;
        data[FIELD_OURDETAILS]        = this.container.querySelector(`#taskeditor__${FIELD_OURDETAILS}`).value;
        data[FIELD_BOXING_RENTAL]     = this.container.querySelector(`#taskeditor__${FIELD_BOXING_RENTAL}`).value;
        data[FIELD_INSTALL_ON_TERRIT] = this.container.querySelector(`#taskeditor__${FIELD_INSTALL_ON_TERRIT}`).value;
        return data;
    }

    render() {
        let contentHTML = "";
        contentHTML += this.getSelectHTML(this.fields[FIELD_BUSINESS_TRIP].items,     this.data[FIELD_BUSINESS_TRIP],     FIELD_BUSINESS_TRIP,     "Командировка",         1);
        contentHTML += this.getSelectHTML(this.fields[FIELD_METERING].items,          this.data[FIELD_METERING],          FIELD_METERING,          "Замер",                1);
        contentHTML += this.getSelectHTML(this.fields[FIELD_DISMANTLING].items,       this.data[FIELD_DISMANTLING],       FIELD_DISMANTLING,       "Демонтаж",             1);
        contentHTML += this.getSelectHTML(this.fields[FIELD_PARKING].items,           this.data[FIELD_PARKING],           FIELD_PARKING,           "Парковка",             1);
        contentHTML += this.getSelectHTML(this.fields[FIELD_COLOR_PROOF].items,       this.data[FIELD_COLOR_PROOF],       FIELD_COLOR_PROOF,       "Печать согласно ЦП?",  1);
        contentHTML += this.getSelectHTML(this.fields[FIELD_INSTALL].items,           this.data[FIELD_INSTALL],           FIELD_INSTALL,           "Монтаж 24/7",          1);
        contentHTML += this.getSelectHTML(this.fields[FIELD_OURDETAILS].items,        this.data[FIELD_OURDETAILS],        FIELD_OURDETAILS,        "Наши реквизиты",       2);
        contentHTML += this.getSelectHTML(this.fields[FIELD_BOXING_RENTAL].items,     this.data[FIELD_BOXING_RENTAL],     FIELD_BOXING_RENTAL,     "Аренда бокса",         2);
        contentHTML += this.getSelectHTML(this.fields[FIELD_INSTALL_ON_TERRIT].items, this.data[FIELD_INSTALL_ON_TERRIT], FIELD_INSTALL_ON_TERRIT, "Монтаж на территории", 2);
        this.container.innerHTML = contentHTML;
    }

    getSelectHTML(itemsSelects, itemKey, titleEng, titleRus, widthCols) {
        let contentSelectHTML = "";
        if (titleEng == FIELD_METERING) {
            contentSelectHTML += `<option value=""></option>`;
        }
        for (let item of itemsSelects) {
            if (item.ID == itemKey) {
                contentSelectHTML += `<option value="${item.ID}" selected>${item.VALUE}</option>`;
            } else {
                contentSelectHTML += `<option value="${item.ID}">${item.VALUE}</option>`;
            }
        }
        let contentHTML = `
            <div class="col-${widthCols}" id="${titleEng}">
                <label for="taskeditor__${titleEng}" class="text-truncate" style="width: 100%;" title="${titleRus}">${titleRus}</label>
                <select id="taskeditor__${titleEng}" class="form-select" aria-label=".form-select-lg example">
                    ${contentSelectHTML}
                </select>
            </div>
        `;
        return contentHTML;
    }
}

