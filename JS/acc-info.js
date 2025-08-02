import { redirect } from "./ad-st-s.js";
const ac_info = document.querySelector(".ac-info");
const aidiv = document.querySelector(".account-info-div");
let acStat = JSON.parse(localStorage.getItem("acstat"))||false;

ac_info.addEventListener('click',()=>{
    if (acStat === false) {
        acStat = true;   
        localStorage.setItem("acstat",JSON.stringify(acStat)); 
        ShowAccInfo ();
    }
    else {
        acStat = false;
        ShowAccInfo ();
        localStorage.setItem("acstat",JSON.stringify(acStat)); 
    }
})


ShowAccInfo ();
function ShowAccInfo () {
    if (acStat === false) {
        aidiv.style.display = "none";
    }    
    else {
        aidiv.style.display = "flex";
    }
}
const AIsB = document.querySelector(".ac-info-save");

AIsB.addEventListener('click',()=>{
    const bio = document.querySelector("textarea").value;
    if (bio.length <= 50) {
        if (Gender || !Gender) {
      
            fetch("/settings/account-info",{
                method:'POST',
                headers:{"content-type":"application/json"},
                body:JSON.stringify({image,Gender,bio})
            })
            .then(info=>info.json())
            .then(data=>{
                redirect(data);
            })
        }
        
    } else {
        // It will be a warning
        alert("Hey There Please make sure your bio is under 50 words")
    }
})
