import {
    FIELD_DESC_ORDER,
} from "./parameters.js"


export default class InterfaceBlockFour {
    constructor(container, bx24) {
        this.container = container;
        this.bx24 = bx24;

        this.elementEditor = NaN;
    }

    init(fields, data) {
        this.fields = fields;
        this.data = data;

        this.elementEditor = this.container.querySelector("#editor");
        this.initHandler();
    }

    initHandler() {
        this.elementEditor.addEventListener("input", async (e) => {
            if (e.target.tagName == "TEXTAREA") {
                BX24.fitWindow();
            }
        });
    }

    getData() {
        let data = {};
        data[FIELD_DESC_ORDER] = this.elementEditor.querySelector("textarea").value;
        return data;
    }

    async render() {
        let descOrder = this.data[FIELD_DESC_ORDER];
        this.elementEditor.innerHTML = `
            <textarea class="form-control" id="" rows="5">${descOrder}</textarea>
        `;
    }
}
