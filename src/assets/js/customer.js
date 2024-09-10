// Import
// States
let customers = [];
let roles = [];
let pages = 0;
let currentPage = 0;
let currentSort = 0;
let count = 0;
let currentRole = 0;
let roleMap = [];

// const
const size = 10;

// Elements
let card = document.querySelector("#book-table");
let table = document.querySelector("tbody");
let sortSelector = document.querySelector("#sort-selector");
let roleSelector = document.querySelector("#role-selector");
let info = card.querySelector(".card-footer .row div:first-child p");
let paginationElement = card.querySelector(".pagination");

// Use States
const setCustomers = (c) => {
    customers = c;
    setCustomersAction();
};

const setCustomersAction = () => {
    table.innerHTML = "";
    console.log(customers);
    customers.forEach(({id, fullName, image, username, gender, phone, role, countOrder, lastPending, orderRemain, orderShipping, orderSuccess, totalPrice}) => {
        let lastPendingTime = lastPending ? parseDate(new Date(lastPending)) : "";
        table.innerHTML += `
        <tr>
            <td class="align-middle">${id}.</td>
            <td class="align-middle">${username}</td>
            <td class="align-middle">${fullName}</td>
            <td class="align-middle"><img style="border-radius: 50%" class="object-fit-cover" src="${image}" alt=""></td>
            <td class="align-middle">${gender}</td>
            <td class="align-middle">${phone}</td>
            <td class="align-middle">${role}</td>
            <td class="align-middle">
                <a href="./orders-by-customer.html?id=${id}">
                    <span class="text-warning mx-1">
                        <i class="fa-light fa-circle-notch d-inline-block"></i>
                        <p class="d-inline-block mb-0">${orderRemain}</p>
                    </span>
                    <span class="text-primary mx-1">
                        <i class="fa-light fa-arrows-rotate d-inline-block"></i>
                        <p class="d-inline-block mb-0">${orderShipping}</p>
                    </span>
                    <span class="text-success mx-1">
                        <i class="fa-light fa-check d-inline-block"></i>
                        <p class="d-inline-block mb-0">${orderSuccess}</p>
                    </span>
                </a>
            </td>
            <td class="align-middle">${totalPrice}$</td>
            <td class="align-middle">${lastPendingTime}</td>
        </tr>
        `;
    })
};

const setCount = (c) => {
    count = c;
}

const setPages = (p) => {
    pages = p;
    setPagesAction();
}

const setRoles = (r) => {
    roles = r;
    setRolesAction();
}

const setRolesAction = () => {
    roleMap = [{id: 0, name: "All Role"}];
    roles.forEach((role, index) => {
        roleMap.push({id: index + 1, name: role});
        roleSelector.innerHTML += `
            <option value="${index + 1}">${role}</option>
        `;
    });
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
const setQuery = async (r, s, p) => {
    currentRole = r;
    await setQueryAction();
    await setPageSort(s, p);
}

const setQueryAction = async () => {
    setCurrentRoleAction();
    let count = await getCustomersCount();
    setCount(count);
    let pages = Math.ceil(count / size);
    setPages(pages);
}

const setCurrentRoleAction = () => {
    let options = roleSelector.querySelectorAll("option");
    options.forEach(option => {
        if (parseInt(option.value) === currentRole) {
            option.selected = true;
        }
    });
};

const setPageSort = async (s, p) => {
    currentSort = s;
    currentPage = p;
    await setPageSortAction();
}

const setPageSortAction = async () => {
    let customers = await getCustomers();
    setCustomers(customers);
    setCurrentSortAction();
    setCurrentPageAction();
}

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
}

const setCurrentSortAction = () => {
    let options = sortSelector.querySelectorAll("option");
    options.forEach(option => {
        if (parseInt(option.value) === currentSort) {
            option.selected = true;
        }
    });
};

// Use Effect
const useEffect = async () => {
    await setQuery(0, 0, 0);

    let roles = await getRoles();
    setRoles(roles);
}

// Events
sortSelector.onchange = async () => {
    await setPageSort(parseInt(sortSelector.value), 0);
}

roleSelector.onchange = async () => {
    await setQuery(parseInt(roleSelector.value), 0, 0);
}

// Functions
const url = () => {
    let init = "http://localhost:8080/api/v1/admin/customer-statistical" + ((currentRole !== 0) ? `/by-role/${roleMap.find(value => value.id === currentRole).name}`: "");
    let query = [];
    if (currentPage !== 0) {
        query.push(`page=${currentPage}`);
    }
    query.push(`size=${size}`);
    if (currentSort !== 0) {
        query.push(`sort=${getSort()}`);
    }
    return init + "?" + query.join("&");
};

const getSort = () => {
    switch (currentSort) {
        case 1:
            return "last_pending,desc&sort=customer_id,asc";
        case 2:
            return "order_remain,desc&sort=customer_id,asc";
        case 3:
            return "total_price,desc&sort=customer_id,asc";
        default:
            return "id,asc";
    }
}

const parseDate = (date) => {
    const padStart = (number) => {
        return number.toString().padStart(2, "0");
    };

    return `${padStart(date.getHours())}:${padStart(date.getMinutes())} ${date.getFullYear()}-${padStart((date.getMonth() + 1))}-${padStart(date.getDate())}`;
}

const getCustomers = () => {
    return fetch(url())
        .then(response => response.json());
}

const getCustomersCountUrl = () => {
    return "http://localhost:8080/api/v1/customers/count" + ((currentRole !== 0) ? `/by-role/${roleMap.find(value => value.id === currentRole).name}`: "");
}

const getCustomersCount = async () => {
    return await fetch(getCustomersCountUrl()).then(response => response.json());
}

const getRoles = async () => {
    return await fetch("http://localhost:8080/api/v1/admin/all-roles")
        .then(response => response.json());
}

// Init
await useEffect();