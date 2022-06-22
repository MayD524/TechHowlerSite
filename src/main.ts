
let init = () => {
    let winMgr = new winManager();
    let nb = new navbar(winMgr);
    let auth = new authBase(generateTempSessionKey());
};