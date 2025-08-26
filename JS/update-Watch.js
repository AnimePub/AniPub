const PFA = window.location.pathname;
const fpfa = PFA.split("/");
const AnimeID = Number(fpfa[2]);
const EpisodeID = Number(fpfa[3]);

if(AnimeID !==NaN && EpisodeID !== NaN) {
    fetch("/WatchList/Updater",{
        method:"POST",
        headers:{
            "Content-Type":"Application/json"
        },
        body:JSON.stringify({AnimeID,EpisodeID})
    })
    .then (response =>response.json())
    .then(info=>{
        console.log(info)
    })
}