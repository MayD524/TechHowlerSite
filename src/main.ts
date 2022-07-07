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
    var winMgr = new winManager();
    var nb = new navbar(winMgr);
    generateCalendar(today.getFullYear(), today.getMonth());
};