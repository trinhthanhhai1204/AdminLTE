// Import
import {MONTHS, CHART_COLORS} from "../../plugins/chart.js/utils.js"
// State
let revenueByWeek = [];

// Element
let revenueByWeekElement = document.querySelector("#revenue-by-week");

// Use State
const setRevenueByWeekAction = () => {
    let labels = [];
    for (let i = 0; i < 7; i++) {
        let date = new Date(Date.now() - i * (1000 * 60 * 60 * 24));
        let parse = parseDate(date);
        labels.unshift(parse);
    }

    let data = labels.map(date => {
        let data = revenueByWeek.find(value => {
            return value.date === date;
        });
        return data ? {x: data.date, y: data.revenue} : {x: date, y: 0};
    });

    new Chart(revenueByWeekElement, {
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
}

const setRevenueByWeek = (r) => {
    revenueByWeek = r;
    setRevenueByWeekAction();
}

// Use Effect
const useEffect = async () => {
    let revenueByWeek = await getRevenueByWeek();
    setRevenueByWeek(revenueByWeek);
}
// Event

// Function
const parseDate = (date) => {
    const padStart = (number) => {
        return number.toString().padStart(2, "0");
    };

    return `${date.getFullYear()}-${padStart((date.getMonth() + 1))}-${padStart(date.getDate())}`;
}

const getRevenueByWeek = async () => {
    return fetch("http://localhost:8080/api/v1/admin/revenue-by-week")
        .then(response => response.json());
}

// Init
await useEffect();