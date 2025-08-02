const addButtons = document.querySelectorAll(".Add-button");

addButtons.forEach(
    value=>{
        value.addEventListener('click',()=>{
           const AniID = value.dataset.animeWId;
            const EpID = value.dataset.animeWEid;
            fetch("/PlayList/Update",{
                method:"POST",
                headers:{"content-type":"application/json"},
                body:JSON.stringify({AniID,EpID})
            })
            .then(response => response.json())
            .then(data=>{
                checking (data) ;
            })
        })
    }
)
function checking (data) {
    if(data.includes("PlayList Updated")){
        //This show a popup
        //for now let's use alert 
        alert("PlayList Updated");
    }
    else if (data.includes("/Login")){
        window.location.href="/Login"
    }
}