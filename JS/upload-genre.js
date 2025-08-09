const genreList = [];

const genre =  document.querySelectorAll(".genre");
genre.forEach(value=>{
    value.addEventListener('click',()=>{
        if (genreList.includes(value.dataset.genre)) {
            const Index = genreList.indexOf(value.dataset.genre);
         const alu = genreList.splice(Index,1);
         GENRERMV(alu)
         
        } else {
            genreList.push(value.dataset.genre);
            GENRESHOW (genreList)
        }
       
    })
})

function GENRESHOW (value) {
    if (value.length > 0) {
        value.forEach(i=>{
            document.querySelector(`.${i}`).style.color = `black`;
              document.querySelector(`.${i}`).style.background = `rgb(28, 247, 28)`;
        })
    }    
}
function GENRERMV (value) {
    if (value.length > 0) {
        value.forEach(i=>{
            document.querySelector(`.${i}`).style.color = `rgb(0, 255, 0)`;
              document.querySelector(`.${i}`).style.background = `transparent`;
        })
    }    
}

const form = document.querySelector(".container");
const form1 = document.querySelector(".container2");

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    if(genreList.length >0) {
       const INfo = { 
        id : form.ID.value,
        epName :form.name.value,
         Name : form.Name.value,
         ip : form.ip.value ,
         cover : form.cover.value,
         syn : form.syn.value,
         link : form.link.value,
         title : form.title.value,
         aired : form.aired.value,
         premiered : form.Premiered.value,
         ongoing : form.Ongoing.value,
         Status : form.Status.value ,
         mlscore : form.MLScore.value,
         ratings : form.ratings.value,
         studios : form.Studios.value,
         producers : form.Producers.value,
        genre : genreList ,
         des : form.Description.value ,
         type:"iframe"
        }
        fetch("/upload",{
            method:'POST',
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(INfo)
        })
        .then(res=>res.json())
        .then(info=>{
            console.log(info)
        })
        
    }
    else {
        alert("Please Select atleast on Genre");
    }

})

form1.addEventListener('submit',(e)=>{
    e.preventDefault();
       const INfo = { 
        id : form1.ID.value,
        epName :form1.name.value,
         link : form1.link.value,
         title : form1.title.value,
        }
        fetch("/update/info",{
            method:'POST',
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(INfo)
        })
        .then(res=>res.json())
        .then(info=>{
            console.log(info)
        })
        
})



const upLoad = document.querySelector(".upLoad");
const upDate = document.querySelector(".upDate");

upLoad.addEventListener("click",()=>{
    form.style.display ="flex"
    form1.style.display = "none"
})
upDate.addEventListener('click',()=>{
    form1.style.display = "flex"
    form.style.display ="none"
})
