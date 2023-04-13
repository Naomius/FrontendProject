import {Auth} from "../services/auth.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class CreatIncomeExpanses {
    constructor() {
        this.cancelBtn();
        this.saveBtn();
        this.allCategoriesIncome();
        // this.allCategoriesExpenses();
    }

    cancelBtn() {
        document.querySelector('.cancelBtn').onclick = () => {
            location.href = '#/incomeAndExpanses'
        }
    }

    saveBtn() {
        const that = this;
        document.querySelector('.saveBtn').addEventListener('click', function () {
            that.creatNewIncomeExpanse();
        })
    }

    async creatNewIncomeExpanse() {
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

    // syncSelects() {
    //     const box1 = document.querySelector('#box1');
    //     box1.onchange = () => {
    //         const box2 = document.querySelector('#box2');
    //         if (box2.value === 'income') {
    //             this.renderIncome()
    //         }
    //        // box2.value = box1.value
    //     }
    // }


    //Рендерим Селект

    renderIncome(resultIncome) {
       const incomeBlock = document.querySelector('#box2');
        resultIncome.forEach(item => {
            const newBlock = `                             
                                 <option value="${item.id}" id="${item.id}">${item.title}</option>                               
                             `    ;
            incomeBlock.innerHTML += newBlock;
        })
    }

    renderExpense(resultExpense) {
        const expenseBlock = document.querySelector('#box2');
        resultExpense.forEach(item => {
            const newBlock = `                             
                                 <option value="expense" id="${item.id}">${item.title}</option>                               
                             `;
            expenseBlock.innerHTML += newBlock;
        })
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
