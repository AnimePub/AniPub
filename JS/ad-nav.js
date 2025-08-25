const adNav = document.querySelector(".ad-info");
const AIB = document.querySelector(".Additional-Info-Box");
let adV = JSON.parse(localStorage.getItem("adV")) || false;

adNav.addEventListener('click', () => {
    if (adV === false) {
        adV = true;
        localStorage.setItem("adV", JSON.stringify(adV))
        display();
    } else if (adV === true) {
        adV = false;
        localStorage.setItem("adV", JSON.stringify(adV))
        display();
    }
})


display();

function display() {
    if (adV === false) {
        AIB.style.display = "none";
        adNav.style.transform = "rotate(0deg)";

    } else if (adV === true) {
        AIB.style.display = "block";
        adNav.style.transform = "rotate(180deg)";
    }
}