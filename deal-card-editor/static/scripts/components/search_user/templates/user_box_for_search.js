// Тип пользователя
const USER_TYPE = {
    "employee": "",
    "extranet": "Гость",
    "email": "Гость",
}


/**
 * Возвращает HTML-код шаблона сотрудника для контейнера - "поиск сотрудника по имени"/"поиск по подразделениям" 
 * @param {number} userId Идентификатор пользователя
 * @param {string} lastname Фамилия пользователя
 * @param {string} name Имя пользователя
 * @param {string} workposition Должность
 * @param {string} userType Тип пользователя
 * @returns {string} HTML код шаблона сотрудника
 */
function templateUserBoxForSearch(userId, lastname, name, workposition, userType, personalPhoto) {
    let cssClassIntranet = "ui-selector-item-box-guest";    // css класс приглашенного пользователя
    // если пользователь экстранет
    if (userType === "employee") {
        cssClassIntranet = "";
    }
    return `
        <div class="ui-selector-item-box ui-selector-user-box ${cssClassIntranet}" data-user-id="${userId}" data-lastname="${lastname}" data-name="${name}" data-user-type="${userType}" data-user-photo="${personalPhoto}">
            <div class="ui-selector-item">
                <div class="ui-selector-item-useravatar"><i class="bi bi-people-fill"></i></div>
                <div class="ui-selector-item-titles">
                    <div class="ui-selector-item-supertitle"></div>
                    <div class="ui-selector-item-title-box">
                        <div class="ui-selector-item-title-box-title">${lastname} ${name}</div>
                        <div class="ui-selector-item-title-box-status"><span>${USER_TYPE[userType] || userType}</span></div>
                        <div class="ui-selector-item-title-box-workposition">${workposition || ""}</div>
                    </div>
                    <div class="ui-selector-item-user-link">о сотруднике</div>
                </div>
                <div class="">
                    <div></div>
                </div>
            </div>
        </div>
    `;
}

export {templateUserBoxForSearch, };

