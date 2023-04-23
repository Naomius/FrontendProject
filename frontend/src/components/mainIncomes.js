import {CustomHttp} from "../services/custom-http.js";
import {Auth} from "../services/auth.js";
import config from "../../config/config.js";
import {EditCategoryIncome} from "./editCategoryIncome.js";

export class MainIncomes {
    constructor() {
        this.profileElement  =  document.getElementById('profileIssue');
        this.profileFullNameElement  =  document.getElementById('profileFullName');
        this.getBalance();
        this.incomeIssue();
        this.deleteModal();
        this.toggleUser();
        this.dropDownToggle();
        this.categoryToggle();
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

    toggleUser() {
        const userInfo = Auth.getUserInfo();
        const accessToken = localStorage.getItem(Auth.accessTokenKey);
        if (userInfo && accessToken) {
            this.profileElement.style.display = 'block';
            this.profileFullNameElement.innerText = userInfo.fullName;
            // this.dropDownToggle();
            // this.categoryToggle();
        } else {
            this.profileElement.style.display = 'none';
        }
    }


    editIncomePage() {
        const editBtn = document.querySelectorAll('.editIncome');
        let issueId = '';

            editBtn.forEach(item => {
                item.addEventListener('click', event => {
                   issueId = (event.target.parentNode.parentNode.id)

                    if (issueId) {
                        location.href = '#/editCategoryIncome?id=' + issueId
                    }
                })
            })
    }

    newCategoryIssues() {
        document.querySelector('.newCategoryIssuesCreat').onclick = () => {
            location.href = '#/newCategoryIssues'
        }
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
         await CustomHttp.request(config.host + '/categories/income/' + categoryBlockId, 'DELETE')
    }

    async getBalance() {
        const res = await CustomHttp.request(config.host + '/balance');
        document.querySelector('.userBalance').innerHTML = `${res.balance}`
    }

    async incomeIssue() {
        const result = await CustomHttp.request(config.host + '/categories/income');
        console.log(result)


        this.renderNewIncome(result)
        this.deleteModal()
        this.editIncomePage()
    }

    renderNewIncome(result) {
        const incomeBlock = document.querySelector('.cards');
        result.forEach(item => {
            const newBlock = ` <div class="card" id="${item.id}">
                                   <div class="card-body">
                                       <h2 class="card-title mb-3">${item.title}</h2>
                                       <button type="button" class="btn btn-primary me-2 editIncome">Редактировать</button>
                                       <button type="button" class="btn btn-danger me-5 deleteBtn">Удалить</button>
                                   </div>
                              </div>`;
            incomeBlock.innerHTML += newBlock;
        })
    }

}












