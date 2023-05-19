const DESC_ORDER = "UF_CRM_1655918107";

export default class InterfaceBlockFour {
    constructor(container, bx24) {
        this.container = container;
        this.bx24 = bx24;
    }

    

    init() {
        // Создание экземпляра ResizeObserver
        let resizeObserver = new ResizeObserver(function(entries) {
            for (var entry of entries) {
                let target = entry.target;
                let newHeight = target.clientHeight;
                BX24.fitWindow(); 
                // Ваш код для обработки изменения высоты блока
                console.log("Высота блока изменилась:", newHeight);
            }
        });
        
        // Добавление блока для отслеживания изменения высоты
        resizeObserver.observe(this.container);
  
        // this.container.addEventListener('resize', function() {
        //     console.log("resize");
        //     BX24.fitWindow();
        // });
        // this.container.addEventListener('input', function() {
        //     console.log("input");
        //     BX24.fitWindow();
        // });
        // $(document.body).bind("DOMSubtreeModified", (e) => {
        //     console.log("DOMSubtreeModified");
        //     BX24.fitWindow();
        //     console.log("AFTER");
        // })
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
