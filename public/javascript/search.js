
/** 
 * This function runs everytime the page of search page is loaded 
 */
function mainLoad() {

    // global variable for filters
    window.gFilters = {};

    addShowMore();

    addFilterListeners(window.gFilters);

    page_initilazation();

}


/**
 * Makes a post request to the server to return all the books that match with the title given by the global variable that takes the value from the searchbar input 
 * @param {*} limit This limits the results we want back
 * @param {*} offset Returns books after the number offset 
 * @returns a list of json objects corresponding to book attributes 
 */
async function fetchAllBooksByTitle(limit = -1, offset = 0) {

    let link;

    link = '/fetch_filters'

    return await fetch(link, {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify({ "filters": window.gFilters, "title": window.searchBarValue, "offset": offset, "limit": limit }),

    }).then((res) => {
        return res.json();
    }).then((data) => {
        return data;
    }).catch(error => {
        console.log(error);
    });
}


/**
 * Returns the number of results we would get with the title and filters that the user searched 
 * @returns 
 */
async function fetchNumOfResults() {

    let link;

    link = '/fetchNumOfResults'

    return await fetch(link, {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify({ "filters": window.gFilters, "title": window.searchBarValue }),
    }).then((res) => {
        return res.json();
    }).then((data) => {
        return data[0].count_result;
    }).catch(error => {
        console.log(error);
    });
}

/**
 * Middlware that fetches the books that resulted from the search and sends them to placeBooks function to be placed into pages  
 * @param {*} limit 
 * @param {*} offset 
 */
async function placeAllBooksByTitle(limit = -1, offset = 0) {
    let data = await fetchAllBooksByTitle(limit, offset);
    placeBooks(data);
}

/**
 * Takes the resulted books and places them on the page .
 * @param {*} data list of json objects containing corresponding attributes of the book 
 */
function placeBooks(data) {
    let container = document.getElementById("results");
    container.innerHTML = "";


    for (let i = 0; i < data.length; i++) {

        let div = document.createElement("div");
        div.className = "card-img-top card-space";
        div.draggable = "false";

        let a = document.createElement("a");
        a.href = `/book_info/${data[i].isbn}`;
        a.className = "d-flex flex-column align-content-center";

        let img = document.createElement("img");
        img.className = "rounded-corners card-img-class";
        if (data[i].photo == null) {
            data[i].photo = "/img/card_book_default.jpg";
        }
        img.src = data[i].photo;
        img.alt = "photo";
        img.draggable = "false";

        let div2 = document.createElement("div");
        div2.className = "p-2";

        let h6 = document.createElement("h6");
        h6.className = "text-truncate--2"
        h6.innerHTML = `<strong>${data[i].title}</strong>`;

        let p = document.createElement("p");
        p.className = "text-truncate--3"


        div2.appendChild(h6);


        if (data[i].summary) {
            p.innerHTML = `<small>${data[i].summary}</small>`;
            div2.appendChild(p);
        }


        if (data[i].copy_num) {

            let p2 = document.createElement("p");
            // p2.textContent = `Available Copies: ${data[i].copies}`;
            // get the number of available copies 
            p2.innerHTML = `<small>Available Copies: ${data[i].copy_num}</small>`;
            div2.appendChild(p2);
        }


        a.appendChild(img);
        a.appendChild(div2);

        div.appendChild(a);

        container.appendChild(div);


    }
}


// ------------------  Filters ------------------

/**
 * Adds the filter listeners to the checkboxes
 */
function addFilterListeners() {

    let checker = document.getElementsByClassName('form-check');

    for (let i = 0; i < checker.length; i++) {
        let input = checker[i].getElementsByClassName('form-check-input')[0];

        input.addEventListener('change', function () {
            filterOnChange(input, window.gFilters);
            page_initilazation();
        });

    }
}

/**
 * When a filter is toggled a bubble is added to the top of the resulting books 
 * 
 * @param {*} filters Json object contiaing list of filers for every filter the page is handling 
 * @param {*} filterName Name of the filter
 * @param {*} filterType Category (genre, library , availability etc)
 */
function addedBubbleFilters(filters, filterName, filterType) {
    let container = document.getElementById('filter-selection')
    let div = document.createElement('div');
    div.classList.add('selected-filters');
    container.appendChild(div);
    let span = document.createElement('span');

    span.textContent = `${filterType}:${filterName}`;
    if (filters[filterType] === undefined) {
        filters[filterType] = [];
    }
    filters[filterType].push(filterName);

    div.appendChild(span);
    let button = document.createElement('button');
    button.classList.add('btn-close');
    div.appendChild(button);


    div.addEventListener('click', function () {
        container.removeChild(div);
        let checkbox = document.getElementById(filterName);
        checkbox.checked = false;
        filters[filterType].splice(filters[filterType].indexOf(filterName), 1);

        page_initilazation();
    });
}

/**
 * Adds evenet listener to every show more in the filters 
 */
function addShowMore() {

    // get all the buttons that show more, and add listeners to their div , to show it or to hide it
    // and change the button to show 
    let divs = document.getElementsByClassName('div-show-more');
    for (let i = 0; i < divs.length; i++) {
        let button = divs[i].getElementsByClassName('btn-show-more')[0];
        let list = divs[i].getElementsByClassName('scrollable-show-more')[0];
        button.addEventListener('click', function () {
            if (this.textContent == 'Show More') {

                this.textContent = 'Show Less';
                list.classList = 'd-flex flex-column justify-content-start scrollable-show-more'
            }
            else {
                this.textContent = 'Show More';
                list.classList = 'scrollable-show-more collapsed'
            }
        }
        )
    }
}


/**
 * Handles the toggling of the filters 
 * @param {*} inputElement Which filter is toggled
 * @param {*} filters Updating the filter list
 */
function filterOnChange(inputElement, filters) {
    if (inputElement.checked) {
        addedBubbleFilters(filters, inputElement.id, inputElement.classList[2]);

        if (document.getElementById(`${inputElement.classList[2]}-filter-more`)) {
            let moreFilters = document.getElementById(`${inputElement.classList[2]}-filter-more`);
            
            if (moreFilters.length == 0) {
                let button = document.getElementById(`btn-${inputElement.classList[2]}-show-more`);
                button.style.display = 'none';
            }
        }


    }
    else {
        // remove the filter from the filters object
        filters[inputElement.classList[2]].splice(filters[inputElement.classList[2]].indexOf(inputElement.id), 1);

        // remove the filter from the selected filters checker
        let container = document.getElementById('filter-selection');
        let divs = container.getElementsByClassName('selected-filters');

        // check if the filter is in the selected filters and remove it



        for (let j = 0; j < divs.length; j++) {
            if (divs[j].textContent == inputElement.classList[2] + ':' + inputElement.id) {
                container.removeChild(divs[j]);
            }
        }
    }
}
