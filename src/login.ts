

/*
    we can expect these two to exists post
    init
 */

let regState:boolean = false;

// all that is needed just for logins

let loginElms = [
    (document.getElementById("username_input")! as HTMLInputElement),
    (document.getElementById("password_input")! as HTMLInputElement)
]

// stuff for creating a new account
let registerElms = [
    (document.getElementById("password_conf_input")! as HTMLInputElement),
    (document.getElementById("fullNameInput")! as HTMLInputElement),
    (document.getElementById("email_input")! as HTMLInputElement),
    (document.getElementById("studentID_input")! as HTMLInputElement),
    (document.getElementById("studentGrade")! as HTMLInputElement),
]

let loginSuccess = (response: any) => {
    let lgBtn  = document.getElementById("login")!;
    let lgDiv  = document.getElementById('login-view')!;
    let accBtn = document.getElementById("account")!;
    let accDiv = document.getElementById("account-view")!;

    lgBtn.style.display = 'none';
    lgDiv.style.display = 'none';
    accBtn.style.display = 'block';
    accDiv.style.display = 'block';
    alert("Logged in!")

    let tmp = loginElms;
    tmp = tmp.concat(registerElms);
    tmp.forEach((elm) => {
        elm.innerText = '';
    });
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
    console.log(tmp);
    register( 
        tmp[0].value,
        tmp[1].value,
        tmp[2].value,
        tmp[3].value,
        tmp[4].value,
        tmp[5].value,
        tmp[6].value,
        loginSuccess
    );
};