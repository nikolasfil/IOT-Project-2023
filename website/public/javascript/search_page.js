
/** 
 * This function runs everytime the page of search page is loaded 
 */
function mainLoad() {

    // global variable for filters
    window.gFilters = {};
    
    addShowMore();
    addFilterListeners(window.gFilters);
    // in show_pages
    page_initilazation();
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

    let link_data = {
        method: "POST",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(body_data),

    }

    return await fetch(link, link_data ).then((res) => {
        return res.json();
    }).then((data) => {
        if (numbering){
            // return only the number of results
            return data[0].count_result;
        }
        return data;
    }).catch(error => {
        console.log(error);
    });
}

/**
 * Middlware that fetches the books that resulted from the search and sends them 
 * to placeDevices function to be placed into pages  
 * @param {*} limit 
 * @param {*} offset 
 */
async function placeAllDevicesByID(limit = -1, offset = 0) {
    let data = await fetchResults(limit=limit, offset=offset, numbering=false);
    placeDevices(data);
}

/**
 * Takes the resulted books and places them on the page .
 * @param {*} data list of json objects containing corresponding attributes of the book 
 */
function placeDevices(data) {
    let container = document.getElementById("results");
    container.innerHTML = "";

    for (let i = 0; i < data.length; i++) {
        let div = document.createElement("div");
        div = htmlPlacement(data[i]);
        container.appendChild(div);
    }
}

function htmlPlacement(data){
    let div = document.createElement("div");
    div.className = "card-img-top card-space";
    div.draggable = "false";

    let a = document.createElement("a");
    a.href = `/device_info/${data.serial}`;
    a.className = "d-flex flex-column align-content-center";

        
    let div2 = document.createElement("div");
    div2.className = "p-2";

    let h6 = document.createElement("h6");
    h6.className = "text-truncate--2"
    h6.innerHTML = `<strong>ID: ${data.d_id}</strong>`;
    div2.appendChild(h6);

    let p = document.createElement("p");
    p.className = "text-truncate--3"

    let pserial = document.createElement("p");
    pserial.className = "text-truncate--3"
    pserial.innerHTML = `<small>Serial: ${data.serial}</small>`;
    div2.appendChild(pserial);


    p.innerHTML = `<small>Status: ${data.status}</small>`;
    div2.appendChild(p);



    let p2 = document.createElement("p");
    p2.innerHTML = `<small>Available Battery: ${data.battery}</small>`;
    div2.appendChild(p2);


    let p3 = document.createElement("p");
    p3.innerHTML = `<small>Device Type: ${data.type}</small>`;
    div2.appendChild(p3);

    if (data.u_id){

        let p4 = document.createElement("p");
        p4.innerHTML = `<small>User assigned: ${data.u_id}</small>`;
        div2.appendChild(p4);

        let p5 = document.createElement("p");
        p5.innerHTML = `<small>First name: ${data.first_name}</small>`;
        div2.appendChild(p5);

    }

    a.appendChild(div2);

    div.appendChild(a);

    return div;
}

// ------------------  Filters ------------------

