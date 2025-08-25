const link = document.URL;
const newlink = link.split("/");
const AniId = newlink[4];
const AniEp = newlink[5];

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
    if (AniEp > 0) {
        window.location.href = `/AniPlayer/${AniId}/${Number(AniEp)-1}`
    }
})
Right.addEventListener('click', () => {

    window.location.href = `/AniPlayer/${AniId}/${Number(AniEp)+1}`

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