"use strict";
class info {
    constructor(name, about, imgPth, team) {
        this.name = name;
        this.about = about;
        this.imgPth = imgPth;
        this.team = team;
    }
}
;
let createCard = (clubInfo) => {
};
class navbar {
    constructor(winMgr) {
        this.state = 'Home';
        this.navbar = document.getElementById('globalNavBar');
        this.elements = {
            "Home": "#home-view",
            "About": "#about-view",
            "Projects": "#projects-view",
            "Blog": "#blog-view",
            "Clubs": "#clubs-view",
            "Login": "#login-view",
            "Discussions": "#discussions-view",
            "Account": "#account-view",
            "Learn more": "#about-view"
        };
        this.winMgr = winMgr;
        this.initNavbar();
    }
    initNavbar() {
        let generalNavbar = null;
        document.getElementById('globalNavBar').innerHTML = '';
        generalNavbar = document.createElement('nav');
        generalNavbar.classList.add('nav', 'nav-pills');
        generalNavbar.setAttribute('id', 'globalNavBar1');
        document.getElementById('globalNavBar').appendChild(generalNavbar);
        for (let key in this.elements) {
            if (key == "Login") {
                let loginBtn = document.getElementById("login");
                loginBtn === null || loginBtn === void 0 ? void 0 : loginBtn.addEventListener('click', () => {
                    this.state = key;
                    let page = this.elements[key].replace('#', '');
                    this.winMgr.changePage(page);
                    this.initNavbar();
                });
                continue;
            }
            else if (key == "Account") {
                let accountBtn = document.getElementById("account");
                accountBtn === null || accountBtn === void 0 ? void 0 : accountBtn.addEventListener('click', () => {
                    this.state = key;
                    let page = this.elements[key].replace('#', '');
                    this.winMgr.changePage(page);
                    console.log(getCookie("user"));
                    getAccountDetails(getCookie("user"));
                    this.initNavbar();
                });
                continue;
            }
            else if (key == "Learn more") {
                let lmBtn = document.getElementById("learnMoreHome");
                lmBtn === null || lmBtn === void 0 ? void 0 : lmBtn.addEventListener('click', () => {
                    this.state = key;
                    let page = this.elements[key].replace('#', '');
                    this.winMgr.changePage(page);
                    this.initNavbar();
                });
                continue;
            }
            let element = document.createElement('a');
            element.className = 'navbar-item nav-link text-center';
            if (this.state == key) {
                element.classList.add('active');
            }
            element.addEventListener('click', () => {
                this.state = key;
                let page = this.elements[key].replace('#', '');
                this.winMgr.changePage(page);
                this.initNavbar();
            });
            element.setAttribute('data-toggle', 'pill');
            element.innerHTML = key;
            element.href = this.elements[key];
            generalNavbar.appendChild(element);
        }
        this.navbar.appendChild(generalNavbar);
    }
}
;
let regState = false;
let loginElms = [
    document.getElementById("username_input"),
    document.getElementById("password_input")
];
let registerElms = [
    document.getElementById("password_conf_input"),
    document.getElementById("fullNameInput"),
    document.getElementById("email_input"),
    document.getElementById("studentID_input"),
    document.getElementById("studentGrade"),
];
let loginSuccess = (response) => {
    response = response.replace("LOGIN_SUCCESS;", "");
    let cookies = response.split(";");
    cookies.forEach(element => {
        let x = element.split("=");
        setCookie(x[0], x[1]);
    });
    let lgBtn = document.getElementById("login");
    let lgDiv = document.getElementById('login-view');
    let accBtn = document.getElementById("account");
    let accDiv = document.getElementById("account-view");
    lgBtn.style.display = 'none';
    lgDiv.style.display = 'none';
    accBtn.style.display = 'block';
    accDiv.style.display = 'block';
    alert("Logged in!");
    let tmp = loginElms;
    tmp = tmp.concat(registerElms);
    tmp.forEach((elm) => {
        elm.innerText = '';
    });
};
let runLogin = () => {
    let anyEmpty = anyInputEmpty(loginElms);
    if (anyEmpty > 0) {
        alert("Input " + anyEmpty.toString() + " was left empty.");
        return false;
    }
    login(loginElms[0].value, loginElms[1].value, loginSuccess);
};
let runRegister = () => {
    let tmp = loginElms;
    tmp = tmp.concat(registerElms);
    let anyEmpty = anyInputEmpty(tmp);
    if (anyEmpty != -1) {
        alert("Input " + anyEmpty.toString() + " was left empty.");
        return false;
    }
    console.log(tmp);
    register(tmp[0].value, tmp[1].value, tmp[2].value, tmp[3].value, tmp[4].value, tmp[5].value, tmp[6].value, loginSuccess);
};
let init = () => {
    var winMgr = new winManager();
    var nb = new navbar(winMgr);
    generateCalendar(today.getFullYear(), today.getMonth());
};
class winManager {
    constructor() {
        this.currentPageShown = 'home';
        this.pages = {
            "home-view": document.getElementById('home-view'),
            "about-view": document.getElementById('about-view'),
            "projects-view": document.getElementById('projects-view'),
            "blog-view": document.getElementById('blog-view'),
            "clubs-view": document.getElementById('clubs-view'),
            "login-view": document.getElementById('login-view'),
            "account-view": document.getElementById('account-view'),
            "discussions-view": document.getElementById('discussions-view')
        };
    }
    hidePages(allBut = "") {
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
let generateTempSessionKey = () => {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 16; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    text += new Date().getTime();
    return text;
};
let loggedIn = false;
let currentUser = '';
let startTime = new Date().getTime();
let sessionKey = generateTempSessionKey();
let loginCallback = (response) => {
    loggedIn = true;
    startTime = new Date().getTime();
};
let login = (name, password, callback = null) => {
    let data = {
        name: name,
        password: password,
        sessionID: sessionKey,
        timeStart: startTime,
        hwInfo: getHWInfo(true)
    };
    if (callback === null) {
        callback = loginCallback;
    }
    HTTPRequest('/api/login', HTTPMethods.POST, data, callback, generalErrorCallback);
};
let register = (username, password, pwConf, fullName, email, studentID, studentGR, callback = null) => {
    if (password != pwConf) {
        alert("Passwords do not match please try again.");
        return;
    }
    if (callback === null) {
        callback = loginCallback;
    }
    let data = {
        username: username,
        password: password,
        studentID: studentID,
        sessionID: sessionKey,
        studentGR: studentGR,
        email: email,
        fullName: fullName
    };
    HTTPRequest('/api/register', HTTPMethods.POST, data, callback, generalErrorCallback);
};
let encrypt = (text, key) => {
    let cipher = CryptoJS.AES.encrypt(text, key);
    return cipher.toString();
};
let decrypt = (text, key) => {
    let cipher = CryptoJS.AES.decrypt(text, key);
    return cipher.toString(CryptoJS.enc.Utf8);
};
const MIN_MONTH = 0;
const MAX_MONTH = 11;
const MIN_YEAR = 2022;
const MAX_YEAR = new Date().getFullYear() + 2;
const today = new Date();
let currentDisplayYear = today.getFullYear();
let currentDisplayMonth = today.getMonth();
const monthsByName = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];
let calenderOnClickEvent = (day, month, year) => {
    alert("clicked " + day.toString() + "/" + month.toString() + "/" + year.toString());
};
let totalDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
};
let generateCalendar = (year, month) => {
    assert(!(year < MIN_YEAR || year > MAX_YEAR), "We don't support years less than 2022 nor greater than " + MAX_YEAR.toString() + ".", true);
    assert(!(month < MIN_MONTH || month > MAX_MONTH), "Months are based on a 0-11 (subtract one to the month) scale.", true);
    document.getElementById("monthName").innerHTML = monthsByName[month];
    document.getElementById("theYear").innerHTML = year.toString();
    let totalDays = totalDaysInMonth(year, month + 1);
    let daysList = document.getElementById("calendarDays");
    daysList.innerHTML = '';
    let mnthStart = new Date(Date.UTC(year, month, 0)).getDay() + 2;
    for (let i = 0; i < mnthStart; i++) {
        let x = document.createElement('li');
        x.classList.add('disable-select');
        daysList.appendChild(x);
    }
    for (let i = 0; i < totalDays; i++) {
        let x = document.createElement("li");
        let txt = i + 1;
        x.innerText = txt.toString();
        x.classList.add("disable-select");
        x.addEventListener('click', () => {
            calenderOnClickEvent(txt, month + 1, year);
        });
        if (month == today.getMonth() && year == today.getFullYear() && today.getDate() == txt) {
            x.classList.add("active");
        }
        daysList.appendChild(x);
    }
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
let clearInput = (elmId) => {
    document.getElementById(elmId).value = "";
};
let getInput = (elmId, clear = false, required = false) => {
    let elm = document.getElementById(elmId);
    assert(elm != null, 'Could not find element! ' + elmId);
    let value = elm.value;
    if (required && value == "")
        return false;
    if (clear)
        clearInput(elmId);
    return value;
};
let anyInputEmpty = (elms) => {
    for (let i = 0; i < elms.length; i++) {
        if (elms[i].value == "") {
            return i;
        }
    }
    return -1;
};
let getCookie = (key) => {
    const val = `; ${document.cookie}`;
    const parts = val.split(`; ${key}=`)[1];
    return parts.split(";")[0];
};
let setCookie = (key, value) => {
    let cookie = ` ${key}=${value};`;
    document.cookie += cookie;
};
let getHWInfo = (isLogin = false) => {
    let answer = true;
    if (!isLogin) {
        let untrackable = navigator.doNotTrack === "1" || navigator.doNotTrack === "yes";
        if (!untrackable) {
            answer = confirm("Do you want to get the hardware information?");
        }
        if (untrackable && !answer) {
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
    console.log(url);
    try {
        data = JSON.stringify(data);
    }
    catch (_a) { }
    $.ajax({
        url: url,
        method: method,
        data: data,
        success: callback,
        error: errorCallback
    });
};
let accountSuccessCallback = (response) => {
    console.log(response);
};
let getAccountDetails = (account) => {
    HTTPRequest(`/api/users/${account}`, "GET", null, accountSuccessCallback, () => { console.log("account doesn't exist"); });
};
let newPopup = (url) => {
    let popupWin = window.open(url, 'popUpWindow', 'resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no,status=yes');
};
