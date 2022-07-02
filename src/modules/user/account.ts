let grades = [
    "Freshman",
    "Sophomore",
    "Junior",
    "Senior"
]

let numToGrade = (grade : any) : string => {
    try {
        grade = parseInt(grade);
    } catch {}

    grade -= 9; // indexed at zero
    return grades[grade];
};

let accountSuccessCallback = (response: string) => {
    let accJson = JSON.parse(response);
    console.log(accJson)

    if (accJson.pfp === "") {
        accJson.pfp = "resources/logo.png";
    }
    console.log(accJson)


    document.getElementById("account-view")!.innerHTML = `
    <div class="pfp">
        <img src=${accJson.pfp} width=150 height=150/>
    </div>
    <h3>${accJson.name}</h3>
    <span class="subtitle"> ${accJson.firstName} ${accJson.lastName} - ${numToGrade(accJson.grade)}</span>
    <div class="accountAbout"> ${accJson.about} </div>
    `;

};

let getAccountDetails = (account: string) => {
    HTTPRequest(`/api/users/${account}`, "GET", null, accountSuccessCallback, () => { console.log("account doesn't exist")});

};