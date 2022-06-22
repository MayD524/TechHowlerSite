
let assert = (condition: boolean, message: string, useAlert: boolean=true) => {
    if (!condition) {
        if (useAlert) { alert(message); return; }
        throw message;
    }
};