import {Auth} from "../services/auth.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class CreatExpensesIncome {
    constructor() {
        this.cancelBtn();
        this.saveBtn();
        this.allCategoriesExpenses();
    }

    cancelBtn() {
        document.querySelector('.cancelBtn').onclick = () => {
            location.href = '#/incomeAndExpanses'
        }
    }

    saveBtn() {
        const that = this;
        document.querySelector('.saveBtn').addEventListener('click', function () {
            that.creatNewExpanseIncome();
        })
    }

    async creatNewExpanseIncome() {
        // const selectType = document.querySelector('#box1');
        // let selectIndex = selectType.selectedIndex;
        // let selectOption = selectType.options
        // const selectData = selectOption[selectIndex].textContent;
        const optionId = document.querySelector('option')
        const boxIncome = document.querySelector('#box1').value;
        const selectCategoryId = document.querySelector('#box2').value;
        const inputSum = document.querySelector('#incomeExpenseSum').value;
        const inputDateValue = document.querySelector('#incomeExpenseDate').value;
        const textAreaData = document.querySelector('#incomeExpenseTextarea').value
        console.log(selectCategoryId)
        try {
            const result = await CustomHttp.request(config.host + '/operations', 'POST', {
                "type": boxIncome,
                "amount": inputSum,
                "date": inputDateValue,
                "comment": textAreaData,
                "category_id": +selectCategoryId
            });
            if (result) {
                if (result.error) {
                    throw new Error(result.error)
                }
                console.log(result)
                location.href = '#/incomeAndExpanses'
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
}