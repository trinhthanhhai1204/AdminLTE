// Import
// States
let orders = [];
let pages = 0;
let currentPage = 0;
let currentSort = 0;
let currentStatus = 0;
let statusMap = [];
let count = 0;

// const
let size = 10;

// Elements
let table = document.querySelector("tbody");
let sortSelector = document.querySelector("#sort-selector");
let statusSelector= document.querySelector("#status-selector");
let card = document.querySelector("#book-table");
let paginationElement = card.querySelector(".pagination");
let info = card.querySelector(".card-footer .row div:first-child p");

// Use States
const setOrders = (o) => {
    orders = o;
    setOrdersAction();
}

const setOrdersAction = () => {
    table.innerHTML = "";
    orders.forEach(({id,consigneeName, address, phone, createAt, finishedAt, orderStatus, customer}) => {
        let createAtTime = createAt ? parseDate(new Date(createAt)) : "";
        let finishedAtTime = finishedAt ? parseDate(new Date(finishedAt)) : "";
        let {id: customerId, username} = customer;
        table.innerHTML += `
            <td class="align-middle">${id}.</td>
            <td class="align-middle"><a href="./orders-by-customer.html?id=${customerId}">${username}</a></td>
            <td class="align-middle">${consigneeName}</td>
            <td class="align-middle">${address}</td>
            <td class="align-middle">${phone}</td>
            <td class="align-middle">${
                orderStatus === "PENDING" ? "<span class='badge bg-warning'>PENDING</span>" 
                    : orderStatus === "SHIPPING" ? "<span class='badge bg-primary'>SHIPPING</span>"
                    : orderStatus === "SUCCESS" ? "<span class='badge bg-success'>SUCCESS</span>"
                        : ""
            }</td>
            <td class="align-middle">${createAtTime}</td>
            <td class="align-middle">${finishedAtTime}</td>
            <td class="align-middle">
                <a href="order-details.html?id=${id}">Show Details</a>
            </td>
        `
    });
}

const setQuery = async (st, s, p) => {
  currentStatus = st;
  await setQueryAction();
  await setPageSort(s, p);
}

const setQueryAction = async () => {
    let count = await getOrdersCount();
    setCount(count);
    let pages = Math.ceil(count / size);
    setPages(pages);
}

const setCount = (c) => {
    count = c;
}

const setPages = (p) => {
    pages = p;
    setPagesAction();
}
const setPagesAction = () => {
    paginationElement.innerHTML = `
        <li class="paginate_button page-item previous">
            <a href="#" class="page-link">Previous</a>
        </li>
    `;

    for (let i = 0; i < pages; i++) {
        paginationElement.innerHTML += `
            <li class="paginate_button page-item ${i === 0? "active": ""}">
                <a href="#" class="page-link">${i + 1}</a>
            </li>
        `;
    }

    paginationElement.innerHTML += `
        <li class="paginate_button page-item next">
            <a href="#" class="page-link">Next</a>
        </li>
    `;

    let paginateButtons = paginationElement.querySelectorAll("li:not(.previous):not(.next) a");
    paginateButtons.forEach(value => {
        value.onclick = async  (e) => {
            e.preventDefault();
            let page = parseInt(value.innerHTML) - 1;
            await setPageSort(currentSort, page);
        }
    });
}

const setPageSort = async (s, p) => {
  currentSort = s;
  currentPage = p;
  await setPageSortAction();
}

const setPageSortAction = async () => {
    let orders = await getOrders();
    setOrders(orders);
    setCurrentSortAction();
    setCurrentPageAction();
}

const setCurrentSortAction = () => {
    let options = sortSelector.querySelectorAll("option");
    options.forEach(option => {
        if (parseInt(option.value) === currentSort) {
            option.selected = true;
        }
    });
};

const setCurrentPageAction = () => {
    let paginateListsPrev = paginationElement.querySelector("li.previous");
    if (currentPage !== 0) {
        paginateListsPrev.classList.remove("disabled");
        let a = paginateListsPrev.querySelector("a");
        a.onclick = async (e) => {
            e.preventDefault();
            await setPageSort(currentSort, currentPage - 1);
        }
    }
    else {
        paginateListsPrev.classList.add("disabled");
    }

    let paginateLists = paginationElement.querySelectorAll("li:not(.previous):not(.next)");
    paginateLists.forEach(value => {
        let a = value.querySelector("a");
        let v = parseInt(a.innerHTML) - 1;
        if (v === currentPage) {
            value.classList.add("active");
        }
        else {
            value.classList.remove("active");
        }
    });

    let paginateListsNext = paginationElement.querySelector("li.next");
    if (currentPage !== pages - 1) {
        paginateListsNext.classList.remove("disabled");
        let a = paginateListsNext.querySelector("a");
        a.onclick = async (e) => {
            e.preventDefault();
            await setPageSort(currentSort, currentPage + 1);
        }
    }
    else {
        paginateListsNext.classList.add("disabled");
    }
    info.innerHTML = `Showing ${currentPage * size + 1} to ${Math.min(currentPage * size + size, count)} of ${count} entries`;
};

// Use Effect
const useEffect = async () => {
    let options = statusSelector.querySelectorAll("option");
    statusMap = [...options].map(e => {
        return {id: parseInt(e.value), name: e.innerHTML.toUpperCase()}
    });

    await setQuery(currentStatus, currentSort, currentPage);
}
// Events
statusSelector.onchange = async () => {
    await setQuery(parseInt(statusSelector.value), 0, 0);
}

sortSelector.onchange = async () => {
    await setPageSort(parseInt(sortSelector.value), 0);
}
// Functions
const url = () => {
    let init = "http://localhost:8080/api/v1/orders" + (currentStatus !== 0 ? `/by-status/${statusMap.find(({id}) => id === currentStatus).name}` : "");
    let query = [];
    if (currentPage !== 0) {
        query.push(`page=${currentPage}`);
    }
    query.push(`size=${size}`);
    query.push(`sort=${getSort()}`);
    return init + "?" + query.join("&");
}

const getSort = () => {
    switch (currentSort) {
        case 2:
            return "createAt,asc";
        default:
            return "createAt,desc";
    }
}
const getOrders = async () => {
    return await fetch(url())
        .then(response => response.json());
}

const getOrdersCountUrl = () => {
    return "http://localhost:8080/api/v1/orders/count" + ((currentStatus !== 0) ? `/by-status/${statusMap.find(({id}) => id === currentStatus).name}`: "");
}

const getOrdersCount = async () => {
    return await fetch(getOrdersCountUrl()).then(response => response.json());
}

const parseDate = (date) => {
    const padStart = (number) => {
        return number.toString().padStart(2, "0");
    };

    return `${padStart(date.getHours())}:${padStart(date.getMinutes())} ${date.getFullYear()}-${padStart((date.getMonth() + 1))}-${padStart(date.getDate())}`;
}
// Init
await useEffect();