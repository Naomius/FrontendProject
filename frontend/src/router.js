import {Register} from "./components/register.js";
import {MainIncomes} from "./components/mainIncomes.js";
import {Auth} from "./services/auth.js";
import {EditCategoryIncome} from "./components/editCategoryIncome.js";
import {NewCategoryIncome} from "./components/newCategoryIncome.js";
import {MainExpenses} from "./components/mainExpenses.js"
import {CustomHttp} from "./services/custom-http.js";
import config from "../config/config.js";
import {NewCategoryExpanses} from "./components/newCategoryExpanses.js";
import {EditCategoryExpanses} from "./components/editCategoryExpanses.js";
import {IncomeAndExpanses} from "./components/incomeAndExpanses.js";
import {CreatIncomeExpanses} from "./components/creatIncomeExpanses.js";
import {CreatExpensesIncome} from "./components/creatExpensesIncome.js";
import {EditIncomeExpanses} from "./components/editIncomeExpanses.js";
import {MainPage} from "./components/mainPage.js";

export class Router {
    constructor() {
        this.contentElement  =  document.getElementById('content');
        this.stylesElement  =  document.getElementById('styles');
        this.titleElement  =  document.getElementById('title');
        this.profileElement  =  document.getElementById('profileIssue');
        this.profileFullNameElement  =  document.getElementById('profileFullName');

        this.routes = [
            {
                route: '#/',
                title: 'Логин',
                template: 'templates/index.html',
                styles: 'styles/login.css',
                load: () => {
                    new Register('index')
                }
            },
            {
                route: '#/register',
                title: 'Регистрация',
                template: 'templates/register.html',
                styles: 'styles/register.css',
                scripts: 'src/components/index.js',
                load: () => {
                    new Register('register');
                }
            },
            {
                route: '#/mainIncomes',
                title: 'Доходы',
                template: 'templates/mainIncomes.html',
                styles: 'styles/mainIncomes.css',
                scripts: 'src/components/mainIncomes.js',
                load: () => {
                    new MainIncomes();
                }
            },
            {
                route: '#/editCategoryIncome',
                title: 'Редактирование доходов',
                template: 'templates/editCategoryIncome.html',
                styles: 'styles/editCategoryIncome.css',
                scripts: 'src/components/editCategoryIncome.js',
                load: () => {
                    new EditCategoryIncome();
                }
            },
            {
                route: '#/newCategoryIncome',
                title: 'Создание новых доходов',
                template: 'templates/newCategoryIncome.html',
                styles: 'styles/newCategoryIncome.css',
                scripts: 'src/components/newCategoryIncome.js',
                load: () => {
                    new NewCategoryIncome();
                }
            },
            {
                route: '#/mainExpenses',
                title: 'Расходы',
                template: 'templates/mainExpenses.html',
                styles: 'styles/mainExpenses.css',
                scripts: 'src/components/mainExpenses.js',
                load: () => {
                    new MainExpenses();
                }
            },
            {
                route: '#/newCategoryExpanses',
                title: 'Создание новых расходов',
                template: 'templates/newCategoryExpanses.html',
                styles: 'styles/newCategoryExpanses.css',
                scripts: 'src/components/newCategoryExpanses.js',
                load: () => {
                    new NewCategoryExpanses();
                }
            },
            {
                route: '#/editCategoryExpanses',
                title: 'Редактирование расходов',
                template: 'templates/editCategoryExpanses.html',
                styles: 'styles/editCategoryExpanses.css',
                scripts: 'src/components/editCategoryExpanses.js',
                load: () => {
                    new EditCategoryExpanses();
                }
            },
            {
                route: '#/incomeAndExpanses',
                title: 'Страница Доходов и Расходов',
                template: 'templates/incomeAndExpanses.html',
                styles: 'styles/incomeAndExpanses.css',
                scripts: 'src/components/incomeAndExpanses.js',
                load: () => {
                    new IncomeAndExpanses();
                }
            },
            {
                route: '#/creatIncomeExpanses',
                title: 'Создание Доходов и Расходов',
                template: 'templates/creatIncomeExpanses.html',
                styles: 'styles/creatIncomeExpanses.css',
                scripts: 'src/components/creatIncomeExpanses.js',
                load: () => {
                    new CreatIncomeExpanses();
                }
            },
            {
                route: '#/creatExpensesIncome',
                title: 'Создание Расходов и Доходов',
                template: 'templates/creatExpensesIncome.html',
                styles: 'styles/creatExpensesIncome.css',
                scripts: 'src/components/creatExpensesIncome.js',
                load: () => {
                    new CreatExpensesIncome();
                }
            },
            {
                route: '#/editIncomeExpanses',
                title: 'Редактирование Расходов и Доходов',
                template: 'templates/editIncomeExpanses.html',
                styles: 'styles/editIncomeExpanses.css',
                scripts: 'src/components/editIncomeExpanses.js',
                load: () => {
                    new EditIncomeExpanses();
                }
            },
            {
                route: '#/mainPage',
                title: 'Главная страница',
                template: 'templates/mainPage.html',
                styles: 'styles/mainPage.css',
                scripts: 'src/components/mainPage.js',
                load: () => {
                    new MainPage();
                }
            },
        ]
    }

   async openRoute() {
        const urlRoute = window.location.hash.split('?')[0];
        if (urlRoute === '#/logout') {
            await Auth.logout();
            window.location.href = '#/';
            return;
        }

        const newRoute = this.routes.find(item => {
            return item.route === urlRoute;
        });

        if (!newRoute) {
            window.location.href = '#/';
            return;
        }


       this.contentElement.innerHTML =
            await fetch(newRoute.template).then(response => response.text());
       this.stylesElement.setAttribute('href', newRoute.styles);
       this.titleElement.innerText = newRoute.title;

        const userInfo = Auth.getUserInfo();
        const accessToken = localStorage.getItem(Auth.accessTokenKey);
        if (userInfo && accessToken) {
            this.getBalance();
        } else {
            // this.profileElement.style.display = 'none';
        }

       if (urlRoute !== '#/') {
           if (urlRoute !== '#/register') {
               if (urlRoute === '#/register') {
                   return
               }
               if (!accessToken) {
                   window.location.href = '#/';
                   return;
               }
           }
       }


        newRoute.load()
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



    async getBalance() {
        const res = await CustomHttp.request(config.host + '/balance');
        console.log(res)
        document.querySelector('.userBalance').innerHTML = `${res.balance}$`
    }
}