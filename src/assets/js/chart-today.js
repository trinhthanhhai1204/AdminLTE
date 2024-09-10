// UrlSearchParams
let urlSearchParams = new URLSearchParams(window.location.search);

// State
let date;
let revenueByDate = [];

// Element
let dateElement = document.querySelector("#date");
let searchElement = document.querySelector("#search");
let chartContainerElement = document.querySelector(".chart");

// Use State
const setDate = async (d) => {
    date = d;
    await setDateAction();
}

const setDateAction = async () => {
    let revenueByDate = await getRevenueByDate();
    setRevenueByDate(revenueByDate);
}

const setRevenueByDate = (r) => {
    revenueByDate = r;
    setRevenueByDateAction();
}

const setRevenueByDateAction = () => {
    chartContainerElement.innerHTML = "";

    let labels = [];
    for (let i = 0; i < 24; i++) {
        labels.push(i);
    }

    let data = labels.map(hour => {
        let data = revenueByDate.find(value => {
            return value.hour === hour;
        });

        return data ? {x: `${date} ${data.hour.toString().padStart(2, "0")}:00:00`, y: data.revenue} : {x: `${date} ${hour.toString().padStart(2, "0")}:00:00`, y: 0};
    });

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
                            hour: "HH:mm"
                        },
                        unit: "hour"
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
    let dateUrl = urlSearchParams.get("date");
    let dateStr;

    if (dateUrl) {
        dateStr = dateUrl;
    } else {
        let date = new Date();
        dateStr = `${date.getFullYear()}-${padStart((date.getMonth() + 1))}-${padStart(date.getDate())}`;
    }

    await setDate(dateStr);
    dateElement.value = dateStr;
}
// Event
searchElement.onclick = async () => {
    let date = dateElement.value;
    await setDate(date);
}

// Function
const padStart = (number) => {
    return number.toString().padStart(2, "0");
};

const getRevenueByDate = async () => {
    return fetch(`http://localhost:8080/api/v1/admin/revenue-by-date?date=${date}`)
        .then(response => response.json());
}

// Init
await useEffect();