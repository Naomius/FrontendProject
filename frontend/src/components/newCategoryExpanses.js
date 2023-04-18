import {Auth} from "../services/auth.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class NewCategoryExpanses {
    constructor() {
        this.profileElement  =  document.getElementById('profileIssue');
        this.profileFullNameElement  =  document.getElementById('profileFullName');
        this.cancelExpButton();
        this.btnNewExpanse();
        this.dropDownToggle();
        this.categoryToggle();
        this.toggleUser();
    }



    btnNewExpanse() {
        const that = this;
        document.querySelector('.newExpansesBtn').addEventListener('click', function () {
            that.creatNewCategory()
        })
    }

    cancelExpButton() {
        document.querySelector('.cancelExpBtn').onclick = () => {
            location.href = '#/mainExpenses'
        }
    }

   async creatNewCategory() {
        const newTitle = document.querySelector('.newCategoryInputData').value;

            if (!newTitle) {
                location.href = 'javascript:void(0)'
            }

            try {
                const resultData = await CustomHttp.request(config.host + '/categories/expense', 'POST', {
                    "title" : newTitle
                });
                if (resultData) {
                    if (resultData.error) {
                        throw new Error(resultData.error)
                    }
                    console.log(resultData)
                    location.href = '#/mainExpenses'
                }
            } catch (error) {
                console.log(error)
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

    toggleUser() {
        const userInfo = Auth.getUserInfo();
        const accessToken = localStorage.getItem(Auth.accessTokenKey);
        if (userInfo && accessToken) {
            this.profileElement.style.display = 'block';
            this.profileFullNameElement.innerText = userInfo.fullName;
            // this.dropDownToggle();
            // this.categoryToggle();
        } else {
            this.profileElement.style.display = 'none';
        }
    }
}