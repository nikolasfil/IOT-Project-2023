document.getElementById('searchBarInput').addEventListener('keydown',searchbarClickPress)
document.getElementById('search-button').addEventListener('click',searchbarClick)

/**
 * Assign functionality to the searchbar input space
 * @param {*} event For identifying when the enter button is pressed
 */
function searchbarClickPress(event) {
    if (event.key == "Enter") {
        window.location = "/search?search=" + event.target.value;
    }
}

/**
 * Assign functionality to the searchbar magnifying glass icon 
 */
function searchbarClick() {
    let searchbar = window.document.getElementById("searchBarInput");    
    window.location = "/search?search=" + searchbar.value;
}
