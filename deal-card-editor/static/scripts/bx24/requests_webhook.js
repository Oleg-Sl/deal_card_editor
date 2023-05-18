const WEB_HOOK = "https://007.bitrix24.ru/rest/255/l91i6t2hq7m7j331";


export default class Bitrix24 {
    constructor() {}

    async callMethod(method, params = {}) {
        let api = `${WEB_HOOK}/${method}`;
        // console.log("api = ", api);
        let response = await fetch(api, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params)
        });
        let data = await response.json();
        // console.log(data);
        return data;
    }

    async batchMethod(cmd) {
        let api = `${WEB_HOOK}/batch`;
        // console.log("api = ", api);
        let response = await fetch(api, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(   {
                'halt': 0,
                'cmd': cmd
            })
        });
        let data = await response.json();
        return data;
    }

    // // Выполнение пакетного запроса
    // async batchMethod(reqPackage) {
    //     return new Promise((resolve, reject) => {
    //         let callback = result => {
    //             let response = {};
    //             for (let key in result) {
    //                 if (result[key].status != 200 || result[key].error()) {
    //                     console.log(`${result[key].error()} (method ${reqPackage[key]["method"]}: ${JSON.stringify(reqPackage[key]["params"])})`);
    //                     // return reject("");
    //                     continue;
    //                 }
    //                 let resData = result[key].data();
    //                 response[key] = resData;
    //             }
    //             return resolve(response);
    //         };
    //         BX24.callBatch(reqPackage, callback);
    //     });
    // }
}
