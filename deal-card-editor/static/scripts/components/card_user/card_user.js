// Окно ПОИСК ПОЛЬЗОВАТЕЛЯ
export default class CardUser {
    constructor(container, bx24) {
        this.container = container;
        this.bx24 = bx24;

        this.userId = null;
        this.name = null;
        this.lastname = null;
        this.srcImage = null;
    }

    init() {
        // событие "открытие страницы с информацией о сотруднике"
        this.container.addEventListener("click", async (e) => {
            if (e.target.classList.contains("card-user__name")) {
                // let boxUser = e.target.closest(".card-user__name");            // блок-контейнер пользователя, по которому произошел клик
                // let userId = boxUser.dataset.userId;
                // let userId = e.target.userId;
                let path = `/company/personal/user/${this.userId}/`;
                console.log(path);
                // await this.bx.openPath(path);
            }            
        })
    }

    getUserId() {
        return this.userId;
    }

    async getUserData(userId) {
        let users = await this.bx.callMethod("user.get", {"ID": userId});
        if(Array.isArray(users) && users.length === 1) {
            let user = users[0];    
            this.name = user.NAME;
            this.lastname = user.LAST_NAME;
            this.srcImage = user.PERSONAL_PHOTO; // TODO: получить url
        }
    }


    generateCardHTML() {
        let contentHTML = `
            <div class="row justify-content-between shadow-sm p-2 align-items-center border border-1 border-dark-subtle rounded card-user">
                <div class="col-3 p-0" style="width: 60px; height: 60px;" data-user-id="${this.userId}">
                    <img src="${this.srcImage}" class="rounded-circle" alt="..." style="width: 100%; height: 100%;">
                </div> justify-content-start
                <div class="col-8 text-truncate card-user__name" data-user-id="${this.userId}">
                    <span style="cursor: pointer; ">${this.lastname} ${this.name}</span>
                </div>
                <div class="col-2" style="font-size: 12px;">
                    <span class="text-body-tertiary float-end" style="cursor: pointer;">сменить</span>
                </div> 
            </div>
        `;
        this.container.innerHTML = contentHTML;
    }

}
