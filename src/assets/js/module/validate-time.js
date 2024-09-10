export function validateTime(dateFrom, dateTo) {
    let currentDate = new Date();
    let month = currentDate.getMonth() + 1;
    let date = currentDate.getDate();
    let year = currentDate.getFullYear();

    let dateFromMaxInit = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    let dateFromMaxInitMonth = dateFromMaxInit.getMonth() + 1;
    let dateFromMaxInitDate = dateFromMaxInit.getDate();
    let dateFromMaxInitYear = dateFromMaxInit.getFullYear();

    let dateFromMax = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
    let dateFromMaxMonth = dateFromMax.getMonth() + 1;
    let dateFromMaxDate = dateFromMax.getDate();
    let dateFromMaxYear = dateFromMax.getFullYear();

    dateFrom.value = `${dateFromMaxInitYear}-${dateFromMaxInitMonth.toString().padStart(2, "0")}-${dateFromMaxInitDate.toString().padStart(2, "0")}`
    dateFrom.max = `${dateFromMaxYear}-${(dateFromMaxMonth).toString().padStart(2, "0")}-${dateFromMaxDate.toString().padStart(2, "0")}`;
    dateFrom.onchange = function () {
        if (Date.parse(dateFrom.value) >= Date.parse(dateTo.value)) {
            let newDateTo = new Date(Date.parse(dateFrom.value) + 24 * 60 * 60 * 1000);
            let newDateToMaxMonth = newDateTo.getMonth() + 1;
            let newDateToMaxDate = newDateTo.getDate();
            let newDateToMaxYear = newDateTo.getFullYear();
            dateTo.value = `${newDateToMaxYear}-${newDateToMaxMonth.toString().padStart(2, "0")}-${newDateToMaxDate.toString().padStart(2, "0")}`
        }
    };

    dateTo.value = `${year}-${month.toString().padStart(2, "0")}-${date.toString().padStart(2, "0")}`;
    dateTo.max = `${year}-${month.toString().padStart(2, "0")}-${date.toString().padStart(2, "0")}`;
    dateTo.onchange = function () {
        if (Date.parse(dateFrom.value) >= Date.parse(dateTo.value)) {
            let newDateFrom = new Date(Date.parse(dateTo.value) - 24 * 60 * 60 * 1000);
            let newDateFromMaxMonth = newDateFrom.getMonth() + 1;
            let newDateFromMaxDate = newDateFrom.getDate();
            let newDateFromMaxYear = newDateFrom.getFullYear();
            dateFrom.value = `${newDateFromMaxYear}-${newDateFromMaxMonth.toString().padStart(2, "0")}-${newDateFromMaxDate.toString().padStart(2, "0")}`;
        }
    };
}