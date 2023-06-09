import {UrlManager} from "../utils/url-manager.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Auth} from "../services/auth";

export class EditCategoryExpanses {
    constructor() {
        this.profileElement  =  document.getElementById('profileIssue');
        this.profileFullNameElement  =  document.getElementById('profileFullName');
        this.routeParams = UrlManager.getQueryParams();
        this.cancelButton();
        this.saveButton();
        this.editExpense();
        this.toggleUser();
        this.dropDownToggle();
        this.categoryToggle();
    }

    toggleUser() {
        const userInfo = Auth.getUserInfo();
        const accessToken = localStorage.getItem(Auth.accessTokenKey);
        if (userInfo && accessToken) {
            this.profileElement.style.display = 'block';
            this.profileFullNameElement.innerText = userInfo.fullName;
        } else {
            this.profileElement.style.display = 'none';
        }
    }

    cancelButton() {
        document.querySelector('.cancelBtn').onclick = () => {
            location.href = '#/expensesPage'
        }
    }

    saveButton() {
        const that = this;
        document.querySelector('.editNewText').addEventListener('click', function () {
            that.putNewExpenses();
        })
    }

    async editExpense() {
        const resultData = await CustomHttp.request(config.host + '/categories/expense/' + this.routeParams.id)

        const inputValue = document.querySelector('.textFromExpanses').value = `${resultData.title}`;
            if (!inputValue) {
                location.href = 'javascript:void(0)';
            }
    }

    async putNewExpenses() {
        const inputValue = document.querySelector('.textFromExpanses').value;
        if (!inputValue) {
            location.href = 'javascript:void(0)';
        }

        try {
            const resultData = await CustomHttp.request(config.host + '/categories/expense/' + this.routeParams.id, 'PUT', {
                "title": inputValue
            })
            if (resultData.error) {
                throw new Error(resultData.error)
            }
            location.href = '#/mainExpenses'
        } catch (error) {

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