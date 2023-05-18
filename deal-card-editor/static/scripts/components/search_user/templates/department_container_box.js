/**
 * Возвращает HTML-код контейнера структуры компании
 * @param {number} departId Идентификатор подразделения
 * @param {string} departName Название подразделения
 * @param {string} departChildrenHTML HTML код дочерних подразделений
 * @returns {string} HTML код контейнера структуры компании
 */
function templateDepartContainerBox(departId, departName, departChildrenHTML) {
    return `
        <div class="ui-selector-item-box" data-depart-id="${departId}">
            <div class="ui-selector-item">
                <div class="ui-selector-item-avatar"><i class="bi bi-people-fill"></i></div>
                <div class="ui-selector-item-titles">
                    <div class="ui-selector-item-supertitle">Отдел</div>
                    <div class="ui-selector-item-title-box">${departName}</div>
                </div>
                <div class="ui-selector-item-indicator">
                    <div><i class="bi bi-chevron-down"></i></div>
                </div>
            </div>
            <div class="ui-selector-item-children">
                ${departChildrenHTML}
            </div>
        </div>
    `;
}

export {templateDepartContainerBox, };
