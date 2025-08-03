

let PShistory = JSON.parse(localStorage.getItem("history")) || false ;
const pvst = document.querySelector(".privacy-settings-container");
const PvstB = document.querySelector(".PVST");




PvstB.addEventListener('click',()=>{
    if (PShistory) {
        
         PShistory = false;
        localStorage.setItem("history",(JSON.stringify(PShistory)))
        DisplayPV ();
          }
    else if (!PShistory){
        
        PShistory = true;
        localStorage.setItem("history", JSON.stringify(PShistory))
        DisplayPV ();
    }

    
    
})

DisplayPV ();
function DisplayPV () {
    

if (PShistory) {
    PvstB.style.transform = "rotate(180deg)";
    pvst.style.display = "block";
}
else if (PShistory === false) {
    PvstB.style.transform = "rotate(0deg)";
    pvst.style.display = "none"
}

}

const input1 = document.querySelector(".input1");
const input2 =  document.querySelector(".input2");
const input3 = document.querySelector(".input3");

const change1 = document.querySelector(".change1");
const change2 = document.querySelector(".change2");
const change3 = document.querySelector(".change3");

change1.addEventListener("click",()=>{
    const value = input1.value;
    pvChange(value,"name");
})
change2.addEventListener("click",()=>{
    const value = input2.value;
     pvChange(value,"mail");
})
change3.addEventListener("click",()=>{
    const value = input3.value ;
     pvChange(value,"pass");
})
const endpoint = "/data/change/"
const pvChange = (value,data) =>{
    if (data === "name") {
         Fetch (value,"name");
    }
    else if (data === "mail") {
        Fetch (value,"mail");
    }
    else if (data === "pass") {
        Fetch (value,"pass");
    }
}
function Fetch (data,type) {
    const AlurBody = {info:data,type};
        fetch(endpoint,{
            method:"POST",
            headers:{"Content-Type":"Application/json"},
            body:JSON.stringify(AlurBody)
        })   
        .then(response=>response.json())
        .then(info=>{
            if(info === 1) {
                alert("Named Changed");
            }
            else if ( info === 2) {
                alert("Email Changed");
            }
            else if (info === 3) {
                alert("Password Changed");
            }
        })
}


