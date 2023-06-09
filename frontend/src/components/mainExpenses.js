import {CustomHttp} from "../services/custom-http.js";
import {Auth} from "../services/auth.js";
import config from "../../config/config.js";
import {EditCategoryIncome} from "./editCategoryIncome.js";
import * as events from "events";

export class MainExpenses {
    constructor() {
        this.profileElement  =  document.getElementById('profileIssue');
        this.profileFullNameElement  =  document.getElementById('profileFullName');
        this.newCategoryExpanses();
        this.incomeExpanses();
        this.deleteModal();
        this.toggleUser();
        this.dropDownToggle();
        this.categoryToggle();
    }

    toggleUser() {
        const userInfo = Auth.getUserInfo();
        const accessToken = localStorage.getItem(Auth.accessTokenKey);
        if (userInfo && accessToken) {
            this.profileElement.style.display = 'block';
            this.profileFullNameElement.innerText = userInfo.fullName;
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

                agreeBtn.onclick = (() =>  {
                    event.target.parentNode.parentNode.remove()
                    btn.style.display = "none"
                    this.deleteIssueCategory(categoryBlockId)
                })
            })
        })

        cancelBtn.onclick = () => {
            btn.style.display = "none";
        }
    }

    async deleteIssueCategory(categoryBlockId) {
        await CustomHttp.request(config.host + '/categories/expense/' + categoryBlockId, 'DELETE')
    }

}