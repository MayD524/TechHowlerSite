const MIN_MONTH = 0;
const MAX_MONTH = 11;   // 0 - 11 (indexed at 0)
const MIN_YEAR  = 2022; // if the year is less than 2022 don't do anything 
const MAX_YEAR  = new Date().getFullYear() + 2;

const today     = new Date();

let currentDisplayYear  = today.getFullYear();
let currentDisplayMonth = today.getMonth(); 

const monthsByName = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
]



let calenderOnClickEvent = (day: number, month:number, year:number) => {
    alert("clicked " + day.toString() + "/" + month.toString() + "/" + year.toString());
};

let totalDaysInMonth = (year:number, month:number) => {
    return new Date(year, month, 0).getDate();
};

let generateCalendar = (year:number, month: number) => {
    assert(!(year < MIN_YEAR || year > MAX_YEAR), "We don't support years less than 2022 nor greater than " + MAX_YEAR.toString() + ".", true);
    assert(!(month < MIN_MONTH || month > MAX_MONTH), "Months are based on a 0-11 (subtract one to the month) scale.", true);
    
    document.getElementById("monthName")!.innerHTML = monthsByName[month];
    
    document.getElementById("theYear")!.innerHTML = year.toString();
    let totalDays = totalDaysInMonth(year, month);
    let daysList  = document.getElementById("calendarDays")!;
    daysList.innerHTML = ''; // clear out the days

    for(let i = 0; i < totalDays; i++) {
        let x = document.createElement("li");
        let txt = i + 1; // so we have a [1-31] scale instead of [0-30]
        x.innerText = txt.toString();
        x.classList.add("disable-select")
        x.addEventListener('click', () => {
            calenderOnClickEvent(txt, month+1, year);
        });

        if (month == today.getMonth() && year == today.getFullYear() && today.getDate() == txt)
        {
            // set an active class if it's today :>
            x.classList.add("active");
        }

        daysList.appendChild(x);
    }
};