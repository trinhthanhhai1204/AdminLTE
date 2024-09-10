// Import
import {parseDate} from "../../plugins/chart.js/utils.js";

// UrlSearchParams
let urlSearchParams = new URLSearchParams(window.location.search);

// State
let revenueByYear = [];
let year;

// Element
let yearElement = document.querySelector("#year");
let searchElement = document.querySelector("#search");
let chartContainerElement = document.querySelector(".chart");

// Use State
const setTime = async (y) => {
    year = y;
    await setTimeAction();
}

const setTimeAction = async () => {
    let revenueByYear = await getRevenueByYear();
    setRevenueByYear(revenueByYear);
}

const setRevenueByYearAction = () => {
    let data = [];
    for (let i = 0; i < 12; i++) {
        let x = parseDate(new Date(year, i, 1));
        let find = revenueByYear.find(value => {
            return value.month === i + 1 &&  value.year === year;
        });
        let y = find? find.revenue : 0;
        data.push({x: x, y: y});
    }

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
                        unit: "month"
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

const setRevenueByYear = (y) => {
    revenueByYear = y;
    setRevenueByYearAction();
}

// Use Effect
const useEffect = async () => {
    let year;
    if (urlSearchParams.get("year")) {
        year = parseInt(urlSearchParams.get("year"));
    }
    else {
        let date = new Date();
        year = date.getFullYear();
    }
    yearElement.value = year;
    await setTime(year);
}
// Event
searchElement.onclick = async () => {
    let year = parseInt(yearElement.value);
    await setTime(year);
}
// Function

const getRevenueByYearUrl = () => {
    return `http://localhost:8080/api/v1/admin/revenue-by-year?year=${year}`;
}
const getRevenueByYear = async () => {
    return fetch(getRevenueByYearUrl())
        .then(response => response.json());
}

// Init
await useEffect();