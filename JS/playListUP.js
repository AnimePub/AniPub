const addButtons = document.querySelectorAll(".watch-list");

addButtons.forEach(
    value=>{
        value.addEventListener('click',()=>{
           const AniID = value.dataset.animeid;
            const EpID = 0;
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