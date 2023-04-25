import {Auth} from "../services/auth.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Operations} from "../services/operations.js";
import {UrlManager} from "../utils/url-manager.js";
import {log10} from "chart.js/helpers";



export class CreatIncomeExpanses {
    constructor() {
        this.profileElement  =  document.getElementById('profileIssue');
        this.profileFullNameElement  =  document.getElementById('profileFullName');
        this.routeParams = UrlManager.getQueryParams();
        this.type = document.getElementById(`type`);
        this.operationId = localStorage.getItem('operationId');
        this.categoryId = null;
        this.category = [];
        this.init();
        this.toggleUser();
        this.routeParamsInput()
    }


    routeParamsInput() {
        if (this.routeParams.type === 'income') {
            this.type.value = 'income'
            this.getCategory()
        } else if (this.routeParams.type === 'expense') {
            this.type.value = 'expense'
            this.getCategory()
        }
    }

    async init() {
        await this.creatValueInput();
    }

    async getCategory() {
        if (this.type.value === 'expense') {
            const categoryExp = await CustomHttp.request(config.host + '/categories/expense');
            this.category = categoryExp;
        } else if (this.type.value === 'income') {
            const categoryInc = await CustomHttp.request(config.host + '/categories/income')
            this.category = categoryInc;
        }

        const category = document.getElementById('category');
        category.innerHTML = `<option value="" disabled selected hidden>Категория...</option>`;

        this.category.forEach(item => {
            const newOption = `<option value="${item.title}" id="${item.id}">${item.title}</option>`
            category.innerHTML += newOption
        })

    }

    async creatValueInput() {
        const category = document.getElementById('category');
        const amount = document.getElementById('incomeExpenseSum');
        const date = document.querySelector('#incomeExpenseDate');
        const comment = document.querySelector('#incomeExpenseTextarea');
        const operations = await CustomHttp.request(config.host + '/operations/?period=all');
        const creatButton = document.querySelector('.saveBtn');
        const cancelButton = document.querySelector('.cancelBtn');
        const inputErrorCreat = document.getElementById('input-server-error')


        this.type.onchange = (async () => {
            category.removeAttribute('disables');
            await this.getCategory();
        })

        category.onchange = (() => {
            this.categoryId = category[category.selectedIndex].id;
        })

        creatButton.onclick = (() => {

            if (!date.value || !amount.value || !category.value || ! +this.categoryId || !comment.value) {
                inputErrorCreat.style.display = 'block'
            } else {
                const result =  CustomHttp.request(config.host + '/operations', 'POST', {
                            "type": this.type.value,
                            "amount": amount.value,
                            "date": date.value,
                            "comment": comment.value,
                            "category_id": +this.categoryId
                        });
                if (result) {
                    inputErrorCreat.style.display = 'none';
                    location.href = '#/incomeAndExpanses'
                }
            }
                // try {
                //     const result =  CustomHttp.request(config.host + '/operations', 'POST', {
                //         "type": this.type.value,
                //         "amount": amount.value,
                //         "date": date.value,
                //         "comment": comment.value,
                //         "category_id": +this.categoryId
                //     });
                //     if (result) {
                //         if (result.error) {
                //             throw new Error(result.error)
                //         }
                //         inputErrorCreat.style.display = 'block'
                //         // location.href = '#/incomeAndExpanses'
                //     }
                // }
                // catch (error) {
                //     console.log(error)
                // }

        });
        cancelButton.onclick = (() => {
            location.href = '#/incomeAndExpanses'
        })
    }


    toggleUser() {
        const userInfo = Auth.getUserInfo();
        const accessToken = localStorage.getItem(Auth.accessTokenKey);
        if (userInfo && accessToken) {
            this.profileElement.style.display = 'block';
            this.profileFullNameElement.innerText = userInfo.fullName;
            document.getElementById('profileIssue').onclick = () => {
                document.getElementById("myDropdown").classList.toggle("show")
            }
            document.getElementById('navItemToggle').onclick = () => {
                document.getElementById("home-collapse").classList.toggle("show")
            };
        } else {
            this.profileElement.style.display = 'none';

        }
    }
}
