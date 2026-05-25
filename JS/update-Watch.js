const PFA = document.querySelector(".Add-to-watchlist-button").dataset.animelink;
const fpfa = PFA.split("/");
const AnimeID = Number(fpfa[4]);
const EpisodeID = Number(fpfa[5]);

if (EpisodeID !== NaN) {
    try {
     const dataRf = await fetch("/refresh")
    let infoRf = dataRf.json()
    if(infoRf.success) {
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
    }
    else {
        console.log(infoRf.error)
    }
}
catch(err) {
    console.log(err)
}
}