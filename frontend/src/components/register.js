import {CustomHttp} from "../services/custom-http.js";
import { Auth } from "../services/auth.js";
import config from "../../config/config.js";


export class Register {

    constructor(page) {
        this.processElement = null;
        this.page = page;
        this.activePlaceholder()
        this.pass = document.getElementById('password');

        const accessToken = localStorage.getItem(Auth.accessTokenKey);
        if (accessToken) {
            location.href = '#/mainIncomes'
            return;
        }

        this.fields = [

            {
                name: 'email',
                id: 'email',
                element: null,
                regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                valid: false,
            },
            {
                name: 'password',
                id: 'password',
                element: null,
                regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                valid: false,
            },

        ];

        if (this.page === 'register') {
            this.fields.unshift({
                name: 'fullName',
                id: 'fullName',
                element: null,
                regex: /^[А-Я]+\s[а-я]+$/i,
                valid: false,
            },
                {
                    name: 'passwordRepeat',
                    id: 'passwordRepeat',
                    element: null,
                    regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                    valid: false,
                });
        }

        const that = this;
        this.fields.forEach(item => {
            item.element = document.getElementById(item.id);
            item.element.oninput = function () {
                that.validateField.call(that, item, this)
            }
        });

        this.processElement = document.getElementById('process');
        this.processElement.onclick = function () {
            that.processForm();
        }

    }

    validateField(field, element) {

        if (!element.value || !element.value.match(field.regex)) {
            element.style.borderColor = 'red';
            field.valid = false;
            this.textValidation(field);
        } else if (element.id === 'passwordRepeat' && element.value !== this.pass.value) {
            field.valid = false
        } else {
            element.removeAttribute('style');
            field.valid = true;
            this.textValidationRemove(field);

        }
        this.validateForm()
    }

    textValidation(field) {
       const textBlockEmail = document.querySelector('.validationText');
       const textBlockPassword = document.querySelector('.passwordValidText');
       const fullNameTextBlockPassword = document.querySelector('.fullnameValidText');
       const repeatPassTextBlockPassword = document.querySelector('.repeatPasswordValidText');

       if (field.name === 'email') {textBlockEmail.style.display = 'block'}
       if (field.name === 'password') {textBlockPassword.style.display = 'block'}
       if (field.name === 'fullName') {fullNameTextBlockPassword.style.display = 'block'}
       if (field.name === 'passwordRepeat') {repeatPassTextBlockPassword.style.display = 'block'}
    }
    textValidationRemove(field) {
       const textBlockEmail = document.querySelector('.validationText');
       const textBlockPassword = document.querySelector('.passwordValidText');
       const fullNameTextBlockPassword = document.querySelector('.fullnameValidText');
       const repeatPassTextBlockPassword = document.querySelector('.repeatPasswordValidText');

        if (field.name === 'email') {textBlockEmail.style.display = 'none'}
        if (field.name === 'password') {textBlockPassword.style.display = 'none'}
        if (field.name === 'fullName') {fullNameTextBlockPassword.style.display = 'none'}
        if (field.name === 'passwordRepeat') {repeatPassTextBlockPassword.style.display = 'none'}
    }

    validateForm() {
        const validForm = this.fields.every(item => item.valid);
        if (validForm) {
            this.processElement.removeAttribute('disabled')
        }
            return validForm;
    }

    validElement() {
        document.querySelector('.notValidTextBack').style.display = 'block'
    }

   async processForm() {
        if(this.validateForm()) {
            const email = this.fields.find(item => item.name === 'email').element.value;
            const password = this.fields.find(item => item.name === 'password').element.value;


            if (this.page === 'register') {
                try {
                  const result = await CustomHttp.request(config.host + '/signup', "POST", {
                        fullName: this.fields.find(item => item.name === 'fullName').element.value,
                        email: email,
                        password: password,
                        passwordRepeat: this.fields.find(item => item.name === 'passwordRepeat').element.value,
                    })
                    if (result) {
                        if (!result.user) {
                            throw new Error(result.message)
                        }
                    }
                } catch (error) {
                  return console.log(error);
                }
            }


                try {
                    const result = await CustomHttp.request(config.host + '/login', "POST", {
                        email: email,
                        password: password,
                    })

                    if (result) {
                        if (!result.user || !result.tokens.accessToken || !result.tokens.refreshToken || !result.user.fullName || !result.user.id) {
                            throw new Error(result.message)
                        }

                        Auth.setTokens(result.tokens.accessToken, result.tokens.refreshToken);
                        Auth.setUserInfo({
                            fullName: result.user.fullName,
                            userId: result.user.id
                        })

                        if (!result.error) {
                            location.href = '#/mainIncomes'
                            location.reload();
                        }

                    }
                } catch (error) {
                    this.validElement()
                    console.log(error);
                }

        }
    }

    activePlaceholder() {
        const inputEmail = document.querySelector('#email');
        const inputFullName = document.querySelector('#fullName');
        const inputPassword = document.querySelector('#password');
        const inputRepeatPass = document.querySelector('#passwordRepeat');

        inputEmail.addEventListener('focus', this.focusPlaceholder);
        inputEmail.addEventListener('blur', this.blurPlaceholder);

        if (this.page === 'register') {
            inputFullName.addEventListener('focus', this.focusFullNamePlaceholder);
            inputFullName.addEventListener('blur', this.blurFullNamePlaceholder);
            inputRepeatPass.addEventListener('focus', this.focusRepeatPassPlaceholder);
            inputRepeatPass.addEventListener('blur', this.blurRepeatPassPlaceholder);
        }

        inputPassword.addEventListener('focus', this.focusPassPlaceholder);
        inputPassword.addEventListener('blur', this.blurPassPlaceholder);


    }

    //Алексей, пробовал через цикл и event добраться, не получается продумать, чтобы именно label удалялся.
    //Поэтому пока оставил через кучу функций..(без оптимизации так сказать)

    // activePlaceholder() {
    //     const inputEmail = document.querySelectorAll('input')
    //     const labels = document.querySelectorAll('label');
    //     console.log(labels)
    //     inputEmail.forEach(item => {
    //         item.addEventListener('focus', (event) => {
    //             labels.forEach(item => {
    //               event.target.style.display = 'none'
    //             })
    //         })
    //     })
    // }

    focusPlaceholder() {
        document.querySelector('label[for=email]').style.display = 'none'
        document.querySelector('#email').style.paddingBottom = '20px'
    }
    blurPlaceholder() {
        if (document.querySelector('input').value == 0) {
            document.querySelector('label[for=email]').style.display = 'block'
        }
    }
    focusFullNamePlaceholder() {
        document.querySelector('label[for=fullName]').style.display = 'none'
        document.querySelector('#fullName').style.paddingBottom = '20px'
    }
    blurFullNamePlaceholder() {
        if (document.querySelector('input').value == 0) {
            document.querySelector('label[for=fullName]').style.display = 'block'
        }
    }
    focusPassPlaceholder() {
        document.querySelector('label[for=password]').style.display = 'none'
        document.querySelector('#password').style.paddingBottom = '20px'
    }
    blurPassPlaceholder() {
        if (document.querySelector('input').value == 0) {
            document.querySelector('label[for=password]').style.display = 'block'
        }
    }
    focusRepeatPassPlaceholder() {
        document.querySelector('label[for=passwordRepeat]').style.display = 'none'
        document.querySelector('#passwordRepeat').style.paddingBottom = '20px'
    }
    blurRepeatPassPlaceholder() {
        if (document.querySelector('input').value == 0) {
            document.querySelector('label[for=passwordRepeat]').style.display = 'block'
        }
    }

}