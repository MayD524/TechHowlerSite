/**
 * TODO: FIXMEEE
 *  I am far too tired to fix cookies = broken plz fix future
 *  May <3 - Past May :P
 * 
 */

let cookies:string[][] = [];

let getCookiFromLocal = (key: string) : any => {
    for(let i = 0; i < cookies.length; i++) {
        if (cookies[i][0] == key) {
            return cookies[i][0]
        }
    }
};

let getCookie = (key: string, fromLocal:boolean=true) : any => {
    if (fromLocal) {
        return getCookiFromLocal(key);
    }
    let val = `; ${document.cookie}`;
    let parts = val.split(`; ${key}=`)[1];
    console.log(parts.split(";")[0].trim());
    return parts.split(" ")[0].trim();
};

let setCookie = (key: string, value: string) : void => {
    let cookie = ` ${key}=${value};` 
    cookies.push([key,value]);
    document.cookie += cookie;
};