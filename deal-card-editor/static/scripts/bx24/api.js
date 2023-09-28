


export async function bx24TaskUpdate(bx24, taskId, dataTask) {
    let response = await bx24.callMethod(
        "tasks.task.update",
        {
            "taskId": taskId,
            "fields": dataTask
        }
    );
    return response;
}
