// Import
// States
let categories = [];
let pages = 0;
let currentPage = 0;
let count = 0;
let currentSort = 0;

// const
const size = 10;

// Elements
let card = document.querySelector("#book-table");
let table = document.querySelector("tbody");
let sortSelector = document.querySelector("#sort-selector");
let info = card.querySelector(".card-footer .row div:first-child p");
let paginationElement = card.querySelector(".pagination");

// Use States
const setCategories = (c) => {
    categories = c;
    setCategoriesAction();
}
const setCategoriesAction = () => {
    table.innerHTML = "";
    categories.forEach(({id, name, image}) => {
        table.innerHTML += `
            <tr>
                <td>${id}.</td>
                <td>${name}</td>
                <td><img class="object-fit-cover" src="${image}" alt=""></td>
            </tr>
        `;
    });
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
        value.onclick = async function (e) {
            e.preventDefault();
            let page = parseInt(value.innerHTML) - 1;
            await setPageSort(page, currentSort);
        }
    });
}

const setCurrentPageAction = () => {
    let paginateListsPrev = paginationElement.querySelector("li.previous");
    if (currentPage !== 0) {
        paginateListsPrev.classList.remove("disabled");
        let a = paginateListsPrev.querySelector("a");
        a.onclick = async function (ev) {
            ev.preventDefault();
            await setPageSort(currentPage - 1, currentSort);
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
        a.onclick = async function (ev) {
            ev.preventDefault();
            await setPageSort(currentPage + 1, currentSort);
        }
    }
    else {
        paginateListsNext.classList.add("disabled");
    }
    info.innerHTML = `Showing ${currentPage * size + 1} to ${Math.min(currentPage * size + size, count)} of ${count} entries`;
}

const setCount = (c) => {
    count = c;
}

const setPageSort = async (p, s) => {
    currentSort = s;
    currentPage = p;
    await setPageSortAction();
}

const setPageSortAction = async () => {
    let categories = await getCategories();
    setCategories(categories);
    setCurrentSortAction();
    setCurrentPageAction();
};

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
    let count = await getCount();
    setCount(count);
    let pages = Math.ceil(count / size);
    setPages(pages);
    await setPageSort(currentPage, currentSort);
}

// Events
sortSelector.onchange = async () => {
    await setPageSort(0, parseInt(sortSelector.value));
}

// Functions
const url = () => {
    let init = "http://localhost:8080/api/v1/categories";
    let query = [];
    if (currentPage !== 0) {
        query.push(`page=${currentPage}`);
    }
    query.push(`size=${size}`);
    query.push(`sort=${getSort()}`);
    return init + "?" + query.join("&");
};

const getSort = () => {
    switch (currentSort) {
        case 2:
            return "id,desc";
        default:
            return "id,asc";
    }
}

const getCategories = async () => {
    return await fetch(url())
        .then(response => response.json());
}

const getCount = async () => {
    return await fetch("http://localhost:8080/api/v1/categories/count")
        .then(response => response.json());
}

// Init
await useEffect();