import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {UrlManager} from "../utils/url-manager.js";
import {Auth} from "../services/auth";

export class EditIncomeExpanses {
    constructor() {
        this.profileElement  =  document.getElementById('profileIssue');
        this.profileFullNameElement  =  document.getElementById('profileFullName');
        this.routeParams = UrlManager.getQueryParams();
        this.toggleUser();
        this.type = document.getElementById('type');
        this.operationId = this.routeParams.id;
        this.operation = {};
        this.categoryId = null;
        this.category = [];
        this.init();
    }

    async init() {
        this.operation = await CustomHttp.request(config.host + '/operations/' + this.routeParams.id);
        await this.valueInput(this.operation)
    }

    async getCategory() {
        if (this.type.value === 'expense') {
            const categoryExp = await CustomHttp.request(config.host + '/categories/expense');
            this.category = categoryExp;
        } else if (this.type.value === 'income') {
            const categoryInc = await CustomHttp.request(config.host + '/categories/income')
            this.category = categoryInc;
        }

        const category = document.querySelector('.category');
        category.innerHTML = '';
        this.category.forEach(item => {
            const newBlock = `<option value="${item.title}" id="${item.id}">${item.title}</option>`;
            category.innerHTML += newBlock;
        })
    }

   async valueInput(data) {
        const category = document.querySelector('.category');
        const amount = document.querySelector('#incomeExpenseSum');
        const date = document.querySelector('#incomeExpenseDate');
        const comment = document.querySelector('#incomeExpenseTextarea');
        const saveBtn = document.querySelector('.saveBtn');
        const cancelBtn = document.querySelector('.cancelBtn');
        const operations = await CustomHttp.request(config.host + '/operations/?period=all');

       for (let el of this.type) {
           if (el.value === data.type) {
               document.getElementById(`${el.id}`).setAttribute('selected', 'selected');
           }
       }

        await this.getCategory();

       for (let el of this.type) {
           if (el.value === data.type) {
               document.getElementById(`${el.id}`).setAttribute('selected', 'selected');
           }
       }

       category.value = data.category;
       amount.value = data.amount;
       date.value = data.date;
       comment.value = data.comment;

       this.categoryId = category[category.selectedIndex].id;

       if (!this.type.value) {
           category.setAttribute('disabled', 'disabled')
       }

       category.onchange = (() => {
           this.categoryId = category[category.selectedIndex].id;
       })

       this.type.onchange = (() => {
           this.getCategory();
       })

       saveBtn.onclick = (() => {
            CustomHttp.request(config.host + '/operations/' + this.operationId, 'PUT', {
                           "type": this.type.value,
                           "amount": +amount.value,
                           "date": date.value,
                           "comment": comment.value,
                           "category_id": +this.categoryId
                       })
           location.href = '#/incomeAndExpanses'
       })
       cancelBtn.onclick = (() => {
           location.href = '#/incomeAndExpanses';
       })
    }


    toggleUser() {
        const userInfo = Auth.getUserInfo();
        const accessToken = localStorage.getItem(Auth.accessTokenKey);
        if (userInfo && accessToken) {
            this.profileElement.style.display = 'block';
            this.profileFullNameElement.innerText = userInfo.fullName;
            this.dropDownToggle()
            this.categoryToggle()
        } else {
            this.profileElement.style.display = 'none';
        }
    }

    dropDownToggle() {
        document.getElementById('profileIssue').onclick = () => {
            document.getElementById("myDropdown").classList.toggle("show")
        };
    }

    categoryToggle() {
        document.getElementById('navItemToggle').onclick = () => {
            document.getElementById("home-collapse").classList.toggle("show")
        };
    }
}
