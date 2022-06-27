
let init = () => {
    var winMgr = new winManager();
    var nb = new navbar(winMgr);
    generateCalendar(today.getFullYear(), today.getMonth());
};