
// ---------- Selecting the alert div ---------- 
let modalAlert = document.getElementById("alert-popup");



// ---------- Event listening for the escape key ----------
document.onkeydown = function (evt) {
    evt = evt || window.event;
    if (evt.key == "Escape") {
        modalAlert.style.display = "none";
    }
};

// ---------- Clicking outside the pop up closes the popup ----------
window.onclick = function (event) {
    if (event.target == modalAlert) {
        modalAlert.style.display = "none";
    }
}

// ---------- Adding the functionality of closing ---------- 

let btnAlert = document.getElementById("close-alert");
if (btnAlert) {
    btnAlert.addEventListener('click', function(){
        modalAlert.style.display = "none";
    })
}


