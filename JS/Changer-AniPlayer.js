const link = document.URL;
const newlink = link.split("/");
let AniId = newlink[4];
let AniEp = newlink[5];

const Left = document.querySelector(".left-btn");
const Right = document.querySelector(".right-btn")
const List = document.querySelectorAll(".episode-card");

List.forEach(value => {
    value.addEventListener('click', () => {
        const EpId = value.dataset.ep;
        window.location.href = `/AniPlayer/${AniId}/${EpId}`
    })
})
Left.addEventListener('click', () => {
    if(!isNaN(AniEp)){
           window.location.href = `/AniPlayer/${AniId}/${Math.abs(Number(AniEp)-1)}`
    }
    else {
        AniEp = AniEp.split("?");
        AniEp = Math.abs(Number(AniEp[0])-1)  +"?" + AniEp[1]
         window.location.href = `/AniPlayer/${AniId}/${AniEp}`
    }
   
})
Right.addEventListener('click', () => {
    if(!isNaN(AniEp)){
           window.location.href = `/AniPlayer/${AniId}/${Math.abs(Number(AniEp)+1)}`
    }
    else {
        AniEp = AniEp.split("?");
        AniEp = Math.abs(Number(AniEp[0])+1) +"?" + AniEp[1]
         window.location.href = `/AniPlayer/${AniId}/${AniEp}`
    }
})

const Aniprofile = document.querySelectorAll(".anime-card");

Aniprofile.forEach(value => {
    value.addEventListener('click', () => {
        console.log("click")
        const AnimeID = Number(value.dataset.anime);

        window.location.href = `/AniPlayer/${AnimeID}/${0}`
    })
})

if (document.querySelector("video")) {
    videojs('#my-video', {
        controlBar: {
            skipButtons: {
                forward: 10,
                backward: 10,
            }
        },
        playbackRates: [0.5, 1, 1.5, 2],
        enableSmoothSeeking: true,

    });

}