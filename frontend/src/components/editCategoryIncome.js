import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {UrlManager} from "../utils/url-manager.js";
import {Auth} from "../services/auth";


export class EditCategoryIncome {
    constructor() {
        this.profileElement  =  document.getElementById('profileIssue');
        this.profileFullNameElement  =  document.getElementById('profileFullName');
        this.routeParams = UrlManager.getQueryParams();
        this.cancelButton();
        this.editIssueIncome();
        this.saveButton();
        this.toggleUser();
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
            location.href = '#/issue'
        }
    }

    saveButton() {
        const that = this;
        document.querySelector('.editNewText').addEventListener('click', function () {
            that.putNewIssue();
        })
    }

   async editIssueIncome() {

       const resultData = await CustomHttp.request(config.host + '/categories/income/' + this.routeParams.id)
       console.log(resultData.title)

        const inputValue = document.querySelector('.textFromIssues').value = `${resultData.title}`;
        if (!inputValue) {
            location.href = 'javascript:void(0)';
        }

    }

    async putNewIssue() {
        const inputValue = document.querySelector('.textFromIssues').value;
        if (!inputValue) {
            location.href = 'javascript:void(0)';
        }

        try {
            const resultData = await CustomHttp.request(config.host + '/categories/income/' + this.routeParams.id, 'PUT', {
                "title": inputValue
            });
                if (resultData.error) {
                    throw new Error(resultData.error)
                }
                location.href = '#/issue'
        } catch (error) {
            console.log(error)
        }
    }



}