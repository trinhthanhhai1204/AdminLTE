// Import
// States
let books = [];
let categories = [];
let currentCategory = 0;
let currentSort = 0;
let pages = 0;
let currentPage = 0;
let count = 0;

// const
const size = 10;

// Elements
let card = document.querySelector("#book-table");
let table = document.querySelector("tbody");
let categorySelector = document.querySelector("#category-selector");
let sortSelector = document.querySelector("#sort-selector");
let info = card.querySelector(".card-footer .row div:first-child p");
let paginationElement = card.querySelector(".pagination");

// Use States
const setBooks = (b) => {
    books = b;
    setBooksAction();
};

const setBooksAction = () => {
    table.innerHTML = "";
    books.forEach(({id, name, image, price}) => {
        table.innerHTML += `
            <tr>
                <td>${id}.</td>
                <td>${name}</td>
                <td><img class="object-fit-cover" src="${image}" alt=""></td>
                <td>${price}$</td>
            </tr>
        `;
    });
};

const setCategories = (c) => {
    categories = c;
    setCategoriesAction();
}

const setCategoriesAction = () => {
    categories.forEach(({id, name}) => {
        categorySelector.innerHTML += `
            <option value="${id}">${name}</option>
        `;
    });
};

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

const setCurrentCategoryAction = () => {
    let options = categorySelector.querySelectorAll("option");
    options.forEach(option => {
        if (parseInt(option.value) === currentCategory) {
            option.selected = true;
        }
    });
};

const setCurrentSortAction = () => {
    let options = sortSelector.querySelectorAll("option");
    options.forEach(option => {
        if (parseInt(option.value) === currentSort) {
            option.selected = true;
        }
    });
};

const setQuery = async (c, s, p) => {
    currentCategory = c;
    await setQueryAction();
    await setPageSort(s, p);
}

const setQueryAction = async () => {
    setCurrentCategoryAction();
    let count = await getBooksCount();
    setCount(count);
    let pages = Math.ceil(count / size);
    setPages(pages);
}

const setPageSort = async (s, p) => {
    currentSort = s;
    currentPage = p;
    await setPageSortAction();
}

const setPageSortAction = async () => {
    let books = await getBooks();
    setBooks(books);
    setCurrentSortAction();
    setCurrentPageAction();
}

// Use Effect
const useEffect = async () => {
    let categories = await getCategories();
    setCategories(categories);

    await setQuery(0, 0, 0);
}

// Events
categorySelector.onchange = async () => {
    await setQuery(parseInt(categorySelector.value), 0, 0);
}

sortSelector.onchange = async () => {
    await setPageSort(parseInt(sortSelector.value), 0);
}
// Functions
const url = () => {
    let init = "http://localhost:8080/api/v1/books" + ((currentCategory !== 0) ? `/by-category/${currentCategory}`: "");
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
            return "id,asc";
        case 3:
            return "price,desc";
        case 4:
            return "price,asc";
        default:
            return "id,desc";
    }
}

const getBooks = () => {
    return fetch(url())
        .then(response => response.json());
}

const getBooksCountUrl = () => {
    return "http://localhost:8080/api/v1/books/count" + (currentCategory === 0 ? "" : `/by-category/${currentCategory}`);
}

const getBooksCount = async () => {
    return await fetch(getBooksCountUrl()).then(response => response.json());
}

const getCategories = async () => {
    return await fetch("http://localhost:8080/api/v1/categories")
        .then(response => response.json());
}

// Init
await useEffect();