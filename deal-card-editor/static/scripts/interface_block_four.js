// const DESC_ORDER = "UF_CRM_1655918107";

// export default class InterfaceBlockFour {
//     constructor(container, bx24) {
//         this.container = container;
//         this.bx24 = bx24;
//     }

    

//     init() {
//         // Создание экземпляра ResizeObserver
//         let resizeObserver = new ResizeObserver(function(entries) {
//             // for (var entry of entries) {
//             //     BX24.fitWindow(); 
//             // }
//             BX24.fitWindow();
//         });
        
//         // Добавление блока для отслеживания изменения высоты
//         // resizeObserver.observe(this.container);
  
//         // this.container.addEventListener('resize', function() {
//         //     console.log("resize");
//         //     BX24.fitWindow();
//         // });
//         // this.container.addEventListener('input', function() {
//         //     console.log("input");
//         //     BX24.fitWindow();
//         // });
//         // $(document.body).bind("DOMSubtreeModified", (e) => {
//         //     console.log("DOMSubtreeModified");
//         //     BX24.fitWindow();
//         //     console.log("AFTER");
//         // })
//     }

//     getData() {
//         let textarea = document.querySelector('#editor');
//         let editor = sceditor.instance(textarea);
//         let data = {};
//         data[DESC_ORDER] = this.truncateStr(editor.val());
//         return data;
//     }

//     truncateStr(str) {
//         return str.replace(/(<p(?:\s[^>]*)?>\s*<br>\s*<\/p>)$/i, "");
//         // if (str.endsWith("<p><br></p>")) {
//         //     return str.slice(0, str.length - "<p><br></p>".length);
//         // }
//         // return str;
//     }

//     async render(fields, data) {
//         let descOrder = data[DESC_ORDER];
//         let textarea = document.querySelector('#editor');
//         let editor = sceditor.instance(textarea);
//         editor.insert(descOrder);
//         editor.updateOriginal();

//     }

//     // convertingStrToASCII(str) {
//     //     return str.replace("<p>", "").replace("</p>", "\n");
//     // }

//     // convertingStrToHTML(str) {
//     //     return str.replace("<p>", "").replace("</p>", "\n");
//     // }

// }



// var Quill = window.Quill;
// var Clipboard = Quill.import('modules/clipboard');

// Quill.register('modules/clipboard', Clipboard);


// const DESC_ORDER = "UF_CRM_1687857777";
const DESC_ORDER = "UF_CRM_1655918107";


export default class InterfaceBlockFour {
    constructor(container, bx24) {
        this.container = container;
        this.bx24 = bx24;
        this.elemContent = null;
    }

    init() {

        // Отслеживание изменения размера поля ввода
        this.elemContent.addEventListener("input", async (e) => {
            BX24.fitWindow();
        });
    }

    getData() {
        let data = {};
        data[DESC_ORDER] = this.elemContent;
        return data;
    }

    async render(fields, data) {
        let descOrder = data[DESC_ORDER];
        this.container.innerHTML = `<textarea class="form-control" id="" rows="3">${descOrder}</textarea>`;
        this.elemContent.querySelector("textarea");
        console.log("textarea = ", this.elemContent);
    }
}


// export default class InterfaceBlockFour {
//     constructor(container, bx24) {
//         this.container = container;
//         this.bx24 = bx24;
//         this.quill = null;
//     }

//     init() {
//         this.quill = new Quill('#editor', {
//             theme: 'snow',
//         });

//         // Отслеживание изменения размера поля ввода
//         this.quill.on('editor-change', function(eventName) {
//             if (eventName === 'text-change') {
//                 // Здесь можно выполнить нужные действия в случае изменения размера поля ввода
//                 BX24.fitWindow();
//             }
//         });
//     }

//     getData() {
//         var contents = this.quill.root.innerHTML;
//         let data = {};
//         data[DESC_ORDER] = contents;
//         return data;
//     }

//     async render(fields, data) {
//         let descOrder = data[DESC_ORDER];
//         this.quill.clipboard.dangerouslyPasteHTML(descOrder);
//     }
// }

