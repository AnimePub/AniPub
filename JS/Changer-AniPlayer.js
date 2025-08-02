const link = document.URL;
const newlink = link.split("/");
const AniId = newlink[4];
const AniEp = newlink[5];

const List = document.querySelectorAll(".list");
const list = document.querySelectorAll(".li-fs");
list.forEach(value=>{
    value.addEventListener('click',()=>{
        const EpId = value.dataset.ep;
        window.location.href=`/AniPlayer/${AniId}/${EpId}`         
    })
})
const profile = document.querySelectorAll(".Profile");
List[AniEp].classList.add("Alu")

videojs ('#my-video', {
    controlBar: {
      skipButtons: {
        forward: 10,
        backward: 10,
      }
     },
    playbackRates: [0.5, 1, 1.5, 2], 
    enableSmoothSeeking: true,

  });

profile.forEach(value=>{
    value.addEventListener('click',()=>{
        const AnimeID = Number(value.dataset.anime);

       window.location.href=`/AniPlayer/${AnimeID}/${0}`
    })
})
