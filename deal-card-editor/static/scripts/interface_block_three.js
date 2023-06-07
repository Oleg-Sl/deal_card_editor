import WindowSearchUser from './components/search_user/sctipt.js'


const RESPONSIBLE_MOP = "UF_CRM_1619430831";
const RESPONSIBLE_MOS = "UF_CRM_1672839295";    //"UF_CRM_1619700503";
const OBSERVER = "UF_CRM_1684305731";
// const OBSERVER = "UF_CRM_1625666854";

const ID__RESPONSIBLE_MOP = "responsibleMOP";
const ID__RESPONSIBLE_MOS = "responsibleMOS";
const ID__OBSERVER = "observerUser";


class UserSingle {
    constructor(container, bx24) {
        this.container = container;
        this.bx24 = bx24;
        
        this.containerCard = document.createElement('div');
        this.containerSearchUser = document.createElement('div');
        this.windowSearchUser = new WindowSearchUser(this.containerSearchUser, bx24, this.changeUser.bind(this), this.container);

        this.userId = null;
        this.userLastname = null;
        this.userName = null;
        this.userImgLink = null;
    }

    async init() {
        this.renderInit();
        await this.windowSearchUser.init();

        // Смена сотрудника
        this.container.addEventListener("click", async (e) => {
            if (e.target.classList.contains("change-responsible")) {
                this.windowSearchUser.showWindow();
            }
        })

        // событие "открытие страницы с информацией о сотруднике"
        this.container.addEventListener("click", async (e) => {
            if (this.userId && e.target.classList.contains("card-user-name")) {
                let userId = e.target.dataset.userId; 
                let path = `/company/personal/user/${userId}/`;
                console.log(path);
                await this.bx24.openPath(path);
            }     
        })
    }

    getData() {
        return this.userId;
    }

    getFullInfo() {
        return {
            "id": this.userId,
            "lastname": this.userLastname,
            "name": this.userName
        }
    }

    changeUser(userId, lastname, name, userPhoto) {
        this.userId = userId ? userId : "";
        this.userLastname = lastname ? lastname : "Нет";
        this.userName = name ? name : "";
        this.userImgLink =  userPhoto ? userPhoto : "";
        this.renderUserHTML();
    }

    renderInit() {
        this.container.append(this.containerCard);
        this.container.append(this.containerSearchUser);
    }

    render(userData) {
        this.userId = userData.ID ? userData.ID : "";
        this.userLastname = userData.LAST_NAME ? userData.LAST_NAME : "Нет";
        this.userName = userData.NAME ? userData.NAME : "";
        this.userImgLink =  userData.PERSONAL_PHOTO ? userData.PERSONAL_PHOTO : "";
        this.renderUserHTML();
        BX24.fitWindow();
    }

    renderUserHTML() {
        let displayImg = this.userId ? "" : "d-none";
        let contentHTML = `
            <div class="row p-0 m-2 justify-content-between card-user-wrapper">
                <div class="row col-10 p-0 m-0 card-user" data-user-id="${this.userId}">
                    <div class="row p-0 m-0" data-user-id="${this.userId}">
                        <div class="col-3 p-0 m-0 " style="width: 60px; height: 60px;">
                            <img src="${this.userImgLink}" class="rounded-circle ${displayImg}" alt="..." style="width: 100%; height: 100%;">
                        </div>
                        <div class="row col-9 p-0 m-0 text-truncate align-items-center">
                            <span class="text-truncate card-user-name " style="cursor: pointer; " data-user-id="${this.userId}"> ${this.userLastname} ${this.userName}</span>
                        </div>
                    </div>
                </div>
                <div class="row col-2 p-0 m-0 align-items-center" style="font-size: 12px;">
                    <span class="text-body-tertiary float-end change-responsible add-or-change-users" style="cursor: pointer; ">сменить</span>
                </div>
            </div>
        `;
        this.containerCard.innerHTML = contentHTML;
    }
}


class UserMultiple {
    constructor(container, bx24) {
        this.container = container;
        this.bx24 = bx24;

        // Контейнер для карточек пользователей
        this.containerCard = null;
        // Контейнер для карточек пользователей
        this.containerAddUser = null;
        // Контейнер для окна поиска пользователей
        this.containerSearchUser = null;

        this.windowSearchUser = null;
        this.selectedUser = {};
    }

    async init() {
        this.containerCard = document.createElement('div');
        this.containerAddUser = document.createElement('div');
        this.containerAddUser.innerHTML = `<i class="bi bi-plus-circle-fill m-0 p-2 text-success add-observer" style="cursor: pointer; "></i>`;
        this.containerAddUser.style.minHeight = "76px";
        this.containerSearchUser = document.createElement('div');

        this.containerCard.classList.add("row", "col-11", "m-0", "p-0", "list-cards-users");
        this.containerAddUser.classList.add("d-flex", "col-1", "mx-0", "p-0", "justify-content-end", "align-items-center");
        this.containerCard.classList.add("row", "col-11", "m-0", "p-0", "list-cards-users");

        this.container.append(this.containerCard);
        this.container.append(this.containerAddUser);
        this.container.append(this.containerSearchUser);

        this.windowSearchUser = new WindowSearchUser(this.containerSearchUser, this.bx24, this.addedUser.bind(this), this.container);
        await this.windowSearchUser.init();
        this.initHandler();

    }

    initHandler() {
        // Удаление нблюдателя
        this.container.addEventListener("click", async (e) => {
            if (e.target.classList.contains("remove-observer")) {
                let boxCardUser = e.target.closest(".card-user-wrapper");
                let userId = boxCardUser.dataset.userId;
                boxCardUser.remove();
                delete this.selectedUser[userId];
                BX24.fitWindow();
            }
        })
        // событие "открытие страницы с информацией о сотруднике"
        this.container.addEventListener("click", async (e) => {
            if (e.target.classList.contains("card-user-name")) {
                let userId = e.target.dataset.userId; 
                let path = `/company/personal/user/${userId}/`;
                console.log(path);
                await this.bx24.openPath(path);
            }     
        })
        // Добавление сотрудника
        this.container.addEventListener("click", async (e) => {
            if (e.target.classList.contains("add-observer")) {
                console.log("Добавление сотрудника");
                this.windowSearchUser.showWindow();
            }
        })
    }

    getData() {
        return Object.keys(this.selectedUser);
    }

    addedUser(userId, lastname, name, userPhoto) {
        if (userId in this.selectedUser) {
            return;
        }
        let user = {
            ID: userId,
            LAST_NAME: lastname,
            NAME: name,
            PERSONAL_PHOTO: userPhoto
        };
        let cardUserHTML = this.generateCardUserHTML(userId, lastname, name, userPhoto);
        this.containerCard.insertAdjacentHTML('beforeend', cardUserHTML);
        this.selectedUser[userId] = user;
        BX24.fitWindow();
    }

    render(usersData) {
        this.setData(usersData);
        this.containerCard.innerHTML = this.generateCardsUsersHTML();
        BX24.fitWindow();
    }

    setData(usersData) {
        this.selectedUser = usersData;
    }

    generateCardsUsersHTML() {
        let contentHTML = "";
        for (let userId in this.selectedUser) {
            let user = this.selectedUser[userId];
            contentHTML += this.generateCardUserHTML(user.ID, user.LAST_NAME, user.NAME, user.PERSONAL_PHOTO);
        }
        return contentHTML;
    }

    generateCardUserHTML(userId, userLastname, userName, userImgLink) {
        let displayImg = userId ? "" : "d-none";
        let contentHTML = `
            <div class="row col-6 p-0 m-0 justify-content-between align-items-center card-user-wrapper" data-user-id="${userId}">
                <div class="row p-0 m-2 me-4">
                    <div class="row col-10 p-0 m-0">
                        <div class="row p-0 m-0" data-user-id="${userId}">
                            <div class="col-3 p-0 m-0 " style="width: 60px; height: 60px;">
                                <img src="${userImgLink}" class="rounded-circle ${displayImg}" alt="..." style="width: 100%; height: 100%;">
                            </div>
                            <div class="row col-9 p-0 m-0 text-truncate align-items-center">
                                <span class="text-truncate card-user-name " style="cursor: pointer; " data-user-id="${userId}"> ${userLastname} ${userName}</span>
                            </div>
                        </div>
                    </div>
                    <div class="row col-2 p-0 mx-0 align-items-center" style="font-size: 12px;">
                        <span class="m-0 p-0 text-body-tertiary float-start remove-observer" style="cursor: pointer; ">удалить</span>
                    </div>
                </div>
            </div>
        `;
        return contentHTML;
    }
}


export default class InterfaceBlockThree {
    constructor(container, bx24) {
        this.container = container;
        this.bx24 = bx24;
        // Объект блока - ответственный (МОП)
        this.userMOP = null;
        // Объект блока - ответственный (МОС)
        this.userMOS = null;
        // Объект блока - наблюдатели
        this.usersObserver = null;
    }

    init() {
    }

    getData() {
        let data = {};
        data[RESPONSIBLE_MOP] = this.userMOP.getData();
        data[RESPONSIBLE_MOS] = this.userMOS.getData();
        data[OBSERVER] = this.usersObserver.getData();
        return data;
    }
    getResponsible() {
        return this.userMOS.getFullInfo();
    }

    async getDataUserById(users_ids) {
        // let batch = {};
        // for (let user_id of users_ids) {
        //     batch[user_id] = `user.get?ID=${user_id}`;
        //     // batch[user_id] = ['user.get', {"ID": user_id}];
        // }
        let reqPackage = {};
        for (let user_id of users_ids) {
            reqPackage[user_id] = ["user.get", {"ID": user_id}];
            // batch[user_id] = ['user.get', {"ID": user_id}];
        }
        let userData = await this.bx24.batchMethod(reqPackage);
        // return userData.result.result;
        console.log("userData = ", userData);
        return userData;
    }

    async render(fields, data) {
        let idResponsibleMOP = data[RESPONSIBLE_MOP];
        let idResponsibleMOS = data[RESPONSIBLE_MOS];
        let idsObservers = data[OBSERVER] || [];

        let usersData = await this.getDataUserById([idResponsibleMOP, idResponsibleMOS, ...idsObservers]);
        let contentHTML = `
            <div class="col-3">
                <label for="">Ответственный (МОП)</label>
                <div class="p-0 m-0 shadow-sm border border-1 border-dark-subtle rounded" id="${ID__RESPONSIBLE_MOP}">
                    <!-- Карточка сотрудника - ответственный (МОП) -->
                </div>
            </div>

            <div class="col-3">
                    <label for="">Ответственный (МОС)</label>
                <div class="p-0 m-0 shadow-sm border border-1 border-dark-subtle rounded" id="${ID__RESPONSIBLE_MOS}">
                    <!-- Карточка сотрудника - ответственный (МОС) -->
                </div>
            </div>

            <div class="col-6">
                <label for="">Наблюдатели</label>
                <div class="row p-0 mx-0 shadow-sm border border-1 border-dark-subtle rounded list-cards-users-wrapper" id="${ID__OBSERVER}">
                    <!-- Карточка сотрудника - наблюдатели -->
                </div>
            </div>
        `;
        this.container.innerHTML = contentHTML;

        let containerMOP = this.container.querySelector(`#${ID__RESPONSIBLE_MOP}`);
        let containerMOS = this.container.querySelector(`#${ID__RESPONSIBLE_MOS}`);
        let containerObserver = this.container.querySelector(`#${ID__OBSERVER}`);

        this.userMOP = new UserSingle(containerMOP, this.bx24);
        this.userMOS = new UserSingle(containerMOS, this.bx24);
        this.usersObserver = new UserMultiple(containerObserver, this.bx24);

        await this.userMOP.init();
        await this.userMOS.init();
        await this.usersObserver.init();

        let dataUserMOP = usersData[idResponsibleMOP] ? usersData[idResponsibleMOP][0] || {}: {};
        let dataUserMOS = usersData[idResponsibleMOS] ? usersData[idResponsibleMOS][0] || {}: {};
        let dataUserObservers = this.getUserSelectedData(idsObservers, usersData);

        this.userMOP.render(dataUserMOP);
        this.userMOS.render(dataUserMOS);
        this.usersObserver.render(dataUserObservers);
    }

    getUserSelectedData(ids, usersData) {
        let data = {};
        for (let id of ids) {
            if (id in usersData && usersData[id].length > 0) {
                data[id] = usersData[id][0];
            }
        }
        return data;
    }
}
