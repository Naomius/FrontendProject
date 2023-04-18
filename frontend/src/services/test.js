// import {CustomHttp} from "../services/custom-http.js";
// import {Auth} from "../services/auth.js";
// import config from "../../config/config.js";
// import Chart from "chart.js/auto";
// import {Operations} from "../services/operations.js";
//
//
// export class MainPage {
//     constructor() {
//         this.diagrams = document.getElementById('diagrams')
//         this.profileElement  =  document.getElementById('profileIssue');
//         this.profileFullNameElement  =  document.getElementById('profileFullName');
//         this.toggleUser();
//         this.showDiagram();
//         this.incomeData = [];
//         this.expenseData = [];
//
//     }
//
//
//
//
//     dropDownToggle() {
//         document.getElementById('profileIssue').onclick = () => {
//             document.getElementById("myDropdown").classList.toggle("show")
//         };
//     }
//
//     categoryToggle() {
//         document.getElementById('navItemToggle').onclick = () => {
//             document.getElementById("home-collapse").classList.toggle("show")
//         };
//     }
//
//     toggleUser() {
//         const userInfo = Auth.getUserInfo();
//         const accessToken = localStorage.getItem(Auth.accessTokenKey);
//         if (userInfo && accessToken) {
//             this.profileElement.style.display = 'block';
//             this.profileFullNameElement.innerText = userInfo.fullName;
//             this.dropDownToggle();
//             this.categoryToggle();
//         } else {
//             this.profileElement.style.display = 'none';
//         }
//     }
//
//     async showDiagram(value, dateFrom, dateTo) {
//         // await this.getData(value, dateFrom, dateTo);
//         await this.incomeDiagrams();
//     }
//
//     async getData(value, dateFrom, dateTo) {
//         const inc = [];
//         const dec = [];
//         const data = await Operations.getOperations(value, dateFrom, dateTo);
//         console.log(data)
//         const incomeData = data.filter(i => i.type === 'income').forEach(obj => {
//             const a =  inc.find(i => i.category === obj.category);
//             if (a) {
//                 let amount = a.amount + obj.amount;
//                 a.amount = amount
//             } else {
//                 inc.push({
//                     category: obj.category,
//                     amount: obj.amount
//                 })
//             }
//         });
//         const expenseData = data.filter(i => i.type === 'expense').forEach(obj => {
//             const a = dec.find(i => i.category === obj.category);
//             if (a) {
//                 let amount = a.amount + obj.amount;
//                 a.amount = amount
//             } else {
//                 dec.push({
//                     category: obj.category,
//                     amount: obj.amount
//                 })
//             }
//         });
//         this.incomeData = inc;
//         this.expenseData = dec;
//
//         this.diagrams.innerHTML = '';
//         this.diagrams.innerHTML = `
//         <canvas class="diagrams-item" id="income-diagram"></canvas>
//             <div class="verticalLine"></div>
//             <canvas class="diagrams-item" id="expense-diagram"></canvas>
//         `
//     }
//
//     async incomeDiagrams() {
//         const incomeChart = document.getElementById('income-diagram')
//         const expenseChart = document.getElementById('expense-diagram')
//         incomeChart.parentNode.style.height = '430px';
//         incomeChart.parentNode.style.width = '430px';
//         expenseChart.parentNode.style.height = '430px';
//         expenseChart.parentNode.style.width = '430px';
//         new Chart(
//             incomeChart,
//             {
//                 type: 'pie',
//                 data: {
//                     labels: this.incomeData.map(row => row.category),
//                     datasets: [
//                         {
//                             label: 'Доход в $',
//                             data: this.incomeData.map(row => row.amount)
//                         }
//                     ]
//                 },
//                 options: {
//                     plugins: {
//                         title: {
//                             display: true,
//                             text: 'Доходы',
//                             color: '#290661',
//                             font: {weight: 'bold', size: '28px'}
//                         }
//                     }
//                 }
//             }
//         );
//         new Chart(
//             expenseChart,
//             {
//                 type: 'pie',
//                 data: {
//                     labels: this.expenseData.map(row => row.category),
//                     datasets: [
//                         {
//                             label: 'Расход в $',
//                             data: this.expenseData.map(row => row.amount)
//                         }
//                     ]
//                 },
//                 options: {
//                     plugins: {
//                         title: {
//                             display: true,
//                             text: 'Расходы',
//                             color: '#290661',
//                             font: {weight: 'bold', size: '28px'}
//                         }
//                     }
//                 }
//             }
//         );
//
//
//     };
//
//
// }
//
//
