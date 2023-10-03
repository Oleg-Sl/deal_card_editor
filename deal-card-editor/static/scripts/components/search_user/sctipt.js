import {templateDepartContainerBox}  from './templates/select_item_element.js'
import {templateUserBoxForSearch}   from './templates/user_box_for_search.js'
// import {templateDepartContainerBox} from './templates/department_container_box.js'


// Окно ПОИСК ПОЛЬЗОВАТЕЛЯ
export default class WindowSearchUser {
    constructor(parent, bx, cbChoiseUser, ignoreContainer) {
        this.parent = parent;
        this.bx = bx;
        this.callbackChoiseUser = cbChoiseUser;
        this.ignoreContainer = ignoreContainer;

        this.window = document.createElement('div');
        this.window.classList.add('d-none');
        this.window.classList.add('window-searchcontact');
        
        this.timeAnimate = 1000/100;     // скорость анимации разворачивания/сворачивания списка подразделений - мс./пикс.
        
        this.fieldInput = null;
        this.boxResponsible = null;     // окно ПОИСКА
        this.boxDepartment = null;      // окно ПОДРАЗДЕЛЕНИЙ
        this.btnResponsible = null;     // кнопка открыть "окно ПОИСК"
        this.btnDepartment = null;      // кнопка открыть "окно ОТДЕЛЫ"
        this.btnCloseWindow = null;     // кнопка закрыть окно

        this.departments = null;
    }

    async init(departments) {
        this.render();
        // получение списка подразделений компаниии
        // await this.getDepartments();
        this.departments = departments;                         // получение списка подразделений из Битрикс
        this.companyStructure = this.getTreeDepartments();      // структура компании

        // вывод списка подразделений
        this.renderDepartment();
        // инициализация обработчиков
        this.initHandler();
    }

    resizeWindow() {
        let size = this.parent.getBoundingClientRect();
        let top = size.bottom + window.pageYOffset;
        let left = size.left;
        let width = size.width;
        this.window.style.top = top + 2 + "px";
        this.window.style.left = left + "px";
        this.window.style.width = width + "px";
    }

    render() {
        let contentHTML = `
     
                <div class="window-searchcontact-container">
                    <div class="filter-window-data-close">
                        <button type="button" class="btn-close" aria-label="Close"></button>
                    </div>
                    <!-- Блоки с данными -->
                    <div class="container-data">
                        <!-- Окно для ввода имени сотрудника -->
                        <div class="container-data-block">
                            <div class="container-data-head">
                                <div class="container-data-head-selector">    
                                    <span>
                                        <input class="form-control form-control-sm search-user-input" type="text" autocomplete="on" placeholder="поиск" aria-label="default input example" id="">
                                    </span>
                                </div>
                            </div>
                        </div>
                        <!-- Отфильтрованный список пользователей -->
                        <div class="container-data-user"> </div>
                        <!-- Список сотрудников по подразделениям -->
                        <div class="container-data-depart d-none"> </div>
                    </div>
                    <!-- Кнопка "ПОИСК" -->
                    <div class="btn-search-responsible">
                        <div class="btn-search-logo"><i class="bi bi-search"></i></div>
                        <div class="btn-search-desc">Поиск</div>
                    </div>
                    <!-- Кнопка "ОТДЕЛЫ" -->
                    <div class="btn-search-department btn-search-inactive">
                        <div class="btn-search-logo"><i class="bi bi-people-fill"></i></div>
                        <div class="btn-search-desc">Отделы</div>
                    </div>
                </div>

        `;
        this.window.innerHTML = contentHTML;
        this.parent.append(this.window);


        this.fieldInput = this.window.querySelector("input");
        this.boxResponsible = this.window.querySelector(".container-data-user");                    // окно ПОИСКА
        this.boxDepartment = this.window.querySelector(".container-data-depart");                   // окно ПОДРАЗДЕЛЕНИЙ
        this.btnResponsible = this.window.querySelector(".btn-search-responsible");                 // кнопка открыть "окно ПОИСК"
        this.btnDepartment = this.window.querySelector(".btn-search-department");                   // кнопка открыть "окно ОТДЕЛЫ"
        this.btnCloseWindow = this.window.querySelector(".filter-window-data-close button");        // кнопка закрыть окно
    }

    initHandler() {
        // событие "открытие окна поиска"
        this.btnResponsible.addEventListener("click", async (e) => {
            this.btnResponsible.classList.remove("btn-search-inactive");
            this.btnDepartment.classList.add("btn-search-inactive");
            this.boxResponsible.classList.remove("d-none");
            this.boxDepartment.classList.add("d-none");
        })
        // событие "открытие окна подразделения"
        this.btnDepartment.addEventListener("click", async (e) => {
            this.btnResponsible.classList.add("btn-search-inactive");
            this.btnDepartment.classList.remove("btn-search-inactive");
            this.boxResponsible.classList.add("d-none");
            this.boxDepartment.classList.remove("d-none");
        })
        // событие "добавление пользователя в выбранные"
        this.window.addEventListener("click", async (e) => {
            let boxUser = e.target.closest(".ui-selector-user-box");            // блок-контейнер пользователя, по которому произошел клик
            // если клик не по кнопке "информация о сотруднике"
            if (boxUser && !e.target.closest(".ui-selector-item-user-link")) {
                let userId = boxUser.dataset.userId;
                let lastname = boxUser.dataset.lastname;
                let name = boxUser.dataset.name;
                let userPhoto = boxUser.dataset.userPhoto;
                this.callbackChoiseUser(userId, lastname, name, userPhoto);
            }
        })
        // событие "клик разворачивание/сворачивание списка вложенных подразделений"
        this.boxDepartment.addEventListener("click", async (e) => {
            if (e.target.closest(".ui-selector-item-indicator")) {
                let box = e.target.closest(".ui-selector-item-box");            // блок-контейнер подразделения, по которому произошел клик
                let boxChildren = box.querySelector(".ui-selector-item-children");  // блок-контейнер с дочерними подразделениями родителя, по которому произошел клик
                let departId = box.dataset.departId;                                // id подразделения
                let usersDisplay = box.dataset.userDisplay;                         // список работников выведен/не выведен ("true"/"")
                if (!usersDisplay && departId) {
                    this.getAndDisplayUsersOfdepart(departId, boxChildren);         // получение и вывод списка работников подразделения
                    box.dataset.userDisplay = true;                                 // статус, что сотрудники подразделения уже выведены
                }
                if (box.classList.contains("ui-selector-item-box-open")) {
                    // свернуть вложенные подразделения
                    this.animationClose(boxChildren);
                    box.classList.remove("ui-selector-item-box-open");              // удаляем класс, что вложенные подразделения развернуты
                } else {
                    // развернуть вложенные подразделения
                    this.animationOpen(boxChildren);
                    box.classList.add("ui-selector-item-box-open");                 // добавляем класс, что вложенные подразделения развернуты
                }
            }
        })
        // событие "открытие страницы с информацией о сотруднике"
        this.window.addEventListener("click", async (e) => {
            if (e.target.classList.contains("ui-selector-item-user-link")) {
                let boxUser = e.target.closest(".ui-selector-user-box");            // блок-контейнер пользователя, по которому произошел клик
                let userId = boxUser.dataset.userId; 
                let path = `/company/personal/user/${userId}/`;
                console.log(path);
                await this.bx.openPath(path);
            }
        })
        // кнопка "закрыть окно"
        this.btnCloseWindow.addEventListener('click', (e) => {
            console.log(this.btnCloseWindow);
            this.hideWindow();
        })
        // событие "скрыть окно выбора пользователей"
        document.addEventListener("click", async (e) => {
            if (!e.target.classList.contains("add-or-change-users") && !this.ignoreContainer.contains(e.target)) {
                this.hideWindow();
            }
        })
        // 
        this.fieldInput.addEventListener("click", async (e) => {
            this.showWindow();
            let name = e.target.value;
            this.getAndDisplayUsersSearch(name);
        })
        // событие "поиск пользователя"
        this.fieldInput.addEventListener("input", async (e) => {
            this.showWindow();
            let name = e.target.value;
            this.getAndDisplayUsersSearch(name);
        })

        // событие изменение значения фильтра
        // $(this.field).bind("DOMSubtreeModified", (e) => {
        $(this.ignoreContainer).bind("DOMSubtreeModified", (e) => {
            this.resizeWindow();
        })
    }

    showWindow() {
        this.resizeWindow();
        this.window.classList.remove("d-none");
    }

    hideWindow() {
        this.window.classList.add("d-none");
    }

    // получение и вывод списка работников в окне поиска
    async getAndDisplayUsersSearch(name) {
        let contentHTML = "";
        let users = await this.bx.callMethod("user.search", {                             // получение списка пользователей подразделения из Битрикс
            "FILTER": {"NAME": `${name}%`, "ACTIVE": true}
        });
        let usersByLastname = await this.bx.callMethod("user.search", {                             // получение списка пользователей подразделения из Битрикс
            "FILTER": {"LAST_NAME": `${name}%`, "ACTIVE": true}
        });
        // users = users.result;
        // usersByLastname = usersByLastname.result;
        users.concat(usersByLastname);
        for (let user of users) {
            contentHTML += templateUserBoxForSearch(user.ID, user.LAST_NAME, user.NAME, user.WORK_POSITION, user.USER_TYPE, user.PERSONAL_PHOTO);
        }
        this.boxResponsible.innerHTML = contentHTML;
    }

    // получение и вывод списка работников подразделения
    async getAndDisplayUsersOfdepart(departId, box) {
        let contentHTML = "";
        let users = await this.bx.callMethod("user.get", {                               // получение списка пользователей подразделения из Битрикс
            "ACTIVE": true, "UF_DEPARTMENT": departId, "ADMIN_MODE": true
        });

        // for (let user of users.result) {
        for (let user of users) {
            contentHTML += templateUserBoxForSearch(user.ID, user.LAST_NAME, user.NAME, user.WORK_POSITION, user.USER_TYPE, user.PERSONAL_PHOTO);
        }
        box.insertAdjacentHTML('beforeend', contentHTML);
    }

    // получение списка подразделений компаниии
    async getDepartments() {
        let response = await this.bx.callMethod("department.get");          // получение списка подразделений из Битрикс
        // this.departments = response.result;                                 // получение списка подразделений из Битрикс
        this.departments = response;                                 // получение списка подразделений из Битрикс
        this.companyStructure = this.getTreeDepartments();                      // структура кмпании
    }

    // возвращает иерархическую структуру компании
    getTreeDepartments(parent=undefined) {
        let departmentsList = [];                                               // список департаментов с родительским подразделений = "parent"
        if (!this.departments) return;
        for (let department of this.departments) {
            if (department.PARENT === parent) {
                let children = this.getTreeDepartments(department.ID);          // список дочерних подразделений
                if (children.length !== 0) {
                    department.CHILDREN = children;
                }
                departmentsList.push(department);
            }
        }
        return departmentsList;
    }

    // вывод иерархической структуры подразделений предприятия
    renderDepartment() {
        this.boxDepartment.innerHTML = this.getHierarchHtmlDepartments(this.companyStructure);
    }

    // возвращает иерархическую HTML структуру подразделений на основе переданныхиерархических данных
    getHierarchHtmlDepartments(departments) {
        let contentHTML = '';
        for (let department of departments) {
            let departChildrenHTML = "";
            if (!department) return ""; 
            if (Array.isArray(department.CHILDREN) && department.CHILDREN.length >= 1) {
                departChildrenHTML += this.getHierarchHtmlDepartments(department.CHILDREN);
            }
            contentHTML += templateDepartContainerBox(department.ID, department.NAME, departChildrenHTML);
        }
        // console.log("contentHTML = ", contentHTML);
        return contentHTML;
    }


    // <<<<<<<===== АНИМАЦИИ =====>>>>>>>
    animationOpen(element) {
        let anime = element.animate({
            height: `${element.scrollHeight}px`}, this.timeAnimate //* element.scrollHeight
        );
        anime.addEventListener('finish', function() {
            element.style.height = '100%';
        });
        this.animate = anime;
    }

    animationClose(element) {
        let height = element.offsetHeight || element.scrollHeight;
        element.style.height = `${height}px`;
        let anime = element.animate(
            {height: "0px"}, this.timeAnimate //* height
        )
        anime.addEventListener('finish', function() {
            element.style.height = '0px';
        });
        this.animate = anime;
    }

    // получить параметры филитрации для выполнения запроса
    getRequestParameters() {
        const selectedItems = this.field.getElementsByClassName("filter-item");
        let ids = [];
        for (let item of selectedItems) {
            ids.push(item.dataset.idBx);
        }
        return ids;

    }
}


