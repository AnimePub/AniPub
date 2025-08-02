const Profile = document.querySelectorAll(".Profile");
Profile.forEach(value=>{
    value.addEventListener('click',()=>{
        const ID = value.dataset.anime;
        const epID = 0 ;
         console.log(ID)
        setTimeout(() => {
            window.location.href=`/AniPlayer/${ID}/0`
        },1000);
    })
})
