import {Register} from "./components/register.js";
import {Issue} from "./components/issue.js";
import {Auth} from "./services/auth.js";
import {EditCategoryIssues} from "./components/editCategoryIssues.js";
import {NewCategoryIssues} from "./components/newCategoryIssues.js";
import {ExpensesPage} from "./components/expensesPage.js"
import {CustomHttp} from "./services/custom-http.js";
import config from "../config/config.js";
import {NewCategoryExpanses} from "./components/newCategoryExpanses";
import {EditCategoryExpanses} from "./components/editCategoryExpanses";
import {IncomeAndExpanses} from "./components/incomeAndExpanses";
import {CreatIncomeExpanses} from "./components/creatIncomeExpanses";

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
                // scripts: 'src/components/index.js',
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
                route: '#/issue',
                title: 'Доходы',
                template: 'templates/issue.html',
                styles: 'styles/issue.css',
                scripts: 'src/components/issue.js',
                load: () => {
                    new Issue();
                }
            },
            {
                route: '#/editCategoryIssues',
                title: 'Редактирование доходов',
                template: 'templates/editCategoryIssues.html',
                styles: 'styles/editCategoryIssues.css',
                scripts: 'src/components/editCategoryIssues.js',
                load: () => {
                    new EditCategoryIssues();
                }
            },
            {
                route: '#/newCategoryIssues',
                title: 'Создание новых доходов',
                template: 'templates/newCategoryIssues.html',
                styles: 'styles/newCategoryIssues.css',
                scripts: 'src/components/newCategoryIssues.js',
                load: () => {
                    new NewCategoryIssues();
                }
            },
            {
                route: '#/expensesPage',
                title: 'Расходы',
                template: 'templates/expensesPage.html',
                styles: 'styles/expensesPage.css',
                scripts: 'src/components/expensesPage.js',
                load: () => {
                    new ExpensesPage();
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
            this.profileElement.style.display = 'block';
            this.profileFullNameElement.innerText = userInfo.fullName;
            this.dropDownToggle();
            this.categoryToggle();
            this.getBalance();
        } else {
            this.profileElement.style.display = 'none';
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
        document.querySelector('.userBalance').innerHTML = `${res.balance}`
    }
}