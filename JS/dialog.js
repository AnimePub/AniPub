const share = document.querySelector(".Share-button");
const modal = document.querySelector(".modal-container")
const leave = document.querySelector(".leave");

let Check = false;

share.addEventListener('click',()=>{
        if (Check === false) {
        modal.style.display ="flex";
        document.body.style.overflow ="hidden";
        document.body.style.opacity="0.9"
        Check = true;
}
       
})
leave.addEventListener('click',()=> {
        if (Check === true) {
                modal.style.display ="none";
                document.body.style.overflowY ="scroll";
                document.body.style.opacity="1"; 
                Check = false;
        }
       

})