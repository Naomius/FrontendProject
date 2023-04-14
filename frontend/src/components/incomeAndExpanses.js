import {CustomHttp} from "../services/custom-http";
import config from "../../config/config.js";

export class IncomeAndExpanses {
    constructor() {
        this.createIncomeBtn();
        this.incomeExpenseGet();
        this.createExpenseBtn();
    }

    createIncomeBtn() {
        document.querySelector('.createIncomeBtn').onclick = () => {
            location.href = '#/creatIncomeExpanses'
        }
    }

    createExpenseBtn() {
        document.querySelector('.createExpenseBtn').onclick = () => {
            location.href = '#/creatExpensesIncome'
        }
    }

    async incomeExpenseGet() {
        const result = await CustomHttp.request(config.host + '/operations?period=all');
        console.log(result)
    }
}