// Import
import {createLabelsOfMonth} from "../../plugins/chart.js/utils.js";

// UrlSearchParams
let urlSearchParams = new URLSearchParams(window.location.search);

// State
let revenueByMonth = [];
let month;
let year;

// Element
let monthElement = document.querySelector("#month");
let yearElement = document.querySelector("#year");
let searchElement = document.querySelector("#search");
let chartContainerElement = document.querySelector(".chart");

// Use State
const setTime = async (m, y) => {
    month = m;
    year = y;
    await setTimeAction();
}

const setTimeAction = async () => {
    let revenueByMonth = await getRevenueByMonth();
    setRevenueByMonth(revenueByMonth);
}

const setRevenueByMonthAction = () => {
    let labels = createLabelsOfMonth(month, year);

    let data = labels.map(date => {
        let data = revenueByMonth.find(value => {
            return value.date === date;
        });
        return data ? {x: data.date, y: data.revenue} : {x: date, y: 0};
    });

    chartContainerElement.innerHTML = "";
    let chart = document.createElement("canvas");
    chart.id="revenue-by-week";
    new Chart(chart, {
        data: {
            datasets: [
                {
                    type: 'bar',
                    label: "Revenue (Bar)",
                    data: data,
                    backgroundColor: "rgba(253,126,20,0.25)",
                    borderColor: "#fd7e14",
                    borderWidth: 1
                }
                , {
                    type: 'line',
                    label: "Revenue (Line)",
                    data: data,
                    tension: 0.3,
                    backgroundColor: "rgba(255,193,7,0.25)",
                    borderColor: "#ffc107",
                    borderWidth: 1,
                    pointStyle: "circle",
                    pointRadius: 5,
                    pointHoverRadius: 8
                }
            ]
        },
        options : {
            scales: {
                x: {
                    type: "time",
                    time: {
                        displayFormats: {
                            day: "DD-MMM-YY"
                        },
                        unit: "day"
                    }
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    chartContainerElement.appendChild(chart);
}

const setRevenueByMonth = (r) => {
    revenueByMonth = r;
    setRevenueByMonthAction();
}

// Use Effect
const useEffect = async () => {
    let month;
    let year;
    if (urlSearchParams.get("month") && urlSearchParams.get("year")) {
        month = parseInt(urlSearchParams.get("month"));
        year = parseInt(urlSearchParams.get("year"));
    }
    else {
        let date = new Date();
        month = date.getMonth() + 1;
        year = date.getFullYear();
    }
    monthElement.value = month;
    yearElement.value = year;
    await setTime(month, year);
}
// Event
searchElement.onclick = async () => {
    await setTime(monthElement.value, yearElement.value);
}
// Function

const getRevenueByMonthUrl = () => {
    return `http://localhost:8080/api/v1/admin/revenue-by-month?month=${month}&year=${year}`
}
const getRevenueByMonth = async () => {
    return fetch(getRevenueByMonthUrl())
        .then(response => response.json());
}

// Init
await useEffect();