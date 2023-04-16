import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {UrlManager} from "../utils/url-manager.js";

export class EditIncomeExpanses {
    constructor() {
        this.profileElement  =  document.getElementById('profileIssue');
        this.profileFullNameElement  =  document.getElementById('profileFullName');
        this.routeParams = UrlManager.getQueryParams();
        this.cancelBtn();
        this.saveBtn();
        this.editExpenseIncome();
        this.allCategoriesExpenses();

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
        const inputSum = document.querySelector('#incomeExpenseSum').value = `${resultData.amount}`;
        const inputDate = document.querySelector('#incomeExpenseDate').value = `${resultData.date}`;
        const inputComments = document.querySelector('#incomeExpenseTextarea').value = `${resultData.comment}`

        if (!inputType && !inputCategory && !inputSum && !inputDate) {
            location.href = 'javascript:void(0)';
        }

        this.allCategoriesExpenses(resultData)

    }

    async putNewExpensesOrIncomes() {
        const inputType = document.querySelector('#box1').value;
        // const inputCategory = document.querySelector('#box2').value;
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

    async allCategoriesExpenses(resultData) {
        const resultExpense = await CustomHttp.request(config.host + '/categories/expense')
        console.log(resultExpense)
        console.log(resultData)
        const box1 = document.querySelector('#box1').value;
        const box2 = document.querySelector('#box2').value;

            if (box2 === resultData.category) {
                console.log(resultExpense.id)
            }
            // if (box1.value === 'expense') {
            //     this.renderExpense(resultExpense)
            // }

    }

    // renderExpense(resultExpense) {
    //     const expenseBlock = document.querySelector('#box2');
    //     resultExpense.forEach(item => {
    //         const newBlock = `
    //                              <input type="text" class="form-control" id="${item.id}" disabled>
    //                          `;
    //         expenseBlock.innerHTML += newBlock;
    //     })
    // }

}