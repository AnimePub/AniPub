const link = document.URL;
const newlink = link.split("/");
const AniId = newlink[4];
const AniEp = newlink[5];

const Left = document.querySelector(".fa-arrow-left");
const List = document.querySelectorAll(".episode-card");
const list = document.querySelectorAll(".li-fs");
List.forEach(value=>{
    value.addEventListener('click',()=>{
        const EpId = value.dataset.ep;
        window.location.href=`/AniPlayer/${AniId}/${EpId}`         
    })
})
Left.addEventListener('click',()=>{
  if (AniEp >= 0 ) {
    window.location.href=`/AniPlayer/${AniId}/${Number(EpId-1)}`    
  }
   
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
