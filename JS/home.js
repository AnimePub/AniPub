const profileButton = document.querySelector(".profile-icon");

profileButton.addEventListener('click',()=>{
    if(profileButton.dataset.account === "guest") {
        window.location.href = "/Login"
        // I will add a modal later ! 
    }
    else {
        window.location.href = `/Profile/${profileButton.dataset.account}`;
    }
})