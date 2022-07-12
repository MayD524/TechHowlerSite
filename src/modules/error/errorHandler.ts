enum codes {
    ALERT_INFO,
    ALERT_GENERAL,
    ALERT_SUCCESS,
    ALERT_WARNING,
    ALERT_FAILURE,
};



let alertSpace = document.getElementById("alertOverlay")!;
let alerts: HTMLElement[] = [];

let alert = (input: string, code:codes=codes.ALERT_SUCCESS) => {
    let aDiv = document.createElement('div');

    switch (code) {
        case codes.ALERT_SUCCESS:
            aDiv.classList.add("success");
            break;
        case codes.ALERT_GENERAL:
            aDiv.classList.add("general");
            break;
        case codes.ALERT_INFO:
            aDiv.classList.add("info");
            break;
        case codes.ALERT_WARNING:
            aDiv.classList.add("warning");
            break;
        case codes.ALERT_FAILURE:
            aDiv.classList.add("errror");
            break;
    }

    aDiv.classList.add("overlayBlob");
    aDiv.innerText = input;
    setTimeout(() => {
        alertSpace.removeChild(aDiv);
    }, 6000);
    alertSpace.appendChild(aDiv);
    alerts.push(aDiv);
};