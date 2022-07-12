let alertSpace = document.getElementById("alertOverlay")!;
let alerts: HTMLElement[] = [];

let alert = (input: string, isError:boolean=false) => {
    let aDiv = document.createElement('div');

    aDiv.classList.add(isError ? "error" : "success");
    aDiv.classList.add("overlayBlob");
    aDiv.innerText = input;
    setTimeout(() => {
        alertSpace.removeChild(aDiv);
    }, 6000);
    alertSpace.appendChild(aDiv);
    alerts.push(aDiv);
};