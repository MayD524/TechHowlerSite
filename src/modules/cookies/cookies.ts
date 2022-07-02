
let getCookie = (key: string) : any => {
    const val = `; ${document.cookie}`;
    const parts = val.split(`; ${key}=`)[1];
    return parts.split(";")[0];
};

let setCookie = (key: string, value: string) : void => {
    let cookie = ` ${key}=${value};` 
    document.cookie += cookie;
};