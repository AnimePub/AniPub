const GENREL = document.querySelectorAll(".genre");
GENREL.forEach(value=>{
    value.addEventListener('click',()=>{
        const dataGen = value.dataset.genre ;
        window.location.href=`https://anipub.xyz/Search?genre=${dataGen}`
    })
})