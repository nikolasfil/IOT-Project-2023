
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