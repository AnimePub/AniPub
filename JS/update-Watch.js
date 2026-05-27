const PFA = document.querySelector(".Add-to-watchlist-button").dataset.animelink;
const fpfa = PFA.split("/");
const AnimeID = Number(fpfa[4]);
const EpisodeID = Number(fpfa[5]);

async function AutoUpdate () {
if (EpisodeID !== NaN) {
    try {
     const dataRf = await fetch("/authmal/refresh")
    let infoRf = dataRf.json()
 
 fetch("/WatchList/Updater", {
            method: "POST",
            headers: {
                "Content-Type": "Application/json"
            },
            body: JSON.stringify({
                AnimeID,
                EpisodeID
            })
        })
        .then(response => response.json())
        .then(info => {
            console.log(info)
        })
    console.log(infoRf);
}
catch(err) {
    console.log(err)
}
}}
AutoUpdate();