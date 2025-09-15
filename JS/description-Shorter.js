const descrpitionSH = document.querySelector(".description");
const TXT = descrpitionSH.innerText;

let SavedDes = "";
let DesArray = "";
let HTMLDES = "";
if (Number(TXT.length) > 250) {
    SavedDes = TXT;
    DesArray = SavedDes.split("");
    for (let i = 0; i < 250; i++) {
        HTMLDES += DesArray[i];  
    }
    HTMLDES += `<span class="seeMore-btn"> See More </span>`;
    descrpitionSH.innerHTML = HTMLDES;
    HTMLDES = "";
}

if (document.querySelector(".seeMore-btn")) {
    const SeeMore = document.querySelector(".seeMore-btn");
    SeeMore.addEventListener('click',()=>{
        HTMLDES = TXT;
        descrpitionSH.innerHTML = HTMLDES;
        HTMLDES = "";
    })
}