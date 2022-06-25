let generateTempSessionKey = () => {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 16; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    text += new Date().getTime();
    return text;
}
let loggedIn = false;
let currentUser = '';
let startTime = new Date().getTime();
let sessionKey = generateTempSessionKey();

let loginCallback = (response: any) => {
    loggedIn = true;
    // get the session key from the response
    startTime = new Date().getTime();
};

let login = (name: string, password: string, callback:any=null) => {
    let data = {
        name        : name,
        password    : password, //encrypt(password, sessionKey),
        sessionID   : sessionKey,
        timeStart   : startTime,
        hwInfo      : getHWInfo(true)
    };
    if (callback === null) {
        callback = loginCallback
    }
    HTTPRequest('/api/login', HTTPMethods.POST, data, callback, generalErrorCallback);
}

let register = (username  : string,
                password  : string,
                pwConf    : string,
                fullName  : string,
                email     : string,
                studentID : string,
                studentGR : string,
                callback  : any=null
    ) => {
    
    if (password != pwConf)
    {
        alert("Passwords do not match please try again.");
        return;
    }

    if (callback === null) {
        callback = loginCallback
    }

    let data = {
        username : username,
        password : password, //encrypt(password, sessionKey),
        studentID: studentID,
        sessionID: sessionKey,
        studentGR: studentGR,
        email    : email,
        fullName : fullName
    }
    HTTPRequest('/api/register', HTTPMethods.POST, data, callback, generalErrorCallback);
};