
let getCookie = (key: string) : any => {
    let val = `; ${document.cookie}`;
    let parts = val.split(`; ${key}=`)[1];
    return parts.split(";")[0].trim();
};

let setCookie = (key: string, value: string) : void => {
    let cookie = ` ${key}=${value};` 
    document.cookie += cookie;
};