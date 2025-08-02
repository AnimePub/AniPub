const text1 = document.querySelector(".text1");
const text2 = document.querySelector(".text2");
const text3 = document.querySelector(".text3");
const title = document.querySelector(".ti-tle");

setInterval(() => {
    text1.innerText = `` ;
    text2.innerText = `` ;
    text3.innerText = `` ;
    title.innerText = ``;
setTimeout(() => {
    title.classList.add("animate");
    title.innerText =`┌──(user(>-<)AniPub)-[~]`;
    text3.classList.remove("animate");
    
}, 0);    

setTimeout (()=> {
    title.classList.remove("title");
    text1.classList.add("animate");
    text1.innerText = `└─$ AniPub`;
    

},3000)
setTimeout (()=> {
    text2.classList.add("animate");
    text2.innerText = `└─$ Fast, Secure and convenient`
    text1.classList.remove("animate");

},4500)
setTimeout(() => {
    text3.classList.add("animate");
    text3.innerText = `└─$ Dattebayo !`;
    text2.classList.remove("animate");
    
}, 11900);


}, 19000);

const devsMessage = document.querySelector("dialog");
document.querySelector(".d-m-button").addEventListener('click', ()=> {
devsMessage.showModal();

})
document.querySelector(".leave").addEventListener('click', ()=> {
    devsMessage.close();
    
    })