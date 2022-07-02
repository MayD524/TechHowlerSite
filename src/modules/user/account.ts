

let accountSuccessCallback = (response: object) => {
    console.log(response);
};

let getAccountDetails = (account: string) => {
    HTTPRequest(`/api/users/${account}`, "GET", null, accountSuccessCallback, () => { console.log("account doesn't exist")});

};