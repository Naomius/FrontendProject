import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Auth} from "../services/auth.js";
import {Operations} from "../services/operations.js";

export class IncomeAndExpanses {
    constructor() {
        this.profileElement = document.getElementById('profileIssue');
        this.profileFullNameElement = document.getElementById('profileFullName');
        this.tBodyBlock = document.querySelector('.tbodyBlock');
        this.creatIncomesExpenses();
        // this.incomeExpenseGet();
        this.deleteModal();
        this.toggleUser();
        this.dropDownToggle();
        this.categoryToggle();
        // this.todayFilter()
        this.activeBtns();
        this.editIncomePage()
        this.filterOperations = [];
        this.init('today');
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

    creatIncomesExpenses() {
      const creatIncomeBtn = document.querySelector('.createIncomeBtn');
      const creatExpenseBtn = document.querySelector('.createExpenseBtn');

        creatIncomeBtn.onclick = (() => { location.href = '#/creatIncomeExpanses'})
        creatExpenseBtn.onclick = (() => { location.href = '#/creatIncomeExpanses'})
    }

//----------Filters ---------

    async init(value, dateFrom, dateTo) {
        this.filterOperations = await Operations.getOperations(value, dateFrom, dateTo);
        this.tBodyBlock.innerHTML = '';
        this.renderIncomeExpense(this.filterOperations);
        this.editIncomePage();
    }

    activeBtns() {
        const today = document.getElementById('today');
        const week = document.getElementById('week');
        const month = document.getElementById('month');
        const year = document.getElementById('year');
        const all = document.getElementById('all');
        const interval = document.getElementById('interval');
        const dateFrom = document.getElementById('dateFrom');
        const dateTo = document.getElementById('dateTo');
        const itemTabs = document.getElementsByClassName('item-tabs');

        function check() {
            [].forEach.call(itemTabs, function (el) {
                el.classList.remove('active')
            });
            if (!interval.classList.contains('active')) {
                dateFrom.setAttribute('disabled', 'disabled');
                dateTo.setAttribute('disabled', 'disabled');
            }
        }


        today.onclick = (async () => {
            check();
            today.classList.add('active');
            await this.init('today');
        })

        week.onclick =(async () => {
            check();
            week.classList.add('active')
            await this.init('week');
        })
        month.onclick = (async () => {
            check();
            month.classList.add('active')
            await this.init('month');
        })

        year.onclick = (async () => {
            check();
            year.classList.add('active')
            await this.init('year');
        })

        all.onclick = (async () => {
            check();
            all.classList.add('active')
            await this.init('all');
        })

        interval.onclick = (async () => {
            check();
            interval.classList.add('active')
            await this.init('interval');

            if (interval.classList.contains('active')) {
                dateFrom.removeAttribute('disabled');
                dateTo.removeAttribute('disabled');
            }

            dateFrom.onchange = (() => {
                if (dateFrom.value && dateTo.value) {
                    this.init('interval', dateFrom.value, dateTo.value);
                }
            })
            dateTo.onchange = (() => {
                if (dateFrom.value && dateTo.value) {
                    this.init('interval', dateFrom.value, dateTo.value);
                }
            })

        });


    }


//--------------End of Filters--------------

    renderIncomeExpense(result) {
        const trElement = document.querySelector('.tbodyBlock');
        const categoryColor = document.querySelector('.span-row1');
        result.forEach((item, index) => {

            if (item.type === 'income') {
                item.type = 'доход';
            } else {item.type = 'расход'}

            const newBlock = `<tr class="trData" id="${item.id}">
                                  <th scope="row">${index + 1}</th>
                                  ${item.type === 'расход' ? `<td><span class="span-row1 redExpense">${item.type}</span></td>` : `<td><span class="span-row1">${item.type}</span></td>`}
                                  <td>${item.category}</td>
                                  <td>$${item.amount}</td>
                                  <td>${item.date}</td>
                                  <td>${item.comment}</td>
                                  <td>
                                    <div>
                                    <a class="buttonDel">
                                        <img src="/images/trashPng.png" alt="trash">
                                    </a>
                                    <a class="buttonEdit">
                                      <img src="/images/pencilPng.png" alt="pencil">
                                    </a>
                                    </div>
                                  </td>
                              </tr>
                              `;
            trElement.innerHTML += newBlock
        })
        this.deleteModal()
    }

    async deleteIssueCategory(categoryBlockId) {
        await CustomHttp.request(config.host + '/operations/' + categoryBlockId, 'DELETE')
    }

    deleteModal() {
        const btn = document.querySelector('.modal-delete');
        const buttons = document.querySelectorAll('.buttonDel');
        const cancelBtn = document.querySelector('.modalCancelDelete');
        const agreeBtn = document.querySelector('.agreeDelete');
        buttons.forEach(item => {
            item.addEventListener('click', event => {
                btn.style.display = 'block'
                let categoryBlockId = event.target.parentNode.parentNode.parentNode.parentNode.id;
                console.log(categoryBlockId)
                agreeBtn.onclick = (() => {
                    event.target.parentNode.parentNode.parentNode.parentNode.remove()
                    btn.style.display = "none"
                    this.deleteIssueCategory(categoryBlockId)
                })
            })
        })
        cancelBtn.onclick = () => {
            btn.style.display = "none";
        }
    }

    editIncomePage() {
        const editBtn = document.querySelectorAll('.buttonEdit');
        let issueId = '';

        editBtn.forEach(item => {
            item.addEventListener('click', event => {
                issueId = (event.target.parentNode.parentNode.parentNode.parentNode.id)
                if (issueId) {
                    location.href = '#/editIncomeExpanses?id=' + issueId
                }
            })
        })
    }



}