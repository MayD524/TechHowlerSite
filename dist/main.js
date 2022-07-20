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
            "Student Work": "#projects-view",
            "Blog": "#blog-view",
            "Clubs": "#clubs-view",
            "Login": "#login-view",
            "Account": "#account-view",
            "Learn more": "#about-view",
            "Dev": "#dev-view"
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
                    getAccountDetails(getCookie("username"));
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
            if (key == "Dev" && !isAuth)
                element.style.display = 'none';
            else
                element.style.display = 'block';
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
let errorText = document.getElementById("errorText");
let loginElms = [
    document.getElementById("username_input"),
    document.getElementById("password_input")
];
let registerElms = [
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
    let tmp = loginElms;
    tmp = tmp.concat(registerElms);
    tmp.forEach((elm) => {
        elm.innerText = '';
    });
    getAccountDetails(getCookie("username"));
    loggedIn = true;
    alert("Logged in!");
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
    if (isValidPassword(tmp[1].value) != 0) {
        tmp[1].classList.add("inputFail");
        errorText.innerText = "Password must be longer than 8 characters.";
        return;
    }
    if (!isValidEmail(tmp[3].value)) {
        tmp[3].classList.add("inputFail");
        errorText.innerText = "Email is not a valid Excel Academy email.";
        return;
    }
    if (tmp[5].value != "staff") {
        if (Number(tmp[6].value) > 12 || Number(tmp[5].value) < 5) {
            tmp[5].classList.add("inputFail");
            errorText.innerText = "The grade level given is not within 5th to 12th grade please try again.";
            return;
        }
    }
    else {
        tmp[5].value = "1000";
    }
    if (!tmp[2].value.includes(" ")) {
        tmp[2].classList.add("inputFail");
        errorText.innerText = "Please have a space between your first and last name. Thank you.";
        return;
    }
    register(tmp[0].value, tmp[1].value, tmp[2].value, tmp[3].value, tmp[4].value, tmp[5].value, loginSuccess);
};
if ('serviceWorker' in navigator) {
}
let init = () => {
    if (getCookie("username") && getCookie("session")) {
        let data = {
            name: getCookie("username"),
            sessionID: getCookie("session"),
            timeStart: startTime,
            hwInfo: getHWInfo(true)
        };
        HTTPRequest("api/login", HTTPMethods.POST, data, loginSuccess, generalErrorCallback);
    }
    var winMgr = new winManager();
    var nb = new navbar(winMgr);
    generateCalendar(today.getFullYear(), today.getMonth());
    getBlogs(0, 10);
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
            "dev-view": document.getElementById('dev-view')
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
let isAuth = false;
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
    authCheck(name, sessionKey);
};
let isValidEmail = (email) => {
    return email.includes("@excelacademy.org") || email.includes("@students.excelacademy.org");
};
let authCheck = (username, ssid) => {
    HTTPRequest("/api/dev/isauth", "GET", `${username};${ssid}`, (response) => {
        isAuth = true;
        let devSect = document.getElementById("dev-view");
        devSect.innerHTML = response;
    }, () => { });
};
let isValidPassword = (passW) => {
    let ret = 0;
    if (passW.length < 8)
        ret += 10;
    return ret;
};
let register = (username, password, fullName, email, studentID, studentGR, callback = null) => {
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
let counter = (str) => {
    return str.split('').reduce((total, letter) => {
        total[letter] ? total[letter]++ : total[letter] = 1;
        return total;
    }, {});
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
    let dCookies = document.cookie;
    let parts = dCookies.split(" ");
    for (let i = 0; i < parts.length; i++) {
        let pair = parts[i].split("=");
        if (pair[0] == key)
            return pair[1];
    }
};
let removeCookie = (key) => {
    let cookie = getCookie(key);
    if (cookie === undefined)
        return;
    cookie = `${key}=${cookie}`;
    document.cookie = document.cookie.replace(` ${cookie}`, "");
};
let setCookie = (key, value) => {
    if (getCookie(key) != undefined)
        return;
    let cookie = ` ${key}=${value};`;
    document.cookie += cookie;
};
var codes;
(function (codes) {
    codes[codes["ALERT_INFO"] = 0] = "ALERT_INFO";
    codes[codes["ALERT_GENERAL"] = 1] = "ALERT_GENERAL";
    codes[codes["ALERT_SUCCESS"] = 2] = "ALERT_SUCCESS";
    codes[codes["ALERT_WARNING"] = 3] = "ALERT_WARNING";
    codes[codes["ALERT_FAILURE"] = 4] = "ALERT_FAILURE";
})(codes || (codes = {}));
;
let alertSpace = document.getElementById("alertOverlay");
let alerts = [];
let alert = (input, code = codes.ALERT_SUCCESS) => {
    let aDiv = document.createElement('div');
    switch (code) {
        case codes.ALERT_SUCCESS:
            aDiv.classList.add("success");
            break;
        case codes.ALERT_GENERAL:
            aDiv.classList.add("general");
            break;
        case codes.ALERT_INFO:
            aDiv.classList.add("info");
            break;
        case codes.ALERT_WARNING:
            aDiv.classList.add("warning");
            break;
        case codes.ALERT_FAILURE:
            aDiv.classList.add("error");
            break;
    }
    aDiv.classList.add("overlayBlob");
    aDiv.innerText = input;
    setTimeout(() => {
        alertSpace.removeChild(aDiv);
    }, 6000);
    alertSpace.appendChild(aDiv);
    alerts.push(aDiv);
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
let blogCacheObject = {
    UUID: "N/A",
    author: "N/A",
    form: "N/A",
    likes: 0,
    likedby: "N/A",
    message: "N/A",
    parent: "N/A",
    postDate: "N/A",
    resources: "N/A",
    ID: 0
};
let blogEnableState = false;
let blogCache = [];
let activeElms = [];
let getBlogs = (start, end) => {
    let lastElm = blogCache[blogCache.length];
    if (start > end) {
        let tmp = start;
        start = end;
        end = tmp;
    }
    if (lastElm != undefined) {
        if (lastElm.ID > end)
            return;
        else if (lastElm.ID > start)
            start = lastElm.ID;
    }
    HTTPRequest(`/api/getPost/${start}&${end}`, HTTPMethods.GET, "", (response) => {
        let obj = JSON.parse(response);
        let display = document.getElementById("blogDisplay");
        display.innerHTML = '';
        for (let i = 0; i < obj.length; i++) {
            if (blogCache.includes(obj[i]))
                continue;
            blogCache.push(obj[i]);
            let elm = document.createElement("div");
            let buttons = document.createElement("div");
            buttons.classList.add("blogPostButtons");
            elm.id = 'bl' + obj[i].UUID;
            elm.classList.add("blogPost");
            elm.innerHTML = `
                            <div class="blogPostHeader">
                                <span class="blogAuthorName">Author: ${obj[i].author}</span>
                                <span class="float-right blogPostDate">${obj[i].postDate}</span>
                            </div>
                            <div class="blogPostBody">
                                ${obj[i].message}
                            </div>
                        `;
            let uName = getCookie("username");
            let likedText = "&#x2661;";
            toString().includes;
            if (uName !== undefined && obj[i].likedby.includes(uName))
                likedText = "&#x2665;";
            buttons.innerHTML = `
                            <div class="container">
                                <div class="row">
                                <div class="col-sm blogButton" onclick="blogRead('bl${obj[i].UUID}')" id="bl${obj[i].UUID}_read">Read</div> 
                                    <div class="col-sm blogButton" onclick="blogAction('likes', '${obj[i].UUID}')" id="bl${obj[i].UUID}_likes">${likedText} ${obj[i].likes}</div>
                                    <!-- Comments may be added later :> - may 
                                        <div class="col-sm blogButton" onclick="blogAction('comment', '${obj[i].UUID}')" id="bl${obj[i].UUID}_comment">comment</div>
                                    -->
                                </div>
                            </div>
                        `;
            display.appendChild(elm);
            display.appendChild(buttons);
        }
    }, generalErrorCallback);
};
let blogRead = (uid) => {
    let cur = document.getElementById(uid);
    let btn = document.getElementById(uid + "_read");
    if (activeElms.includes(uid)) {
        cur.style.height = "150px";
        cur.style.webkitMaskImage = "linear-gradient(180deg, #000 60%, transparent)";
        cur.style.overflow = "hidden";
        btn.innerText = "Read";
        activeElms.splice(activeElms.indexOf(uid));
    }
    else {
        cur.style.height = "600px";
        cur.style.overflow = "scroll";
        cur.style.webkitMaskImage = "";
        btn.innerText = "Close";
        activeElms.push(uid);
    }
};
let getBlogIndexByUUID = (uid) => {
    for (let bco in blogCache) {
        if (blogCache[bco].UUID == uid)
            return parseInt(bco);
    }
    return -1;
};
let getBlogByUUID = (uid) => {
    for (let bco in blogCache) {
        if (blogCache[bco].UUID == uid)
            return blogCache[bco];
    }
    return undefined;
};
let blogAction = (act, uid) => {
    console.log(`${act} - ${uid}`);
    switch (act) {
        case "likes":
            console.log("here");
            let uName = getCookie("username");
            let likeBtn = document.getElementById(`bl${uid}_likes`);
            let blog = getBlogByUUID(uid);
            if (blog === undefined) {
                return;
            }
            if (uName === undefined) {
                return;
            }
            console.log("make REQUEST!");
            let index = getBlogIndexByUUID(uid);
            if (blog.likedby.includes(uName)) {
                HTTPRequest(`/api/post/like/revoke/${blog.UUID}`, "POST", "", () => {
                    blogCache[index].likedby = blogCache[index].likedby.replace(`${uName};`, '');
                    blogCache[index].likes--;
                    likeBtn.innerHTML = `&#x2661; ${blogCache[index].likes}`;
                    console.log("here");
                }, generalErrorCallback);
            }
            else {
                HTTPRequest(`/api/post/like/${blog.UUID}`, "POST", "", () => {
                    blogCache[index].likedby += `${uName};`;
                    blogCache[index].likes++;
                    likeBtn.innerHTML = `&#x2665; ${blogCache[index].likes}`;
                    console.log("here");
                }, generalErrorCallback);
            }
            break;
        case "comment":
            break;
    }
};
let blogCreationSuccess = (response) => {
    alert(response);
};
let blogCreationError = (response) => {
    let blog = document.getElementById("blogData");
    blog.value = "";
    alert("Blog post created successfully!");
};
let createBlogPost = () => {
    if (!loggedIn && getCookie("username") === undefined) {
        alert("Error User must be logged in for this action!");
        return;
    }
    let blogData = document.getElementById("blogData").value;
    if (blogData === "") {
        alert("You must type something.");
    }
    HTTPRequest("/api/post/blog", "POST", blogData, blogCreationSuccess, blogCreationError);
};
let grades = [
    "Freshman",
    "Sophomore",
    "Junior",
    "Senior"
];
let numToGrade = (grade) => {
    try {
        grade = parseInt(grade);
    }
    catch (_a) { }
    grade -= 9;
    return grades[grade];
};
let accountSuccessCallback = (response) => {
    let accJson = JSON.parse(response);
    console.log(accJson);
    if (accJson.pfp === "") {
        accJson.pfp = "resources/logo.png";
    }
    console.log(accJson);
    document.getElementById("account-view").innerHTML = `
    <div class="pfp">
        <img src=${accJson.pfp} width=150 height=150/>
    </div>
    <h3>${accJson.username}</h3>
    <span class="subtitle"> ${accJson.firstName} ${accJson.lastName} - ${numToGrade(accJson.grade)}</span>
    <div class="accountAbout"><h5>About: </h5> ${accJson.about} </div>
    `;
};
let getAccountDetails = (account) => {
    HTTPRequest(`/api/users/${account}`, "GET", null, accountSuccessCallback, () => { console.log("account doesn't exist"); });
};
let newPopup = (url) => {
    let popupWin = window.open(url, 'popUpWindow', 'resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no,status=yes');
};
