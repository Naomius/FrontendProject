import {Auth} from "../services/auth.js";


export class Common {
    constructor() {
        this.profileElement  =  document.getElementById('profileIssue');
        this.profileFullNameElement  =  document.getElementById('profileFullName');
    }

    toggleUser() {
        const userInfo = Auth.getUserInfo();
        const accessToken = localStorage.getItem(Auth.accessTokenKey);
        if (userInfo && accessToken) {
            this.profileElement.style.display = 'block';
            this.profileFullNameElement.innerText = userInfo.fullName;
            document.getElementById('profileIssue').onclick = () => {
                document.getElementById("myDropdown").classList.toggle("show")
            }
            document.getElementById('navItemToggle').onclick = () => {
                document.getElementById("home-collapse").classList.toggle("show")
            };
        } else {
            this.profileElement.style.display = 'none';
        }
    }
}