import {CustomHttp} from "../services/custom-http.js";
import {Auth} from "../services/auth.js";
import config from "../../config/config.js";
import {EditCategoryIssues} from "./editCategoryIssues.js";
import * as events from "events";

export class ExpensesPage {
    constructor() {
        this.newCategoryExpanses();
        this.incomeExpanses();
        this.deleteModal();
    }

    newCategoryExpanses() {
        document.querySelector('.newCategoryExpansesCreat').onclick = () => {
            location.href = '#/newCategoryExpanses'
        }
    }

    editIncomePage() {
        const editBtn = document.querySelectorAll('.editExpanse');
        let expanseId = '';

        editBtn.forEach(item => {
            item.addEventListener('click', event => {
                expanseId = (event.target.parentNode.parentNode.id)

                if (expanseId) {
                    location.href = '#/editCategoryExpanses?id=' + expanseId
                }
            })
        })
    }

    async incomeExpanses() {
        const resultData = await CustomHttp.request(config.host + '/categories/expense');
        console.log(resultData)
        this.renderNewExpanse(resultData)
        this.editIncomePage()
        this.deleteModal()
    }

    renderNewExpanse(resultData) {
        const incomeBlock = document.querySelector('.cards');
        resultData.forEach(item => {
            const newBlock = `<div class="card" id="${item.id}">
                                   <div class="card-body">
                                       <h2 class="card-title mb-3">${item.title}</h2>
                                       <button type="button" class="btn btn-primary me-2 editExpanse">Редактировать</button>
                                       <button type="button" class="btn btn-danger me-5 deleteBtn">Удалить</button>
                                   </div>
                              </div>`;
            incomeBlock.innerHTML += newBlock;
        })
    }

    deleteModal() {
        const btn = document.querySelector('.modal-delete');
        const buttons = document.querySelectorAll('.deleteBtn');
        const cancelBtn = document.querySelector('.modalCancelDelete');
        const agreeBtn = document.querySelector('.agreeDelete');
        buttons.forEach(item => {
            item.addEventListener('click', event => {
                btn.style.display = 'block'
                let categoryBlockId = event.target.parentNode.parentNode.id;

                if (agreeBtn.onclick) {
                    event.target.parentNode.parentNode.remove()
                    this.deleteIssueCategory(categoryBlockId)
                }
            })
        })

        cancelBtn.onclick = () => {
            btn.style.display = "none";
        }


        agreeBtn.onclick = () => {
            btn.style.display = "none";
        }


    }

    async deleteIssueCategory(categoryBlockId) {
        await CustomHttp.request(config.host + '/categories/expense/' + categoryBlockId, 'DELETE')
    }

}