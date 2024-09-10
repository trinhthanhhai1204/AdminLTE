// Import
// UrlSearchParams
let urlSearchParams = new URLSearchParams(window.location.search);

// States
let orderDetails = [];
let orderId = 0;
let count = 0;

// Elements
let table = document.querySelector("tbody");
let card = document.querySelector("#book-table");
let title = card.querySelector(".card-title span");
let info = card.querySelector(".card-footer .row div:first-child p");
let breadcrumbElement = document.querySelector(".content-header .breadcrumb");

// Use States
const setOrderId = (o) => {
    orderId = o;
    setOrderIdAction();
}

const setOrderIdAction = () => {
    title.innerHTML = `Orders Details By Order Id: ${orderId}`;

    let currentBreadcrumbLi = document.createElement("li");
    currentBreadcrumbLi.classList.add("breadcrumb-item", "active");
    let currentBreadcrumbA = document.createElement("a");
    currentBreadcrumbA.href = `order-details.html?id=${orderId}`;
    currentBreadcrumbA.innerHTML = "Order Details";

    currentBreadcrumbLi.appendChild(currentBreadcrumbA);
    breadcrumbElement.appendChild(currentBreadcrumbLi);
}

const setOrderDetails = (o) => {
    orderDetails = o;
    setOrderDetailsAction();
}

const setOrderDetailsAction = () => {
    table.innerHTML = "";
    orderDetails.forEach(({option, quantity, price}) => {
        let {id:optionId, name:optionName, image:optionImage, quantity:optionQuantity, book} = option;
        let {id:bookId, name:bookName, image:bookImage, price:bookPrice} = book;
        table.innerHTML += `
            <td class="align-middle">${bookId}.</td>
            <td class="align-middle">${bookName}</td>
            <td class="align-middle"><img class="object-fit-cover" src="${bookImage}" alt=""></td>
            <td class="align-middle">${optionId}</td>
            <td class="align-middle">${optionName}</td>
            <td class="align-middle"><img class="object-fit-cover" src="${optionImage}" alt=""></td>
            <td class="align-middle">${optionQuantity}</td>
            <td class="align-middle">${quantity}</td>
            <td class="align-middle">${bookPrice}$</td>
            <td class="align-middle">${price}$</td>
        `;
    });
}

const setCount = (c) => {
    count = c;
    setCountAction();
}

const setCountAction = () => {
    info.innerHTML = `Showing 1 to ${count} of ${count} entries`;
}

// Use Effect
const useEffect = async () => {
    let orderId = parseInt(urlSearchParams.get("id"));
    setOrderId(orderId);

    let orderDetails = await getOrderDetails();
    setOrderDetails(orderDetails);

    let count = await getOrderDetailsCount();
    setCount(count);
}
// Events

// Functions
const url = () => {
    return `http://localhost:8080/api/v1/order-details/by-order/${orderId}`;
}

const getOrderDetails = async () => {
    return await fetch(url())
        .then(response => response.json());
}

const getOrderDetailsCountUrl = () => {
    return `http://localhost:8080/api/v1/order-details/count/by-order/${orderId}`;
}

const getOrderDetailsCount = async () => {
    return await fetch(getOrderDetailsCountUrl())
        .then(response => response.json());
}

// Init
await useEffect();