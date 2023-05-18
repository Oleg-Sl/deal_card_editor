const DESC_ORDER = "UF_CRM_1655918107";

export default class InterfaceBlockFour {
    constructor(container, bx24) {
        this.container = container;
        this.bx24 = bx24;
    }

    init() {

    }

    getData() {
        let textarea = document.querySelector('#editor');
        let editor = sceditor.instance(textarea);
        let data = {};
        data[DESC_ORDER] = editor.val();
        return data;
    }

    async render(fields, data) {
        let descOrder = data[DESC_ORDER];
        let textarea = document.querySelector('#editor');
        let editor = sceditor.instance(textarea);
        editor.insert(descOrder);
        editor.updateOriginal();

    }

}
