const delButton = document.querySelectorAll(".remove-button");
const ProfileDiv = document.querySelectorAll(".Profile-div");



let lisT = "";

delButton.forEach(
    value=>{
        value.addEventListener('click',()=>{

            clearTimeout(lisT);    
            const listId = value.dataset.del;
            fetch(`/PlayList/Delete/${listId}`,{
                method:"DELETE",
            })
            .then(info=>info.json())
            .then(data=>{
                if(data.includes("Delete Done")) {
                    window.location.reload()
                }
                else {
                    console.log(data);
                }
              
            })
        })
    }
)
ProfileDiv.forEach(value =>{
    value.addEventListener('click',()=>{
    const AniID = value.dataset.anime;
    const epID = value.dataset.ep;
    console.log(AniID,epID);
   lisT = setTimeout(()=>{
        window.location.href = `/AniPlayer/${AniID}/${epID}`
    },3000)
    
})
})