import {Auth} from "../services/auth.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class NewCategoryExpanses {
    constructor() {
        this.profileElement  =  document.getElementById('profileIssue');
        this.profileFullNameElement  =  document.getElementById('profileFullName');
        this.cancelExpButton();
        this.btnNewExpanse();
    }

    btnNewExpanse() {
        const that = this;
        document.querySelector('.newExpansesBtn').addEventListener('click', function () {
            that.creatNewCategory()
        })
    }

    cancelExpButton() {
        document.querySelector('.cancelExpBtn').onclick = () => {
            location.href = '#/expensesPage'
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
                    location.href = '#/expensesPage'
                }
            } catch (error) {
                console.log(error)
            }
    }
}