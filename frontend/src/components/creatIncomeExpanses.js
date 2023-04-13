import {Auth} from "../services/auth.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class CreatIncomeExpanses {
    constructor() {
        this.cancelBtn();
        this.saveBtn();
        this.syncSelects();
        this.allCategoriesIncome();
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
            that.creatNewIncomeExpanse();
        })
    }

    async creatNewIncomeExpanse() {
        const selectType = document.querySelector('#box1');
        let selectIndex = selectType.selectedIndex;
        let selectOption = selectType.options
        const selectData = selectOption[selectIndex].textContent;
        const selectCategoryId = document.querySelector('#box2').value;
        const inputSum = document.querySelector('#incomeExpenseSum').value;
        const inputDateValue = document.querySelector('#incomeExpenseDate').value;
        const textAreaData = document.querySelector('#incomeExpenseTextarea').value
        try {
            const result = await CustomHttp.request(config.host + '/operations', 'POST', {
                "type": selectData,
                "amount": inputSum,
                "date": inputDateValue,
                "comment": textAreaData,
                "category_id": this.allCategoriesIncome()
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

    syncSelects() {
        const box1 = document.querySelector('#box1');
        box1.onchange = () => {
            const box2 = document.querySelector('#box2');
           box2.value = box1.value
        }
    }

    async allCategoriesIncome() {
        const resultIncome = await CustomHttp.request(config.host + '/categories/income')
            resultIncome.forEach(item => {
              return item.id
            })
    }
    async allCategoriesExpenses() {
        const resultExpense = await CustomHttp.request(config.host + '/categories/expense')
        console.log(resultExpense)
    }
}