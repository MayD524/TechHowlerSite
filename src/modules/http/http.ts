/**
 *  General HTTP request functions
 */

let getHWInfo = (isLogin:boolean=false) : object => {
    let answer:boolean = true;
    if (!isLogin) {
        /**
         *  Tracking is mandatory for login
         *  this is so we can alert the account
         *  owner of logins and logouts incase
         *  they're illegitimate.
         */

        let untrackable:boolean = navigator.doNotTrack === "1" || navigator.doNotTrack === "yes";
        
        if (!untrackable) {
            answer = confirm("Do you want to get the hardware information?");
        }

        if (untrackable && !answer) {
            // only important information is collected
            // anything else doesn't matter at the moment
            return {
                "os" : navigator.platform,
                "screen" : {
                    "width" : screen.width,
                    "height" : screen.height
                },
                "language" : navigator.language,
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

let generalErrorCallback = (error: any) => {
    console.log(error);
    alert('Error: ' + error);
};

let HTTPRequest = (url: string="", method: string ="GET", data: any, callback: (response: any) => void, errorCallback: (error: any) => void) => {
    assert(url !== "", "url is empty");
    //assert(method in HTTPMethods, "method is not valid");

    try {
        data = JSON.stringify(data);
    } catch {} // we don't care about the error here

    $.ajax({
        url: url,
        method: method,
        data: data,
        success: callback,
        error: errorCallback
    });
};