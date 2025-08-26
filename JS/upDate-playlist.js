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
            Checking(data);
        })


})

function Checking(data) {
    const toast = document.getElementById('save-toast');
    if (data.includes("PlayList Updated")) {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    } else if (data.includes("/Login")) {
        window.location.href = "/Login"
    } else if (data.includes("Already")) {
        document.querySelector(".notify-span").innerHTML = `Already In The List`
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

}