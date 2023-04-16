import {Auth} from "../services/auth.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class NewCategoryIssues {
    constructor() {
        this.profileElement  =  document.getElementById('profileIssue');
        this.profileFullNameElement  =  document.getElementById('profileFullName');
        this.cancelButton();
        this.btnNewIssues();
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

    btnNewIssues() {
        const that = this;
        document.querySelector('.newIssueBtn').addEventListener('click', function () {
            that.creatNewCategory()
        })
    }

    cancelButton() {
        document.querySelector('.cancelBtn').onclick = () => {
            location.href = '#/issue'
        }
    }

    async creatNewCategory() {
        const newTitle = document.querySelector('.newCategoryInputData').value;
        if (!newTitle) {
            location.href = 'javascript:void(0)'
        }

        try {
            const res = await CustomHttp.request(config.host + '/categories/income', 'POST', {
                "title": newTitle
            });
            if (res) {
                if (res.error) {
                    throw new Error(res.error)
                }
                console.log(res)
                location.href = '#/issue'
            }
        } catch (error) {
            console.log(error)
        }

    }



    // async creatNewCategory() {
    //     let xToken = localStorage.getItem(Auth.accessTokenKey);
    //     const newTitle = document.querySelector('.newCategoryInputData').value;
    //
    //     const requestHeaders = new Headers();
    //     requestHeaders.append('x-auth-token', xToken)
    //
    //     const formData = new FormData();
    //     formData.append("title", newTitle)
    //
    //
    //     const res = await fetch(this.API_URL, {
    //         method: 'POST',
    //         headers: requestHeaders,
    //         body: formData
    //     });
    //
    //     const result = await res.json();
    //     console.log(result)
    // }
}