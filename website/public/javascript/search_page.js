
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

    let container = document.getElementById("results");
    container.innerHTML = "";

    // This for loop could have been replaced by a call in the backend

    for (let i = 0; i < data.length; i++) {
        let div = document.createElement("div");
        div = htmlPlacement(data[i]);
        container.appendChild(div);
    }
}

/**
 * This function is used to add box cards with information about the devices
 */
function htmlPlacement(data){
    // This needs to come from the server side ! 

    let div_box = document.createElement("div");
    div_box.className = "card-img-top card-space";
    div_box.draggable = "false";

    let a_serial = document.createElement("a");
    a_serial.href = `/device_info/${data.serial}`;
    a_serial.className = "d-flex flex-column align-content-center";

    let div_info = document.createElement("div");
    div_info.className = "p-2";

    let h_id = document.createElement("h6");
    h_id.className = "text-truncate--2"
    h_id.innerHTML = `<strong>ID: ${data.d_id}</strong>`;
    div_info.appendChild(h_id);

    let p_status = document.createElement("p");
    p_status.className = "text-truncate--3"
    p_status.innerHTML = `<small>Status: ${data.status}</small>`;
    div_info.appendChild(p_status);

    let p_serial = document.createElement("p");
    p_serial.className = "text-truncate--3"
    p_serial.innerHTML = `<small>Serial: ${data.serial}</small>`;
    div_info.appendChild(p_serial);


    let p_battery = document.createElement("p");
    p_battery.className = "text-truncate--3"
    p_battery.innerHTML = `<small>Available Battery: ${data.battery}</small>`;
    div_info.appendChild(p_battery);


    let p_type = document.createElement("p");
    p_type.className = "text-truncate--3"
    p_type.innerHTML = `<small>Device Type: ${data.type}</small>`;
    div_info.appendChild(p_type);

    if (data.u_id){

        let p_assigned = document.createElement("p");
        p_assigned.innerHTML = `<small>User assigned: ${data.u_id}</small>`;
        div_info.appendChild(p_assigned);

        let p_assigned_name = document.createElement("p");
        p_assigned_name.innerHTML = `<small>First name: ${data.first_name}</small>`;
        div_info.appendChild(p_assigned_name);

    }

    a_serial.appendChild(div_info);

    div_box.appendChild(a_serial);

    return div_box;
}


mainLoad();