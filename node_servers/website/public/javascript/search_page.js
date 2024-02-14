
/** 
 * This function runs everytime the page of search page is loaded 
 */
function mainLoad() {

    // global variable for filters
    window.gFilters = {};
    window.searchBarValue = getSearchBarValue();

    addShowMore();
    addFilterListeners(window.gFilters);
    // in show_pages
    page_initilazation();
}

function getSearchBarValue(){
    let searchBar = document.getElementById("searchBarInput");
    // window.searchBarValue = searchBar.value;
    if (searchBar.value == undefined){
        return ""
    }
    return searchBar.value;
}

/**
 * 
 * fetchResults is used to both fetch the number of results and the results themselves,
 *  simply by changing the variable numbering which is originally false
 * 
 * @param {*} limit 
 * @param {*} offset 
 * @param {*} numbering 
 * @returns 
 */
async function fetchResults(limit = null, offset = null, numbering = false){
    let link,body_data = {} ;

    link = `/fetchResults/${numbering}`

    body_data.offset = offset;
    body_data.limit = limit;
    
    body_data.filters = window.gFilters;
    body_data.searchValue = window.searchBarValue;
    body_data.exclusively = null;

    // Data to be sent as body to the server in order to get back results
    let link_data = {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: {},

    }

    let response =  await fetch(link, link_data).then((res) => {
        // It checks if it should be returning a json or text (which in this case is html code )
        if (numbering){
            return res.json();
        } else {
            // html rendered results ready to just be placed
            return res.text();
        }
    }).then((data) => {
        if (numbering){
            // return only the number of results
            return data[0].count_result;
        }
        // Return the html code
        return data;
    }).catch(error => {
        console.log(error);
    });

    return response;
}

/**
 * Middlware that fetches the books that resulted from the search and sends them 
 * to placeDevices function to be placed into pages  
 * @param {*} limit 
 * @param {*} offset 
 */
async function placeAllDevicesByID(limit = -1, offset = 0) {
    let data = await fetchResults(limit=limit, offset=offset, numbering=false);
    
    let container = document.getElementById("results");
    container.innerHTML = data;
}


mainLoad();