let newPopup = (url: string) => {
    let popupWin = window.open(
        url, 'popUpWindow', 'resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no,status=yes'
    );
}