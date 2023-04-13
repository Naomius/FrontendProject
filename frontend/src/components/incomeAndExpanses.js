import {CustomHttp} from "../services/custom-http";
import config from "../../config/config.js";

export class IncomeAndExpanses {
    constructor() {
        this.createIncomeBtn();
        this.incomeExpenseGet();
    }

    createIncomeBtn() {
        document.querySelector('.createIncomeBtn').onclick = () => {
            location.href = '#/creatIncomeExpanses'
        }
    }

    async incomeExpenseGet() {
        const result = await CustomHttp.request(config.host + '/operations');
        console.log(result)
    }
}