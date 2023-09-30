import { SMART_FIELDS, } from '../parameters.js';




// *******TASK*******
export default async function bx24TaskUpdate(bx24, taskId, dataTask) {
    let response = await bx24.callMethod(
        "tasks.task.update",
        {
            "taskId": taskId,
            "fields": dataTask
        }
    );
    return response;
}

export async function bx24TaskAddComment(bx24, taskId, msg, authorId) {
    let data = await bx24.callMethod(
        "task.commentitem.add",
        {
            "taskId": taskId,
            "fields": {
                "AUTHOR_ID": authorId,
                "POST_MESSAGE": msg
            }
        }
    );
    console.log("Отправлен комментарий, овет от Битрикс: ", data);
    return data;
}


// *******USER*******
export async function bx24UserGetCurrent(bx24) {
    let data = await bx24.callMethod("user.current", {});
    return data;
}

export async function bx24UserGetDataByIds(bx24, users_ids) {
    let reqPackage = {};
    for (let user_id of users_ids) {
        if (user_id) {
            reqPackage[user_id] = ["user.get", {"ID": user_id}];
        }
    }
    let userData = await bx24.batchMethod(reqPackage);
    return userData;
}


// *******DEAL*******
export async function bx24DealGetFields(bx24) {
    let data = await bx24.callMethod("crm.deal.fields", {});
    return data;
}

export async function bx24DealGetData(bx24, dealId) {
    let data = await bx24.callMethod(
        "crm.deal.list",
        {
            "filter": { "ID": dealId },
            "select": ["*", "UF_*",]
        }
    );
    return data[0];
}

export async function bx24DealUpdate(bx24, dealId, data) {
    console.log("saveDealToBx24 = ", data);
    let response = await bx24.callMethod(
        "crm.deal.update",
        {
            "id": dealId,
            "fields": data
        }
    );
    return response;
}


// *******CONTACT*******
export async function bx24ContactGetData(bx24, contactId) {
    if (!contactId) {
        return;
    }
    let data = await bx24.callMethod(
        "crm.contact.list",
        {
            "filter": { "ID": contactId },
            "select": ["NAME", "LAST_NAME","SECOND_NAME", "PHONE"]
        }
    );
    return data[0];
}


// *******SMART_PROCESS*******
export async function bx24SmartProcessUpdate(bx24, smartNumber, data) {
    if (data.length == 0) {
        return;
    }
    let reqPackage = {};
    for (let item of data) {
        let tmp = {...item};
        delete tmp.id;
        let idSmartProcess = item.id;
        reqPackage[idSmartProcess] = ["crm.item.update", {
            entityTypeId: smartNumber, id: idSmartProcess, fields: tmp
        }];
    }
    let response = await bx24.batchMethod(reqPackage);
    return response;
}


export async function bx24SmartProcessGetList(bx24, smartNumber, dealId) {
    let data = await bx24.callMethod(
        "crm.item.list",
        {
            "entityTypeId": smartNumber,
            "filter": { "parentId2": dealId },
            "select": [
                "id",
                SMART_FIELDS.TITLE,
                SMART_FIELDS.COUNT_PIECES,
                SMART_FIELDS.TECHNOLOGY,
                SMART_FIELDS.FILM,
                SMART_FIELDS.LAMINATION,
                SMART_FIELDS.WIDTH_FILM,
                SMART_FIELDS.LINEAR_METER_PIECES,
                SMART_FIELDS.SQUARE_METER_PIECES,
                SMART_FIELDS.LINEAR_METER_TOTAL,
                SMART_FIELDS.SQUARE_METER_TOTAL,
                SMART_FIELDS.LINK_SRC,
                SMART_FIELDS.CLIENT_FILES,
                SMART_FIELDS.PREPRESS,
                SMART_FIELDS.COMMENT,
            ]
        }
    );
    return data.items;
}
