const logoutButton = document.querySelector(".logout-div");

logoutButton.addEventListener('click',()=>{
    const endpoit = "/logout"
    fetch(endpoit,{
        method:"GET"
    })
    .then(res=>res.json())
    .then(info=>{
        if(Number(info)===1){
            window.location.href ="/Home"
        }
    })
})