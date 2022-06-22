"use strict";
class navbar {
    constructor(winMgr) {
        this.state = 'Home';
        this.navbar = document.getElementById('globalNavBar');
        this.elements = {
            "Home": "#home-view",
            "About": "#about-view",
            "Contact": "#contact-view",
            "Projects": "#projects-view",
            "Blog": "#blog-view",
            "Clubs": "#clubs-view"
        };
        this.winMgr = winMgr;
        this.initNavbar();
    }
    initNavbar() {
        // create navbar elements
        let generalNavbar = null;
        document.getElementById('globalNavBar').innerHTML = '';
        generalNavbar = document.createElement('nav');
        generalNavbar.classList.add('nav', 'nav-pills');
        generalNavbar.setAttribute('id', 'globalNavBar1');
        document.getElementById('globalNavBar').appendChild(generalNavbar);
        for (let key in this.elements) {
            let element = document.createElement('a');
            element.className = 'navbar-item nav-link text-center';
            // check if the current state is the same as the element
            if (this.state == key) {
                element.classList.add('active');
            }
            // pill toggle
            element.addEventListener('click', () => {
                this.state = key;
                let page = this.elements[key].replace('#', '');
                this.winMgr.changePage(page);
                this.initNavbar();
            });
            // set data-toggle
            element.setAttribute('data-toggle', 'pill');
            element.innerHTML = key;
            element.href = this.elements[key];
            generalNavbar.appendChild(element);
        }
        this.navbar.appendChild(generalNavbar);
    }
}
;
let init = () => {
    let winMgr = new winManager();
    let nb = new navbar(winMgr);
    let auth = new authBase(generateTempSessionKey());
};
class winManager {
    constructor() {
        this.currentPageShown = 'home';
        this.pages = {
            "home-view": document.getElementById('home-view'),
            "about-view": document.getElementById('about-view'),
            "contact-view": document.getElementById('contact-view'),
            "projects-view": document.getElementById('projects-view'),
            "blog-view": document.getElementById('blog-view'),
            "clubs-view": document.getElementById('clubs-view')
        };
    }
    hidePages(allBut = "") {
        /**
         * Hide all pages except one (if specified) * optional
         */
        for (let key in this.pages) {
            if (key === allBut || this.pages[key] === null) {
                continue;
            }
            this.pages[key].style.display = 'none';
        }
    }
    changePage(page) {
        console.log(page);
        assert(page in this.pages, 'page does not exist');
        assert(this.pages[page] !== null, 'page is null', false);
        this.currentPageShown = page;
        this.hidePages(page);
        this.pages[page].style.display = 'block';
    }
}
;
class authBase {
    constructor(tmpSessionkey) {
        this.timeStart = new Date().getTime();
        this.loggedIn = false;
        this.name = '';
        this.sessionKey = tmpSessionkey;
        let data = {
            key: this.sessionKey,
            timeStart: this.timeStart,
            hwInfo: getHWInfo(true)
        };
        console.log(data);
        console.log("requesting login");
        HTTPRequest('/api/report', HTTPMethods.POST, { hwInfo: getHWInfo(true) }, this.loginCallback.bind(this), generalErrorCallback);
    }
    loginCallback(response) {
        this.loggedIn = true;
        // get the session key from the response
        this.timeStart = new Date().getTime();
        this.sessionKey = response.sessionKey;
    }
    login(name, password) {
        let data = {
            name: name,
            password: encrypt(password, this.sessionKey),
            timeStart: this.timeStart,
            hwInfo: getHWInfo(true)
        };
        HTTPRequest('/api/login', HTTPMethods.POST, data, this.loginCallback.bind(this), generalErrorCallback);
    }
}
;
let generateTempSessionKey = () => {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 10; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    text += new Date().getTime();
    return text;
};
/**
 * Just a simple wrapper for CryptoJS
 *  Author: May Draskovics
 *  Date  : 06/15/2022
 */
let encrypt = (text, key) => {
    let cipher = CryptoJS.AES.encrypt(text, key);
    return cipher.toString();
};
let decrypt = (text, key) => {
    let cipher = CryptoJS.AES.decrypt(text, key);
    return cipher.toString(CryptoJS.enc.Utf8);
};
let assert = (condition, message, useAlert = true) => {
    if (!condition) {
        if (useAlert) {
            alert(message);
            return;
        }
        throw message;
    }
};
/**
 *  General HTTP request functions
 */
let getHWInfo = (isLogin = false) => {
    let answer = true;
    if (!isLogin) {
        /**
         *  Tracking is mandatory for login
         *  this is so we can alert the account
         *  owner of logins and logouts incase
         *  they're illegitimate.
         */
        let untrackable = navigator.doNotTrack === "1" || navigator.doNotTrack === "yes";
        if (!untrackable) {
            answer = confirm("Do you want to get the hardware information?");
        }
        if (untrackable && !answer) {
            // only important information is collected
            // anything else doesn't matter at the moment
            return {
                "os": navigator.platform,
                "screen": {
                    "width": screen.width,
                    "height": screen.height
                },
                "language": navigator.language,
                "browser": navigator.userAgent,
                "donottrack": true
            };
        }
    }
    let hwInfo = {
        "os": navigator.platform,
        "userAgent": navigator.userAgent,
        "vendor": navigator.vendor,
        "language": navigator.language,
        "appVersion": navigator.appVersion,
        "cookieEnabled": navigator.cookieEnabled,
        "hardwareConcurrency": navigator.hardwareConcurrency,
        "maxTouchPoints": navigator.maxTouchPoints,
        "webdriver": navigator.webdriver,
        "browser": navigator.appVersion,
        "donottrack": navigator.doNotTrack,
        "screen": screen.width + "x" + screen.height
    };
    return {
        "action": "getHWInfo",
        "hwInfo": hwInfo
    };
};
const HTTPMethods = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE"
};
const HTTPStatusCodes = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501
};
let generalErrorCallback = (error) => {
    console.log(error);
    alert('Error: ' + error);
};
let HTTPRequest = (url = "", method = "GET", data, callback, errorCallback) => {
    assert(url !== "", "url is empty");
    //assert(method in HTTPMethods, "method is not valid");
    $.ajax({
        url: url,
        method: method,
        data: data,
        success: callback,
        error: errorCallback
    });
};
