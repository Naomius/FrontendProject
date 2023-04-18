import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Auth} from "../services/auth.js";

export class IncomeAndExpanses {
    constructor() {
        this.profileElement = document.getElementById('profileIssue');
        this.profileFullNameElement = document.getElementById('profileFullName');
        this.tBodyBlock = document.querySelector('.tbodyBlock');
        this.createIncomeBtn();
        this.createExpenseBtn();
        this.incomeExpenseGet();
        this.deleteModal();
        this.toggleUser();
        this.dropDownToggle();
        this.categoryToggle();
        this.activeBtns()
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

//----------Filters ---------

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
        }


        today.onclick = () => {
            check();
            today.classList.add('active');
            this.todayFilter()
        }

        week.onclick = () => {
            check();
            week.classList.add('active')
            this.weekFilter()
        }
        month.onclick = () => {
            check();
            month.classList.add('active')
            this.monthFilter()
        }

        year.onclick = () => {
            check();
            year.classList.add('active')
            this.yearFilter()
        }

        all.onclick = () => {
            check();
            all.classList.add('active')
        }

        interval.onclick = (async () => {
            check();
            interval.classList.add('active')
            this.intervalFilter()

            if (interval.classList.contains('active')) {
                dateFrom.removeAttribute('disabled');
                dateTo.removeAttribute('disabled');
            }
        });


    }

    async incomeExpenseGet() {
        const result = await CustomHttp.request(config.host + '/operations?period=all');
        this.tBodyBlock.innerHTML = '';
        console.log(result)
        this.renderIncomeExpense(result)
        this.editIncomePage();
    }

    async todayFilter() {
        const todayResult = await CustomHttp.request(config.host + '/operations')
        this.tBodyBlock.innerHTML = '';
        this.renderIncomeExpense(todayResult)
    }

    async weekFilter() {
        const result = await CustomHttp.request(config.host + '/operations?period=week')
        this.tBodyBlock.innerHTML = '';
        this.renderIncomeExpense(result)
    }

    async monthFilter() {
        const result = await CustomHttp.request(config.host + '/operations?period=month')
        this.tBodyBlock.innerHTML = '';
        this.renderIncomeExpense(result)
    }

    async yearFilter() {
        const result = await CustomHttp.request(config.host + '/operations?period=year')
        this.tBodyBlock.innerHTML = '';
        this.renderIncomeExpense(result)
    }

    async intervalFilter() {
        const dateFrom = document.getElementById('dateFrom').value;
        const dateTo = document.getElementById('dateTo').value;
        const result = await CustomHttp.request(config.host + '/operations?period=interval' + `&dateFrom=${dateFrom}&dateTo=${dateTo}`)
        this.tBodyBlock.innerHTML = '';
        this.renderIncomeExpense(result)
    }

//--------------End of Filters--------------

    renderIncomeExpense(result) {
        const trElement = document.querySelector('.tbodyBlock');
        const categoryColor = document.querySelector('.span-row1');
        result.forEach((item, index) => {
            const newBlock = `<tr class="trData" id="${item.id}">
                                  <th scope="row">${index + 1}</th>
                                  ${item.type === 'expense' ? `<td><span class="span-row1 redExpense">${item.type}</span></td>` : `<td><span class="span-row1">${item.type}</span></td>`}
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
                if (agreeBtn.onclick) {
                    event.target.parentNode.parentNode.parentNode.parentNode.remove()
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