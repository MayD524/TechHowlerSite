/**
 * Just a simple wrapper for CryptoJS
 *  Author: May Draskovics
 *  Date  : 06/15/2022
 */


let encrypt = (text: string, key:string ) => {
    let cipher = CryptoJS.AES.encrypt(text, key);
    return cipher.toString();
}

let decrypt = (text: string, key:string ) => {
    let cipher = CryptoJS.AES.decrypt(text, key);
    return cipher.toString(CryptoJS.enc.Utf8);
}
