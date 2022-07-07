

/*
    we can expect these two to exists post
    init
 */

let regState:boolean = false;

// all that is needed just for logins

let errorText = document.getElementById("errorText")!;

let loginElms = [
    (document.getElementById("username_input")! as HTMLInputElement),
    (document.getElementById("password_input")! as HTMLInputElement)
]

// stuff for creating a new account
let registerElms = [
    (document.getElementById("fullNameInput")! as HTMLInputElement),
    (document.getElementById("email_input")! as HTMLInputElement),
    (document.getElementById("studentID_input")! as HTMLInputElement),
    (document.getElementById("studentGrade")! as HTMLInputElement),
]

let loginSuccess = (response: string) => {
    response = response.replace("LOGIN_SUCCESS;", "");
    let cookies = response.split(";");

    cookies.forEach(element => {
        let x = element.split("=");
        setCookie(x[0], x[1]);
    });

    let lgBtn  = document.getElementById("login")!;
    let lgDiv  = document.getElementById('login-view')!;
    let accBtn = document.getElementById("account")!;
    let accDiv = document.getElementById("account-view")!;

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
    alert("Logged in!");
};


let runLogin = () => {
    // in the future we can do some fancy css
    // stuff to make this look better than just alerts
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
    if (anyEmpty != -1){
        alert("Input " + anyEmpty.toString() + " was left empty.");
        return false;
    }

    // check password
    if (isValidPassword(tmp[1].value) != 0) {
        tmp[1].classList.add("inputFail");
        errorText.innerText = "Password must be longer than 8 characters.";
        return;
    }

    // check email
    if (!isValidEmail(tmp[3].value)) {
        tmp[3].classList.add("inputFail");
        errorText.innerText = "Email is not a valid Excel Academy email.";
        return;
    }

    // grade level
    if (tmp[5].value != "staff") {
        if (Number(tmp[6].value) > 12 || Number(tmp[5].value) < 5) {
            tmp[5].classList.add("inputFail");
            errorText.innerText = "The grade level given is not within 5th to 12th grade please try again.";
            return;
        }
    } else {
        tmp[5].value = "1000";
    }

    if (!tmp[2].value.includes(" ")) {
        tmp[2].classList.add("inputFail");
        errorText.innerText = "Please have a space between your first and last name. Thank you.";
        return;
    }

    register( 
        tmp[0].value,
        tmp[1].value,
        tmp[2].value,
        tmp[3].value,
        tmp[4].value,
        tmp[5].value,
        loginSuccess
    );
};