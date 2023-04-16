import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Auth} from "../services/auth.js";

export class IncomeAndExpanses {
    constructor() {
        this.createIncomeBtn();
        this.incomeExpenseGet();
        this.createExpenseBtn();
        this.deleteModal();
        this.dateFunc()
        this.todayFilter()
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
        this.renderIncomeExpense(result)
        this.editIncomePage();

    }

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

    dateFunc() {
        const today = new Date()
        const now = today.toLocaleDateString('ru-EU');
          return now
    }

   async todayFilter() {
        const today = new Date();
        const now = today.toLocaleDateString('en-ca');

        const todayResult = await CustomHttp.request(config.host + '/operations?period=interval&dateFrom='`${now}&dateTo=${now}`)
       console.log(todayResult)
        document.querySelector('#todayFilter').addEventListener('click', )
    }

}