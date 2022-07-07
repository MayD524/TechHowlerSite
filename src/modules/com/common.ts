
let assert = (condition: boolean, message: string, useAlert: boolean=true) => {
    if (!condition) {
        if (useAlert) { alert(message); return; }
        throw message;
    }
};

let clearInput = (elmId: string) => {
    (document.getElementById(elmId)! as HTMLInputElement).value = "";
};

let counter = (str:string) => {
    return str.split('').reduce((total: { [key:string] : number }, letter:string) => {
        total[letter] ? total[letter]++ : total[letter] = 1;
        return total;
    }, {});
};

let getInput = (elmId: string, clear:boolean=false, required:boolean=false) : string|boolean => {
    let elm:HTMLInputElement = (document.getElementById(elmId) as HTMLInputElement);
    assert(elm != null, 'Could not find element! ' + elmId)
    let value = elm.value;
    if (required && value == "")
        return false;
    if (clear)
        clearInput(elmId);
    return value;
};

let anyInputEmpty = (elms : HTMLInputElement[]) => {
    for (let i = 0; i < elms.length; i++) {
        if (elms[i].value == "") {
            return i;
        }
    }
    return -1;
};