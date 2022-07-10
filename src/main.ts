/**
 *  Stuff for PWA aka future May shall deal with this 
 * Thanks May - May
 */

if ('serviceWorker' in navigator){
    //navigator.serviceWorker.register('sw.js', { scope: "http://localhost:8080/" }).then(function(reg){
    //    console.log('Registration succeeded. Scope is ' + reg.scope);
    //});
}

let init = () => {
    if (getCookie("username") && getCookie("session")) {
        // login with cookies
        let data = {
            name        : getCookie("username"),
            sessionID   : getCookie("session"),
            timeStart   : startTime,
            hwInfo      : getHWInfo(true)
        };
        HTTPRequest("api/login", HTTPMethods.POST, data, loginSuccess, generalErrorCallback);
    }

    var winMgr = new winManager();
    var nb = new navbar(winMgr);
    generateCalendar(today.getFullYear(), today.getMonth());
    getBlogs(0, 10);
};