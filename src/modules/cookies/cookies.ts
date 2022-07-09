

let getCookie = (key: string) : any => {
    let dCookies = document.cookie;
    let parts:string[] = dCookies.split(" ");
    for (let i = 0; i < parts.length; i++) {
        let pair = parts[i].split("=");
        if (pair[0] == key)
            return pair[1];
    }
};

let removeCookie = (key: string) : void => {
    let cookie = getCookie(key);
    if (cookie === undefined)
        return; // cookie doesn't exist;
    
    cookie = `${key}=${cookie}`;
    document.cookie = document.cookie.replace(` ${cookie}`, "");
};

let setCookie = (key: string, value: string) : void => {
    if (getCookie(key) != undefined)
        return;
    let cookie = ` ${key}=${value};` 
    document.cookie += cookie;
};