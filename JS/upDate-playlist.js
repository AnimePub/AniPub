console.log("%c This is working heh ",
    "color:red ; background-color:white;font-size:60px;border-radius:5px")

const atwb = document.querySelector(".Add-to-watchlist-button");

atwb.addEventListener('click', () => {
    const link = atwb.dataset.animelink;
    const newInfo = link.split("/");

    const AniID = newInfo[4];
    const EpID = newInfo[5];

    fetch("/PlayList/Update", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                AniID,
                EpID
            })
        })
        .then(response => response.json())
        .then(data => {
            checking(data);
        })


})

function checking(data) {
    if (data.includes("PlayList Updated")) {
        //This show a popup
        //for now let's use alert 
        alert("PlayList Updated");
    } else if (data.includes("/Login")) {
        window.location.href = "/Login"
    }
}