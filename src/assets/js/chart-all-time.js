// Import
import {parseDate} from "../../plugins/chart.js/utils.js";

// State
let revenueAllTime = [];

// Element
let chartContainerElement = document.querySelector(".chart");

// Use State
const setRevenueAllTime = (r) => {
    revenueAllTime = r;
    setRevenueAllTimeAction();
}

const setRevenueAllTimeAction = () => {
    let data = [];
    let years = revenueAllTime.map(({year}) => year).sort((a, b) => a - b);
    let min = years[0];
    let max = years[years.length - 1];
    for (let i = min; i <= max; i++) {
        let x = parseDate(new Date(i, 0, 1));
        let find = revenueAllTime.find(({year}) => {
            return year === i;
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
                        unit: "year"
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

// Use Effect
const useEffect = async () => {
    let revenue = await getRevenueAllTime();
    setRevenueAllTime(revenue);
}

// Function
const getRevenueAllTimeUrl = () => {
    return `http://localhost:8080/api/v1/admin/revenue-all-time`;
}

const getRevenueAllTime = async () => {
    return fetch(getRevenueAllTimeUrl())
        .then(response => response.json());
}

// Init
await useEffect();