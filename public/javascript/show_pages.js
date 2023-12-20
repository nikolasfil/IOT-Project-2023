
/** 
 * Initializes the pages for the result 
 * Fetches the number of results, creates the navigation if the number of pages exceeds 1 and calls forth the first page to be displayed 
 */
async function page_initilazation() {

    let numOfResults, numOfPages;

    // removes the previous results  
    document.getElementById('page-selector').innerHTML = ''

    // for the number of page created 
    numOfResults = await showResult();

    window.booksPerPage = 24;

    numOfPages = Math.ceil(numOfResults / window.booksPerPage);

    if (numOfPages > 1) {
        pageNavigationCreation(numOfPages);
    }

    // shows first page of results  
    showPage(1);

}

/**
 * Function for the listener of Next button link of navbar  
 */
function nextPage() {
    let pages = document.getElementsByClassName('page-link');
    let selected = document.getElementsByClassName('selected');

    for (let i = 1; i < pages.length - 2; i++) {
        if (selected[0].id === pages[i].id && i < pages.length - 1) {
            selected[0].classList.remove('selected');
            pages[i + 1].classList.add('selected');
            let page = pages[i + 1].textContent;
            showPage(page);
            break;
        }
    }
}

/**
 * Function for the listener of Previous button link of navbar 
 */

function previousPage() {
    let pages = document.getElementsByClassName('page-link');
    let selected = document.getElementsByClassName('selected');


    for (let i = 1; i < pages.length - 1; i++) {
        if (selected[0].id == pages[i].id && i > 1) {
            selected[0].classList.remove('selected');
            pages[i - 1].classList.add('selected');
            let page = pages[i - 1].textContent;
            showPage(page);
            break;
        }
    }
}

/**
 * Creates the page navigation at the bottom of the page 
 * @param number Number of pages we want the navbar to handle 
 */

function pageNavigationCreation(number = 2) {

    let container = document.getElementById('page-selector');
    container.classList.add('page-selector');
    
    let nav = document.createElement('nav');
    nav.setAttribute('aria-label', "Page navigation");

    container.appendChild(nav);

    let ul = document.createElement('ul');
    ul.classList.add('pagination');

    nav.appendChild(ul)

    createPageNavigationIcon(ul, 'page-previous', 'Previous', function () { previousPage(); })

    middling(ul, number);

    // initial choice for page 
    document.getElementById('page-1').classList.add('selected')

    createPageNavigationIcon(ul, 'page-next', 'Next', function () { nextPage(); })


}


/**
 * Adding the number pages buttons to the navbar
 * @param {*} container Where to create the buttons
 * @param {*} number How many buttons to create
 */
function middling(container, number) {

    for (let i = 0; i < number; i++) {
        createPageNavigationIcon(container, `page-${i + 1}`, `${i + 1}`, function () {

            showPage(i + 1)
            
            // updating the coloring of the page chosen 
            let selected = document.getElementsByClassName('selected');
            selected[0].classList.remove('selected');
            
            // this = is the a element that is appended to the li item to ul (link for the page )
            this.classList.add('selected');
        })
    }
}



/**
* Creates the link buttons for page navigation 
*   @param container is the html item that the button is appended in 
*  @param id The id for the button link
*  @param content The textcontent displayed in the button link
*  @param command What is executed when the listener click is activated
*/
function createPageNavigationIcon(container, id, content, command) {

    let li = document.createElement('li');
    li.classList.add('page-item');
    container.appendChild(li);


    let itemA = document.createElement('a');
    itemA.classList.add('page-link')
    itemA.setAttribute('href', '#')
    itemA.setAttribute('id', id)
    itemA.textContent = content;
    itemA.addEventListener('click', command);

    li.appendChild(itemA);
}

/** 
 * Displays the results of the search 
 * @param number Is the page number called forth to be displayed
 */
function showPage(number) {

    // placeAllBooksBytitle is in the file search.js 
    placeAllBooksByTitle(limit = window.booksPerPage, offset = (number - 1) * window.booksPerPage);
}

/** 
 * @returns The number of results the search page has to handle 
 */
async function showResult() {
    let number = await fetchNumOfResults()
    return number
}
