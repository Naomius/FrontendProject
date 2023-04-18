import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {UrlManager} from "../utils/url-manager.js";
import {Auth} from "../services/auth";

export class EditIncomeExpanses {
    constructor() {
        this.profileElement  =  document.getElementById('profileIssue');
        this.profileFullNameElement  =  document.getElementById('profileFullName');
        this.routeParams = UrlManager.getQueryParams();
        this.cancelBtn();
        this.saveBtn();
        this.editExpenseIncome();
        this.allCategoriesExpenses();
        this.allCategoriesIncome()
        this.toggleUser();
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

    cancelBtn() {
        document.querySelector('.cancelBtn').onclick = () => {
            location.href = '#/incomeAndExpanses'
        }
    }

    saveBtn() {
        const that = this;
        document.querySelector('.saveBtn').onclick = () => {
            that.putNewExpensesOrIncomes();
        }
    }


    async editExpenseIncome() {
        const resultData = await CustomHttp.request(config.host + '/operations/' + this.routeParams.id)
        console.log(resultData)

        const inputType = document.querySelector('#box1').value = `${resultData.type}`;
        const inputCategory = document.querySelector('#box2').value = `${resultData.category}`;
        console.log(inputCategory)
        const inputSum = document.querySelector('#incomeExpenseSum').value = `${resultData.amount}`;
        const inputDate = document.querySelector('#incomeExpenseDate').value = `${resultData.date}`;
        const inputComments = document.querySelector('#incomeExpenseTextarea').value = `${resultData.comment}`

        if (!inputType && !inputCategory && !inputSum && !inputDate) {
            location.href = 'javascript:void(0)';
        }

        this.allCategoriesExpenses(resultData)
        this.allCategoriesIncome(resultData)

    }

    async putNewExpensesOrIncomes() {
        const inputType = document.querySelector('#box1').value;
        const inputCategory = document.querySelector('#box2').value;
        const inputSum = document.querySelector('#incomeExpenseSum').value;
        const inputDate = document.querySelector('#incomeExpenseDate').value;
        const inputComments = document.querySelector('#incomeExpenseTextarea').value;

        if (!inputType && !inputSum && !inputDate) {
                location.href = 'javascript:void(0)';
            }

        try {
            const resultData = await CustomHttp.request(config.host + '/operations/' + this.routeParams.id, 'PUT', {
                "type": inputType,
                "amount": +inputSum,
                "date": inputDate,
                "comment": inputComments,
                "category_id": this.routeParams.id
            })
            console.log(this.routeParams.id)
            if (resultData) {
                if (resultData.error) {
                    throw new Error(resultData.error)
                }
                // console.log(resultData)
                // location.href = '#/incomeAndExpanses'
            }
        } catch (error) {
            console.log(error)
        }

    }

    renderExpense(resultExpense) {
        const expenseBlock = document.querySelector('#box2');
        resultExpense.forEach(item => {
            const newBlock = `                             
                                 <option value="${item.id}" id="${item.id}">${item.title}</option>                               
                             `;
            expenseBlock.innerHTML += newBlock;
        })
    }

    async allCategoriesExpenses() {
        const resultExpense = await CustomHttp.request(config.host + '/categories/expense')
        console.log(resultExpense)
        const box1 = document.querySelector('#box1');
        box1.onchange = () => {
            if (box1.value === 'expense') {
                this.renderExpense(resultExpense)
            }
        }

    }


    async allCategoriesIncome() {
        const resultIncome = await CustomHttp.request(config.host + '/categories/income')
        console.log(resultIncome)
        const box1 = document.querySelector('#box1');
        box1.onchange = () => {
            if (box1.value === 'income') {
                this.renderIncome(resultIncome)
            }
        }
    }

    renderIncome(resultIncome) {
        const incomeBlock = document.querySelector('#box2');
        resultIncome.forEach(item => {
            const newBlock = `                             
                                 <option value="${item.id}" id="${item.id}">${item.title}</option>                               
                             `    ;
            incomeBlock.innerHTML += newBlock;
        })
    }

}
