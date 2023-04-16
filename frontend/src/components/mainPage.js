import {CustomHttp} from "../services/custom-http.js";
import {Auth} from "../services/auth.js";
import config from "../../config/config.js";

export class MainPage {
    constructor() {
        this.profileElement  =  document.getElementById('profileIssue');
        this.profileFullNameElement  =  document.getElementById('profileFullName');
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

}


// const DATA_COUNT = 5;
// const NUMBER_CFG = {count: DATA_COUNT, min: 0, max: 100};
//
// document.addEventListener('DOMContentLoaded', () => { // структура документа загружена
//
//     new Chart( // инициализируем плагин
//         document.querySelector('.chart'), // первым параметром передаем элемент canvas по селектору
//         // вторым параметром передаем настройки в виде объекта
//         {
//             type: 'pie', // тип графика, в данном случае линейный
//             data: { // общие данные графика в виде объекта
//                 labels: ['Red', 'Orange', 'Yellow', 'Green', 'Blue'], // метки по оси X
//                 datasets: [ // набор данных, который будет отрисовываться в виде массива с объектами
//                     {
//                         label: 'Dataset 1',
//                         data: Utils.numbers(NUMBER_CFG),
//                         backgroundColor: Object.values(Utils.CHART_COLORS),
//                     }
//                 ]
//             },
//             options: {
//                 responsive: true,
//                 plugins: {
//                     legend: {
//                         position: 'top',
//                     },
//                     title: {
//                         display: true,
//                         text: 'Доходы'
//                     }
//                 }
//             } // дополнительные опции для графика в виде объекта, если не нужны - передаем пустой объект
//         }
//     );
//
// })