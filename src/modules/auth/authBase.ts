
class authBase {
    loggedIn: boolean;
    name: string;
    sessionKey: string;
    timeStart = new Date().getTime();

    loginCallback(response: any) {
        this.loggedIn = true;
        // get the session key from the response
        this.timeStart = new Date().getTime();
        this.sessionKey = response.sessionKey;
    }


    login(name: string, password: string) {
        let data = {
            name: name,
            password: encrypt(password, this.sessionKey),
            timeStart: this.timeStart,
            hwInfo : getHWInfo(true)
        };
        HTTPRequest('/api/login', HTTPMethods.POST, data, this.loginCallback.bind(this), generalErrorCallback);
    }

    constructor(tmpSessionkey: string) {
        this.loggedIn = false;
        this.name = '';
        this.sessionKey = tmpSessionkey;
        let data = {
            key : this.sessionKey,
            timeStart: this.timeStart,
            hwInfo : getHWInfo(true)
        };
        console.log(data);
        console.log("requesting login");
        HTTPRequest('/api/report', HTTPMethods.POST, {hwInfo: getHWInfo(true)}, this.loginCallback.bind(this), generalErrorCallback);
    }

};

let generateTempSessionKey = () => {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 10; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    text += new Date().getTime();
    return text;
}
